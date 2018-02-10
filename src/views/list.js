import card from 'components/card'
const html = require('choo/html')

export default function mainView(state, emit) {
  return html`
    <div>
      ${state.downloads.filter(data => !state.input || data.name.includes(state.input)).map(data => card(data, emit))}
    </div>
  `
}
