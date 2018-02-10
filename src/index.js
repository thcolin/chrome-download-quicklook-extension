import devtools from 'choo-devtools'
import choo from 'choo'
import { css } from 'glamor'
import mainView from 'views/main'

// `chrome` is a global variable, see [Chrome Platform APIs](https://developer.chrome.com/extensions/api_index)

var app = choo()
app.use(devtools())
app.use(countStore)
app.route('*', mainView)
app.mount('#mount')

function countStore (state, emitter) {
  state.input = ''
  state.downloads = [
    { id: 1, name: 'a' },
    { id: 2, name: 'b' },
    { id: 3, name: 'c' }
  ]

  emitter.on('cdme:add', () => {
    state.downloads = state.downloads.concat([{
      id: state.downloads[state.downloads.length - 1].id + 1,
      name: Math.random().toString(36).replace(/[0-9]|\./g, '').substr(0, 1)
    }])
    emitter.emit('render')
  })

  emitter.on('cdme:input', (value) => {
    state.input = value
    emitter.emit('render')
  })

  emitter.on('cdme:remove', (id) => {
    state.downloads = state.downloads.filter(data => data.id !== id)
    emitter.emit('render')
  })
}
