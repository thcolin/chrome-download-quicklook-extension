import toolbar from 'components/toolbar'
import list from 'components/list'
const html = require('choo/html')

export default function main(state, emit) {
  return html`
    <div>
      ${toolbar(state, emit)}
      ${list(state, emit)}
    </div>
  `
}
