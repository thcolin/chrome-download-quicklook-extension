import { css } from 'glamor'
import card from 'components/card'
import placeholder from 'components/placeholder'
const html = require('choo/html')

export default function list(state, emit) {
  const regex = new RegExp(state.input, 'gi')
  const results = state.items.result
    .filter(id => !state.input || state.items.entities[id].url.match(regex) || state.items.entities[id].filename.split('/').pop().match(regex))
  const styles = {
    list: css({
      display: 'flex',
      flexDirection: 'column',
      width: '400px',
      minHeight: '300px',
      maxHeight: '500px',
      overflowY: 'scroll'
    })
  }

  return html`
    <div className=${styles.list}>
      ${results.length ? results.map(id => card(id, state, emit)) : placeholder(state.input ? 'No search results found' : 'Nothing to see here...')}
    </div>
  `
}
