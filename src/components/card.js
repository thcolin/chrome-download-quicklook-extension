import { css } from 'glamor'
const html = require('bel')

export default function card (id, state, emit) {
  const item = state.items.entities[id]
  const name = String(item.filename || item.url || id).split('/').pop()

  const details = {
    speed: html`<span>${bhumanize(item.speed, '/s')}</span>`,
    progress: html`<span>${bhumanize(item.bytesReceived)} on ${bhumanize(item.totalBytes)}</span>`,
    remaining: html`<span>${item.paused ? 'Paused' : dhumanize(item.estimatedRemainingTime)}</span>`,
    bar: html`<progress value=${item.bytesReceived} max=${item.totalBytes}>0%</progress>`
  }

  const actions = {
    stop: html`<button type="button" onclick=${stop}>stop</button>`,
    retry: html`<a href=${item.url} target="_blank" download>retry</a>`,
    pause: html`<button type="button" onclick=${pause}>pause</button>`,
    resume: html`<button type="button" onclick=${resume}>resume</button>`,
    show: html`<button type="button" onclick=${show}>show</button>`,
    open: html`<button type="button" onclick=${open}>open</button>`
  }

  const styles = {
    card: css({
      position: 'relative',
      background: 'white',
      margin: '10px'
    }),
    remove: css({
      position: 'absolute',
      top: '5px',
      right: '5px',
      background: 'transparent',
      border: 'none',
      color: 'black',
      outline: 'none',
      cursor: 'pointer',
      fontSize: '12px'
    })
  }

  return html`
    <div className=${styles.card} id=${id}>
      <button type="button" className=${styles.remove} onclick=${remove}><i class="material-icons">clear</i></button>
      <h4>${name}</h4>
      <span>[${item.state}]</span>
      <a href=${item.url} target="_blank" download>${item.url}</a>
      <div class="details">
        ${item.state === 'in_progress' && !item.paused ? details.speed : null}
        ${item.state === 'in_progress' && !item.paused ? ' - ' : null}
        ${item.state === 'in_progress' ? details.progress : null}
        ${item.state === 'in_progress' && !item.paused ? ', ' : null}
        ${item.state === 'in_progress' && !item.paused ? details.remaining : null}
        ${item.state === 'in_progress' ? details.bar : null}
      </div>
      <div class="actions">
        ${item.state === 'in_progress' ? (item.paused ? actions.resume : actions.pause) : null}
        ${item.state === 'in_progress' ? actions.stop : null}
        ${item.state === 'interrupted' || (item.state === 'complete' && !item.exists) ? actions.retry : null}
        ${item.state === 'complete' && item.exists ? actions.show : null}
        ${item.state === 'complete' && item.exists ? actions.open : null}
      </div>
    </div>
  `

  function stop () {
    emit('cdme:stop', item.id)
  }

  function pause () {
    emit('cdme:pause', item.id)
  }

  function resume () {
    emit('cdme:resume', item.id)
  }

  function remove (e) {
    emit('cdme:remove', item.id)
  }

  function show () {
    emit('cdme:show', item.id)
  }

  function open () {
    emit('cdme:open', item.id)
  }

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
