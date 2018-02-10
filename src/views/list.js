import card from 'components/card'
const html = require('choo/html')

export default function list(state, emit) {
  const regex = new RegExp(state.input, 'gi')
  const items = state.items.filter(item => !state.input || item.url.match(regex) || item.filename.split('/').pop().match(regex))

  return html`
    <div>
      ${items.length ? items.map(item => card(item, emit)) : 'placeholder'}
    </div>
  `
}
