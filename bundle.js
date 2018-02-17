const fs = require('fs')
const path = require('path')
const ChromeExtension = require('crx')

const crx = new ChromeExtension({
  rootDirectory: __dirname,
  privateKey: fs.readFileSync('./key.priv')
})

crx.load(['manifest.json', '_locales/**', 'icon-brand.png', 'index.html', 'icon.png', 'dist/**'])
  .then(self => self.pack())
  .then(buffer => fs.writeFile('./chrome-download-quicklook-extension.crx', buffer, () => console.log('Packaging finished: chrome-download-quicklook-extension.crx')))
