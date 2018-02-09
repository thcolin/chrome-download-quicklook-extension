var html = require('choo/html')
var devtools = require('choo-devtools')
var choo = require('choo')

// `chrome` is a global variable, see [Chrome Platform APIs](https://developer.chrome.com/extensions/api_index)

var app = choo()
app.use(devtools())
app.use(countStore)
app.route('/index.html', mainView)
app.mount('#mount')

function mainView (state, emit) {
  return html`
    <div>
      <h1>count is ${state.count}</h1>
      <button onclick=${onclick}>Increment</button>
    </div>
  `

  function onclick () {
    emit('increment', 1)
  }
}

function countStore (state, emitter) {
  state.count = 0
  emitter.on('increment', function (count) {
    state.count += count
    emitter.emit('render')
  })
}
