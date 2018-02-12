import devtools from 'choo-devtools'
import choo from 'choo'
import store from 'store'
import main from 'views/main'

const app = choo()
app.use(devtools())
app.use(store)
app.route('*', main)
app.mount('#mount')
