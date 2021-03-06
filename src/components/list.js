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
      width: '400px',
      minHeight: '300px',
      maxHeight: '500px',
      overflowY: 'scroll'
    }),
    container: css({
      display: 'flex',
      flexDirection: 'column'
    })
  }

  return html`
    <div className=${styles.list}>
      <div className=${styles.container}>
        ${results.length ? results.map(id => card(id, state, emit)) : placeholder(chrome.i18n.getMessage(state.input ? 'placeholder_empty' : 'placeholder_nothing'))}
      </div>
    </div>
  `
}
