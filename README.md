# Chrome Download Quicklook Extension
💾🔭 A beautiful `Chrome` extension to have a quicklook on your downloads !

## Options
* `hide-deleted` : Will hide download when item file is deleted on filesystem
* `hide-only` : Doesn't delete download history, just hide item

## Cool (but useless)
* equalized `speed`
* rounded `estimatedEndTime`

## Next ?
* [ ] implement `options` (modal ?)
* [ ] implement `quicklook` with `item` icon (use `chrome.downloads.getFileIcon()`)
  * try `callbag` ?
* [ ] implement `delete` action on `card` ?
* [ ] improve `npm run build` (copy `background.js` to `dist`) and fix `npm run dev` (mimic `npm run build`)

## Thanks
* [choojs/choo](https://github.com/choojs/choo)

## See
* [threepointone/glamor documentation](https://github.com/threepointone/glamor)
* [auxdesigner/Material-Design-Download-Manager](https://github.com/auxdesigner/Material-Design-Download-Manager)
* [choojs/choo:example](https://github.com/choojs/choo/blob/master/example)
* [choojs/choo-handbook](https://github.com/choojs/choo-handbook)
* [Chrome Extension documentation](https://developer.chrome.com/extensions/getstarted)
* [Chrome Platform APIs](https://developer.chrome.com/extensions/api_index)
* [Chrome Downloads Extension documentation](https://developer.chrome.com/extensions/downloads)
* [Chrome Download Manager example](https://chromium.googlesource.com/chromium/src/+/master/chrome/common/extensions/docs/examples/api/downloads/download_manager/)
* [Desing inspiration](https://img.gadgethacks.com/img/original/04/64/63596558293372/0/635965582933720464.jpg)
* [Test files](http://speedtest.tele2.net/)
