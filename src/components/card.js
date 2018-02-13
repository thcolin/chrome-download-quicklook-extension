import { css } from 'glamor'
const html = require('choo/html')

export default function card (id, state, emit) {
  const item = state.items.entities[id]
  const name = String(item.filename || item.url || id).split('/').pop()

  const styles = {
    card: css({
      position: 'relative',
      display: 'flex',
      background: 'white',
      margin: '10px',
      boxShadow: '0px 1px 3px hsl(0, 0%, 80%)'
    }),
    interrupted: css({
      opacity: 0.7
    }),
    textOverflow: css({
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
      overflow: 'hidden'
    }),
    quicklook: css({
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'stretch',
      padding: '20px',
      borderRight: '1px solid hsl(0, 0%, 90%)'
    }),
    details: css({
      flex: 1,
      padding: '15px 5px 15px 15px'
    }),
    title: css({
      display: 'flex',
      alignItems: 'center',
      margin: '0 0 3px'
    }),
    name: css({
      display: 'inline',
      fontWeight: '600',
      color: 'hsl(0, 0%, 40%)'
    }),
    active: css({
      color: '#3367d6'
    }),
    state: css({
      fontSize: 'smaller',
      color: 'hsl(0, 0%, 40%)',
      textTransform: 'capitalize',
      margin: '0 0 0 5px'
    }),
    link: css({
      textDecoration: 'none',
      fontSize: 'smaller',
      color: 'hsl(0, 0%, 50%)',
      ':hover': {
        color: 'hsl(0, 0%, 40%)'
      }
    }),
    progress: css({
      margin: '5px 0 5px',
      fontSize: 'smaller',
      color: 'hsl(0, 0%, 20%)'
    }),
    meter: css({
      position: 'relative',
      background: 'hsl(0, 0%, 90%)',
      height: '3px',
      width: '100%',
      margin: '7px 0'
    }),
    bar: css({
      display: 'block',
      height: '100%',
      width: `${(item.bytesReceived / item.totalBytes) * 100}%`,
      background: '#367eed',
      transition: 'width 1.5s linear'
    }),
    remove: css({
      alignSelf: 'flex-start',
      background: 'transparent',
      padding: '10px',
      border: 'none',
      outline: 'none',
      cursor: 'pointer'
    }),
    icon: css({
      color: 'hsl(0, 0%, 40%)',
      fontSize: '18px',
      ':hover': {
        color: 'hsl(0, 0%, 30%)'
      }
    }),
    action: css({
      background: 'transparent',
      cursor: 'pointer',
      border: 'none',
      outline: 'none',
      color: 'hsl(0, 0%, 40%)',
      fontSize: '11px',
      fontWeight: '600',
      textTransform: 'uppercase',
      textDecoration: 'none',
      margin: '0 10px 0 0'
    })
  }

  const details = {
    speed: html`<span>${bhumanize(item.speed, '/s')}</span>`,
    progress: html`<span>${bhumanize(item.bytesReceived)} on ${bhumanize(item.totalBytes)}</span>`,
    remaining: html`<span>${item.paused ? 'Paused' : dhumanize(item.estimatedRemainingTime)}</span>`,
    bar: html`<div className=${styles.meter}><span className=${styles.bar}></span></div>`
  }

  const actions = {
    stop: html`<button type="button" className=${styles.action} onclick=${stop}>stop</button>`,
    retry: html`<a href=${item.url} className=${styles.action} target="_blank" download>retry</a>`,
    redo: html`<a href=${item.url} className=${styles.action} target="_blank" download>redo</a>`,
    pause: html`<button type="button" className=${[styles.action, styles.active].join(' ')} onclick=${pause}>pause</button>`,
    resume: html`<button type="button" className=${[styles.action, styles.active].join(' ')} onclick=${resume}>resume</button>`,
    show: html`<button type="button" className=${styles.action} onclick=${show}>show</button>`,
    open: html`<button type="button" className=${styles.action} onclick=${open}>open</button>`
  }

  return html`
    <div className=${[styles.card, item.state === 'interrupted' && styles.interrupted].join(' ')} id=${id}>
      <div className=${styles.quicklook}>
        <i className=${['material-icons', styles.ntm].join(' ')}>insert_drive_file</i>
      </div>
      <div className=${[styles.details, styles.textOverflow].join(' ')}>
        <div className=${styles.title}>
          <div className=${styles.textOverflow}>
            <h3 title=${name} className=${[styles.name, item.state === 'in_progress' && !item.paused && styles.active].join(' ')}>${name}</h3>
          </div>
          <span className=${styles.state}>${item.state}</span>
        </div>
        <a href=${item.url} title=${item.url} className=${styles.link} target="_blank" download>${item.url}</a>
        <div class=${styles.progress}>
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
          ${item.state === 'interrupted' ? actions.retry : null}
          ${item.state === 'complete' && item.exists ? actions.show : null}
          ${item.state === 'complete' && item.exists ? actions.open : null}
          ${item.state === 'complete' && !item.exists ? actions.redo : null}
        </div>
      </div>
      <button type="button" title="Remove" className=${styles.remove} onclick=${remove}>
        <i className=${['material-icons', styles.icon].join(' ')}>clear</i>
      </button>
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
