import toolbar from 'views/toolbar'
import list from 'views/list'
const html = require('choo/html')

export default function main(state, emit) {
  return html`
    <div>
      ${toolbar(state, emit)}
      ${list(state, emit)}
    </div>
  `
}
