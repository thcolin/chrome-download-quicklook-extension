const html = require('bel')

export default function search (input, emit) {
  return html`
    <input type="search" value=${input} placeholder="Search" onkeyup=${handleKeyUp}>
  `

  function handleKeyUp (e) {
    emit('cdme:input', e.target.value)
  }
}
