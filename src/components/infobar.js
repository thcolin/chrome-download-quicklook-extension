const html = require('bel')

export default function infobar(item) {
  return html`
    <span>
      ${bhumanize(item.speed, '/s')} - ${bhumanize(item.bytesReceived)} on ${bhumanize(item.totalBytes)}, ${dhumanize(item.estimatedRemainingTime)}
    </span>
  `

  function dhumanize (milliseconds) {
    // humanize duration
    let days, hours, minutes, seconds
    seconds = Math.floor(milliseconds / 1000)
    minutes = Math.floor(seconds / 60)
    hours = Math.floor(minutes / 60)
    days = Math.floor(hours / 24)
    seconds = (seconds % 60) || 1
    minutes = minutes % 60
    hours = hours % 24
    days = days

    return Object.keys({days, hours, minutes, seconds})
      .map(key => {
        switch (key) {
          case 'days':
            return !days ? null : [days, 'days'].join(' ')
          case 'hours':
            return days || !hours ? null : [hours, 'hours'].join(' ')
          case 'minutes':
            return days || hours || !minutes ? null : [minutes, 'min'].join(' ')
          case 'seconds':
            return days || hours || minutes ? null : [seconds, 's'].join(' ')
        }
      })
      .filter(value => value)
      .join(' ')
  }

  function bhumanize (bytes, suffix = '') {
    // humanize bytes
    let e = (Math.log(bytes) / Math.log(1e3)) | 0;
    return `${+((bytes || 0) / Math.pow(1e3, e)).toFixed(2)} ${'kMGTPEZY'[e - 1] || ''}o` + suffix
  }
}
