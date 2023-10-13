import { existsSync, lstatSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'
import consola from 'consola'
import { globbySync } from 'globby'
import { merge } from 'schob'
import type { Options } from './unplugin/types'

export const defaultOptions: Options = {
  templateDir: '.i18n',
  exportDir: 'language',
  languages: ['en', 'tr'],
}

export const defaultIndexSchema = {
  hello: 'Hello',
  world: 'World',
}

export const defaultErrorSchema = {
  somethingWentWrong: 'Something went wrong!',
  pageNotFound: 'Page not found!',
}

export function createContext(options: Options = {}, root = process.cwd()) {
  let start = false
  options = Object.assign({}, {
    templateDir: resolve(root, options.templateDir || defaultOptions.templateDir!),
    exportDir: resolve(root, options.exportDir || defaultOptions.exportDir!),
    languages: options.languages || defaultOptions.languages,
    sortObjectKeys: options.sortObjectKeys || true,
  } as Options)
  const templateDir = resolve(root, options.templateDir!)
  const exportDir = resolve(root, options.exportDir!)

  async function onScan() {
    if (!start) {
      consola.info(`[i18n] Scanning for changes...`)
      await initSchemas()
      await initFolders()
      await initLanguages()
    }
    start = true
    await mergeAndSave()
  }

  async function initFolders() {
    /**
     * Check if the template directory exists.
     * If it does not exist, create it.
     * If it exists and is not a directory, throw an error.
     */
    try {
      const data = existsSync(resolve(root, options.templateDir!))
      if (!data)
        mkdirSync(resolve(root, options.templateDir!))
      else if (data && !lstatSync(resolve(root, options.templateDir!)).isDirectory())
        consola.error(`[i18n] Template ${options.templateDir} already exists!, please delete it and restart the server.`)
    }
    catch (error) {
      consola.error(`[i18n] ${error}`)
    }

    /**
     * Check if the export directory exists.
     * If it does not exist, create it.
     * If it exists and is not a directory, throw an error.
     */
    try {
      const data = existsSync(resolve(root, options.exportDir!))

      if (!data)
        mkdirSync(resolve(root, options.exportDir!))

      else if (data && !lstatSync(resolve(root, options.exportDir!)).isDirectory())
        consola.error(`[i18n] Export ${options.exportDir} already exists!, please delete it and restart the server.`)
    }
    catch (error) {
      consola.error(`[i18n] ${error}`)
    }
  }

  async function initSchemas() {
    const isExistTemplateDirJson = globbySync(`${templateDir}/*.json`).length > 0

    if (!isExistTemplateDirJson) {
      writeFileSync(`${templateDir}/index.json`, JSON.stringify(defaultIndexSchema, null, 2))
      writeFileSync(`${templateDir}/error.json`, JSON.stringify(defaultErrorSchema, null, 2))
    }
  }

  async function initLanguages() {
    const isExistExportDirJson = globbySync(`${exportDir}/*.json`, { deep: 1, onlyFiles: true })
    const schema = await getSchema()

    for await (const language of options.languages!) {
      if (!isExistExportDirJson.includes(`${exportDir}/${language}.json`))
        writeFileSync(`${exportDir}/${language}.json`, JSON.stringify(schema, null, 2))
    }
  }

  async function writeSchema(path: string) {
    const _schema = await getSchema()
    const schema = JSON.stringify(_schema, null, 2)

    writeFileSync(path, schema)
  }

  async function getSchema() {
    const schema: Record<string, any> = {}

    const files = globbySync(`${templateDir}/*.json`, { deep: 1, onlyFiles: true })

    for await (const file of files) {
      const path = file.replace(templateDir, '').replace('.json', '').split('/').filter(item => item !== '')

      let current = schema

      for await (const key of path) {
        if (key.includes(' '))
          consola.error(`[i18n] '${key}' key cannot contain space!, please fix it and restart the server.`)

        if (key === 'index') {
          current = schema
        }
        else {
          if (!current[key])
            current[key] = {}

          current = current[key]
        }
      }

      const content = JSON.parse(readFileSync(file, 'utf-8'))

      Object.assign(current, content)
    }
    return schema
  }

  async function mergeAndSave() {
    await initFolders()
    const schema = await getSchema()

    for await (const language of options.languages!) {
      const path = resolve(exportDir, `${language}.json`)
      const content = JSON.parse(readFileSync(path, 'utf-8'))

      let data = merge({
        schema,
        newData: content,
      })

      if (options.sortObjectKeys)
        data = await sortObject(data)

      writeFileSync(path, JSON.stringify(data, null, 2))
    }
  }

  function sortObject(obj: any) {
    /**
     * It sorts the keys of an object, and if the value of a key is an object, it recursively sorts
     * that object's keys as well
     * thank you https://stackoverflow.com/a/72998623/17764989
     */
    const sorted = Object.keys(obj)
      .sort()
      .reduce((accumulator: any, key: any) => {
        if (typeof obj[key] === 'object') {
          // recurse nested properties that are also objects
          if (obj[key] == null) {
            accumulator[key] = null
          }
          else if (Array.isArray(obj[key])) {
            accumulator[key] = obj[key].map(async (item: any) => {
              if (typeof item === 'object')
                return sortObject(item)

              else
                return item
            })
          }
          else {
            accumulator[key] = sortObject(obj[key])
          }
        }
        else {
          accumulator[key] = obj[key]
        }
        return accumulator
      }, {})
    return sorted
  }

  return {
    root,
    options,
    onScan,
    initFolders,
    initSchemas,
    initLanguages,
    writeSchema,
    mergeAndSave,
    sortObject,
  }
}
