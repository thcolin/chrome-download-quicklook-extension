const html = require('bel')

export default function button (data, emit) {
  return html`
    <button type="button" onclick=${data.onclick}>${data.text}</button>
  `
}
