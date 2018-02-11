import devtools from 'choo-devtools'
import choo from 'choo'
import { css } from 'glamor'
import store from 'store'
import main from 'views/main'

// `chrome` is a global variable, see [Chrome Platform APIs](https://developer.chrome.com/extensions/api_index)

const app = choo()
app.use(devtools())
app.use(store)
app.route('*', main)
app.mount('#mount')
