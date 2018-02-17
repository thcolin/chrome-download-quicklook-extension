import { css } from 'glamor'
const html = require('choo/html')

export default function card (id, state, emit) {
  const item = state.items.entities[id]
  const name = String(item.filename || item.url || id).split('/').pop()
  const status = item.state === 'in_progress' ? (item.paused ? 'paused' : 'ongoing') : item.state

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
    icon: css({
      display: 'flex',
      alignItems: 'center',
      alignSelf: 'stretch',
      width: '32px',
      justifyContent: 'center',
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
    dynamic: css({
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

  const labels = {
    days: chrome.i18n.getMessage('carde_time_days'),
    hours: chrome.i18n.getMessage('carde_time_hours'),
    minutes: chrome.i18n.getMessage('carde_time_minutes'),
    seconds: chrome.i18n.getMessage('carde_time_seconds'),
  }

  const icons = {
    system: html`<img src=${item.icon} height="32px" width="32px" />`,
    default: html`<i className="material-icons">insert_drive_file</i>`
  }

  const progress = {
    speed: html`<span>${bhumanize(item.speed, '/s')}</span>`,
    value: html`<span>${bhumanize(item.bytesReceived)} ${[' ', chrome.i18n.getMessage('card_progress_preposition'), ' '].join('')} ${bhumanize(item.totalBytes)}</span>`,
    remaining: html`<span>${dhumanize(item.estimatedRemainingTime, labels)}</span>`,
    bar: html`<div className=${styles.meter}><span className=${styles.bar}></span></div>`
  }

  const actions = {
    stop: html`<button type="button" className=${styles.action} onclick=${stop}>${chrome.i18n.getMessage('card_actions_stop')}</button>`,
    retry: html`<a href=${item.url} className=${styles.action} target="_blank" download>${chrome.i18n.getMessage('card_actions_retry')}</a>`,
    redo: html`<a href=${item.url} className=${styles.action} target="_blank" download>${chrome.i18n.getMessage('card_actions_redo')}</a>`,
    pause: html`<button type="button" className=${[styles.action, styles.active].join(' ')} onclick=${pause}>${chrome.i18n.getMessage('card_actions_pause')}</button>`,
    resume: html`<button type="button" className=${[styles.action, styles.active].join(' ')} onclick=${resume}>${chrome.i18n.getMessage('card_actions_resume')}</button>`,
    show: html`<button type="button" className=${styles.action} onclick=${show}>${chrome.i18n.getMessage('card_actions_show')}</button>`,
    open: html`<button type="button" className=${styles.action} onclick=${open}>${chrome.i18n.getMessage('card_actions_open')}</button>`
  }

  return html`
    <div className=${[styles.card, status === 'interrupted' && styles.interrupted].join(' ')} id=${id}>
      <div className=${styles.icon}>
        ${item.icon ? icons.system : icons.default}
      </div>
      <div className=${[styles.details, styles.textOverflow].join(' ')}>
        <div className=${styles.title}>
          <div className=${styles.textOverflow}>
            <h3 title=${name} className=${[styles.name, status === 'ongoing' && styles.active].join(' ')}>${name}</h3>
          </div>
          <span className=${styles.state}>${chrome.i18n.getMessage('card_status_' + status)}</span>
        </div>
        <a href=${item.url} title=${item.url} className=${styles.link} target="_blank" download>${item.url}</a>
        <div class=${styles.progress}>
          ${status === 'ongoing' ? progress.speed : null}
          ${status === 'ongoing' ? ' - ' : null}
          ${['ongoing', 'paused'].includes(status) ? progress.value : null}
          ${status === 'ongoing' ? ', ' : null}
          ${status === 'ongoing' ? progress.remaining : null}
          ${['ongoing', 'paused'].includes(status) ? progress.bar : null}
        </div>
        <div class="actions">
          ${['ongoing', 'paused'].includes(status) ? (item.paused ? actions.resume : actions.pause) : null}
          ${['ongoing', 'paused'].includes(status) ? actions.stop : null}
          ${status === 'interrupted' ? actions.retry : null}
          ${status === 'complete' && item.exists ? actions.show : null}
          ${status === 'complete' && item.exists ? actions.open : null}
          ${status === 'complete' && !item.exists ? actions.redo : null}
        </div>
      </div>
      <button type="button" title="Remove" className=${styles.remove} onclick=${remove}>
        <i className=${['material-icons', styles.dynamic].join(' ')}>clear</i>
      </button>
    </div>
  `

  function stop () {
    emit('cdqe:stop', item.id)
  }

  function pause () {
    emit('cdqe:pause', item.id)
  }

  function resume () {
    emit('cdqe:resume', item.id)
  }

  function remove (e) {
    emit('cdqe:remove', item.id)
  }

  function show () {
    emit('cdqe:show', item.id)
  }

  function open () {
    emit('cdqe:open', item.id)
  }

  function dhumanize (milliseconds, labels = { days: 'days', hours: 'hours', minutes: 'min', seconds: 's' }) {
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
            return !days ? null : [days, labels.days].join(' ')
          case 'hours':
            return days || !hours ? null : [hours, labels.hours].join(' ')
          case 'minutes':
            return days || hours || !minutes ? null : [minutes, labels.minutes].join(' ')
          case 'seconds':
            return days || hours || minutes ? null : [seconds, labels.seconds].join(' ')
        }
      })
      .filter(value => value)
      .join(' ')
  }

  function bhumanize (bytes, suffix = '') {
    // humanize bytes
    let e = (Math.log(bytes) / Math.log(1e3)) | 0
    return `${+((bytes || 0) / Math.pow(1e3, e)).toFixed(2)} ${'kMGTPEZY'[e - 1] || ''}o` + suffix
  }
}
