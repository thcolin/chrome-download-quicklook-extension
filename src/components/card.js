import infobar from 'components/infobar'
const html = require('bel')

export default function card (id, state, emit) {
  const item = state.items.entities[id]
  const name = String(item.filename || item.url || id).split('/').pop()
  const buttons = {
    stop: html`<button type="button" onclick=${stop}>stop</button>`,
    pause: html`<button type="button" onclick=${pause}>pause</button>`,
    resume: html`<button type="button" onclick=${resume}>resume</button>`
  }


  return html`
    <div>
      <button type="button" onclick=${remove}>-</button>
      <span>[${item.state}]</span>
      <strong>${name}</strong>
      ${item.state === 'in_progress' ? infobar(item) : null}
      ${item.state === 'in_progress' ? buttons.stop : null}
      ${item.state === 'in_progress' ? (item.canResume ? buttons.resume : buttons.pause) : null}
      <br>
      <a href=${item.url}>${item.url}</a>
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
}
