export default function store (state, emitter) {
  state.input = ''
  state.items = []
  state.errors = []

  constructor()

  function constructor() {
    chrome.downloads.search({
      orderBy: ['-startTime'],
      limit: 0
    }, items => emitter.emit('cdme:bootstrap', items))

    chrome.downloads.onCreated.addListener(item => emitter.emit('cdme:add', item, { echo: false }))
    // /!\ don't emit for bytesReceived and estimatedEndTime change,
    // need to do it manualy (maybe with a timeinterval searching for "in_progress" items)
    console.warn(`'chrome.downloads.onChanged' don't emit for 'bytesReceived' and 'estimatedEndTime' change, need to do it manualy (maybe with a 'timeinterval' searching for 'item.state === "in_progress"'`)
    chrome.downloads.onChanged.addListener(item => emitter.emit('cdme:edit', item, { echo: false }))
    chrome.downloads.onErased.addListener(id => emitter.emit('cdme:remove', id, { echo: false }))
  }

  emitter.on('cdme:bootstrap', items => {
    state.items = [].concat(items)
    emitter.emit('render')
  })

  emitter.on('cdme:input', value => {
    state.input = value
    emitter.emit('render')
  })

  emitter.on('cdme:add', item => {
    state.items = [item].concat(state.items)
    emitter.emit('render')
  })

  emitter.on('cdme:edit', diff => {
    state.items = state.items.map(item => item.id === diff.id ? Object.assign(item, diff) : item)
    emitter.emit('render')
  })

  emitter.on('cdme:remove', (id, opts = {}) => {
    if (opts.echo !== false) {
      const item = state.items.filter(item => item.id === id)
      const name = (item.filename || item.url).split('/').pop() || id

      chrome.downloads.erase({
        id: id
      }, results => results.includes(id) ? null : emitter.emit('cdme:error', `Unable to erase download ${name}`))
    }

    state.items = state.items.filter(item => item.id !== id)
    emitter.emit('render')
  })

  emitter.on('cdme:clear', () => {
    state.items = []
    // 'cdme:clear' doesn't call chrome.downloads API
    console.warn("'cdme:clear' doesn't call chrome.downloads API !")
    emitter.emit('render')
  })

  emitter.on('cdme:error', error => {
    state.errors = [{
      id: state.errors.length || 1,
      msg: error
    }].concat(state.errors)
    emitter.emit('render')
  })

  emitter.on('cdme:solve', id => {
    state.errors = state.errors.filter(error => error.id !== id)
    emitter.emit('render')
  })
}
