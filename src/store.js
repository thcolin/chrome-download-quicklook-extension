export const REFRESH_INTERVAL = 1000 // ms

export default function store (state, emitter) {
  state.input = ''
  state.items = {
    entities: {},
    result: []
  }
  state.errors = {
    entities: {},
    result: []
  }

  constructor()

  function constructor() {
    chrome.downloads.search({
      orderBy: ['-startTime'],
      limit: 0
    }, items => emitter.emit('cdme:bootstrap', items))

    chrome.downloads.onCreated.addListener(item => emitter.emit('cdme:add', item, { echo: false }))
    chrome.downloads.onChanged.addListener(delta => emitter.emit('cdme:alter', delta, { echo: false }))
    chrome.downloads.onErased.addListener(id => emitter.emit('cdme:remove', id, { echo: false }))

    // `chrome.downloads.onChanged` don't emit event for bytesReceived and estimatedEndTime change
    setInterval(() => {
      chrome.downloads.search({
        state: 'in_progress',
        limit: 0
      }, items => items.length ? emitter.emit('cdme:refresh', items) : null)
    }, REFRESH_INTERVAL)
  }

  emitter.on('cdme:bootstrap', items => {
    state.items.entities = items.map(embellish).reduce((obj, item) => Object.assign(obj, { [item.id]: item }), {})
    state.items.result = [].concat(items.map(items => items.id))
    emitter.emit('render')
  })

  emitter.on('cdme:input', value => {
    state.input = value
    emitter.emit('render')
  })

  emitter.on('cdme:add', item => {
    state.items.entities[item.id] = embellish(item)
    state.items.result = [item.id].concat(state.items.result)
    emitter.emit('render')
  })

  emitter.on('cdme:refresh', items => {
    emitter.emit('cdme:alter', items
      .filter(item => state.items.result.includes(item.id))
      .map(item => Object.keys(item)
        .filter(key => item[key] !== state.items.entities[item.id][key])
        .reduce((obj, key) => Object.assign(obj, {
          [key]: {
            previous: state.items.entities[item.id][key],
            current: item[key]
          }
        }), { id: item.id })
      ))
  })

  emitter.on('cdme:alter', deltas => {
    (Array.isArray(deltas) ? deltas : [deltas])
      .filter(delta => state.items.result.includes(delta.id))
      .map(carve)
      .forEach(chunk => {
        const item = state.items.entities[chunk.id]
        const estimatedEndTime = !chunk.estimatedEndTime ? {} : { estimatedRemainingTime: new Date(chunk.estimatedEndTime) - new Date() }
        const current = ((chunk.bytesReceived || item.bytesReceived) - item.bytesReceived) * (1000 / REFRESH_INTERVAL)
        const speed = !current ? {} : {
          speed: item.records.concat(current).slice(1).slice(-10).reduce((total, value) => total + value, 0) / Math.min(item.records.length, 10),
          records: item.records.concat(current)
        }

        state.items.entities[chunk.id] = Object.assign(item, chunk, estimatedEndTime, speed)
      })

    emitter.emit('render')
  })

  emitter.on('cdme:remove', (id, opts = {}) => {
    if (opts.echo !== false) {
      const name = (state.items.entities[id].filename || state.items.entities[id].url || id).split('/').pop()

      chrome.downloads.erase({
        id: id
      }, results => results.includes(id) ? null : emitter.emit('cdme:error', `Unable to erase download ${name}`))
    }

    state.items.result = state.items.result.filter(value => value !== id)
    delete state.items.entities[id]
    emitter.emit('render')
  })

  emitter.on('cdme:clear', () => {
    state.items.entities = {}
    state.items.result = []
    // 'cdme:clear' doesn't call chrome.downloads API
    console.warn("'cdme:clear' doesn't call chrome.downloads API !")
    emitter.emit('render')
  })

  emitter.on('cdme:error', error => {
    const id = state.errors.length || 1
    state.errors.entities[id] = {
      id: id,
      msg: error
    }
    state.errors.result = [id].concat(state.errors.result)
    emitter.emit('render')
  })

  emitter.on('cdme:solve', id => {
    state.errors.result = state.errors.result.filter(value => value !== id)
    delete state.errors.entities[id]
    emitter.emit('render')
  })
}

function embellish (item) {
  return Object.assign(item, {
    records: item.records ? item.records : []
  })
}

function carve (delta) {
  return Object.keys(delta)
    .reduce((obj, key) => Object.assign(obj, { [key]: delta[key].current || delta[key] }), {})
}
