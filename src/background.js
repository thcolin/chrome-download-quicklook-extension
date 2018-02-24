chrome.downloads.setShelfEnabled(false)

chrome.runtime.onInstalled.addListener(() => chrome.downloads.setShelfEnabled(false))
chrome.runtime.onStartup.addListener(() => chrome.downloads.setShelfEnabled(false))

chrome.downloads.onCreated.addListener(item => refresh())

chrome.runtime.onMessage.addListener(request => {
  switch (request.action) {
    case 'draw':
      draw(request.payload)
    break
  }
})

let tid = -1
let progress

refresh()

function refresh () {
  tid = -1

  chrome.downloads.search({
    state: 'in_progress',
    limit: 0
  }, items => {
    let current = items
      .map(item => (item.bytesReceived / item.totalBytes) * 100)
      .reduce((total, current, index, array) => index === (array.length - 1) ? Math.ceil((total + current) / array.length) : total + current, 0)

    if (progress !== current) {
      progress = current
      draw(progress)
    }

    if (items.length && tid < 0) {
      tid = setTimeout(refresh, 200)
    }
  })
}

function draw (progress) {
  let size = 128
  let svg = icon(progress, size)
  let img = document.createElement('img')
  let canvas = document.createElement('canvas')
  let context = canvas.getContext('2d')

  img.setAttribute('src','data:image/svg+xml;base64,' + btoa(svg))
  img.onload = () => {
    context.drawImage(img, 0, 0)
    chrome.browserAction.setIcon({
      imageData: context.getImageData(0, 0, size, size)
    })
  }
}

function icon (progress, size) {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" height="${size + 'px'}" width="${size + 'px'}" viewBox="0 0 24 24">
      <polygon id="arrow" fill="${progress ? '#3367d6' : '#666666'}" points="21.884692 8.472682 16.236297 8.472682 16.236297 8.9e-05 7.763704 8.9e-05 7.763704 8.472682 2.115309 8.472682 12.000001 18.357374 21.884693 8.472682"/>
      <rect id="meter" fill="${progress ? '#b3b3b3' : '#666666'}" x="0.7" y="21.2" width="22.6" height="2.8"/>
      <rect id="bar" fill="#3367d6" x="0.7" y="21.2" width="${progress / (100 / 22.6)}" height="2.8"/>
    </svg>
  `.replace(/\s{2,}/g, '')
}
