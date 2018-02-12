import card from 'components/card'
const html = require('choo/html')

export default function list(state, emit) {
  const regex = new RegExp(state.input, 'gi')
  const results = state.items.result
    .filter(id => !state.input || state.items.entities[id].url.match(regex) || state.items.entities[id].filename.split('/').pop().match(regex))

  return html`
    <div>
      ${results.length ? results.map(id => card(id, state, emit)) : 'placeholder'}
    </div>
  `
}
