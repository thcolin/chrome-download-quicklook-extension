const html = require('choo/html')

export default function toolbar(state, emit) {
  return html`
    <div>
      <button type="button" onclick=${full}>*</button>
      <input type="search" value=${state.input} placeholder="Search" onkeyup=${search}>
      <button type="button" onclick=${clear}>-</button>
    </div>
  `

  function full () {
    chrome.tabs.create({url: "chrome://downloads/"})
  }

  function search (e) {
    emit('cdme:input', e.target.value)
  }

  function clear () {
    emit('cdme:clear')
  }
}
