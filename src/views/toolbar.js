import search from 'components/search'
import button from 'components/button'
const html = require('choo/html')

export default function mainView(state, emit) {
  return html`
    <div>
      ${search(state.input, emit)}
      ${button({ text: '+', onclick: () => emit('cdme:add') })}
    </div>
  `
}
