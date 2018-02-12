import { css } from 'glamor'
const html = require('choo/html')

export default function toolbar(state, emit) {
  const styles = {
    toolbar: css({
      background: '#3367d6',
      display: 'flex',
      justifyContent: 'space-between',
      padding: '10px'
    }),
    search: css({
      position: 'relative'
    }),
    input: css({
      background: 'rgba(0, 0, 0, 0.22)',
      border: 'none',
      borderRadius: '2px',
      fontSize: '14px',
      color: 'white',
      padding: '7px 35px',
      outline: 'none',
      '::placeholder': {
        color: 'rgba(255, 255, 255, 0.7)'
      }
    }),
    icon: css({
      position: 'absolute',
      color: 'rgba(255, 255, 255, 0.7)',
      fontSize: '18px'
    }),
    loupe: css({
      padding: '7px 0 6px 10px'
    }),
    cancel: css({
      right: 0,
      cursor: 'pointer',
      padding: '9px 7px 8px',
      fontSize: '14px'
    }),
    button: css({
      background: 'transparent',
      border: 'none',
      color: 'white',
      outline: 'none',
      cursor: 'pointer'
    }),
    none: css({
      display: 'none'
    })
  }

  return html`
    <div className=${styles.toolbar}>
      <button type="button" title="Open Downloads" className=${styles.button} onclick=${full}>
        <i class="material-icons">subject</i>
      </button>
      <div className=${styles.search}>
        <i className=${[styles.icon, styles.loupe, 'material-icons'].join(' ')}>search</i>
        <i className=${[styles.icon, styles.cancel, !state.input.length && styles.none, 'material-icons'].join(' ')} onclick=${cancel}>cancel</i>
        <input type="text" className=${styles.input} value=${state.input} placeholder="Search downloads" oninput=${search}>
      </div>
      <button type="button" title="Clear All" className=${styles.button} onclick=${clear}>
        <i class="material-icons">delete</i>
      </button>
    </div>
  `

  function full () {
    chrome.tabs.create({url: 'chrome://downloads/'})
  }

  function search (e) {
    emit('cdme:input', e.target.value)
  }

  function cancel () {
    emit('cdme:input', '')
  }

  function clear () {
    emit('cdme:clear')
  }
}
