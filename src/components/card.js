const html = require('bel')

export default function card (data, emit) {
  return html`
    <div onclick=${handleClick}>
      card #${data.name}
    </div>
  `

  function handleClick (e) {
    emit('cdme:remove', data.id)
  }
}
