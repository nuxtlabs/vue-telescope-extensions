#!/usr/bin/env node

const fs = require('fs')
const path = require('path')
const archiver = require('archiver')

const argv = require('minimist')(process.argv.slice(2))
const browser = argv['build-browser'] || 'chrome'
const isFireFox = browser === 'firefox'

const DEST_DIR = path.join(__dirname, `../dist${isFireFox ? '-firefox' : ''}`)
const DEST_ZIP_DIR = path.join(__dirname, '../dist-zip')

const extractExtensionData = () => {
  const extPackageJson = require('../package.json')

  return {
    name: extPackageJson.name,
    version: extPackageJson.version
  }
}

const makeDestZipDirIfNotExists = () => {
  if (!fs.existsSync(DEST_ZIP_DIR)) {
    fs.mkdirSync(DEST_ZIP_DIR)
  }
}

const buildZip = (src, dist, zipFilename) => {
  console.info(`Building ${zipFilename}...`)

  const archive = archiver('zip', { zlib: { level: 9 } })
  const stream = fs.createWriteStream(path.join(dist, zipFilename))

  return new Promise((resolve, reject) => {
    archive
      .directory(src, false)
      .on('error', err => reject(err))
      .pipe(stream)

    stream.on('close', () => resolve())
    archive.finalize()
  })
}

const main = () => {
  const { name, version } = extractExtensionData()
  const zipFilename = `${name}${isFireFox ? '-firefox' : ''}-v${version}.zip`

  makeDestZipDirIfNotExists()

  buildZip(DEST_DIR, DEST_ZIP_DIR, zipFilename)
    .then(() => console.info('OK'))
    .catch(console.err)
}

main()
