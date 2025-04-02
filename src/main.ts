import { mount } from 'svelte'
import './skeleton.css'
import './app.css'
import './custom.css'
import App from './App.svelte'

const app = mount(App, {
  target: document.getElementById('app')!,
})

export default app
