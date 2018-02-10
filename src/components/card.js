const html = require('bel')

export default function card (item, emit) {
  const name = (item.filename || item.url || '').split('/').pop()

  return html`
    <div>
      <button type="button" onclick=${handleClick}>-</button>
      <span>[${item.state}]</span>
      <strong>${name}</strong>
      <br>
      <a href=${item.url}>${item.url}</a>
    </div>
  `

  function handleClick (e) {
    emit('cdme:remove', item.id)
  }
}
