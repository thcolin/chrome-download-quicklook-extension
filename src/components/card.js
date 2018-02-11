import infobar from 'components/infobar'
const html = require('bel')

export default function card (id, state, emit) {
  const item = state.items.entities[id]
  const name = String(item.filename || item.url || id).split('/').pop()

  return html`
    <div>
      <button type="button" onclick=${remove}>-</button>
      <span>[${item.state}]</span>
      <strong>${name}</strong>
      ${item.state === 'in_progress' ? infobar(item) : null}
      <br>
      <a href=${item.url}>${item.url}</a>
    </div>
  `

  function remove (e) {
    emit('cdme:remove', item.id)
  }
}
