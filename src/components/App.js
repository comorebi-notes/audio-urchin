import React from 'react'
import * as utils from '../utils'

const App = () => (
  <main className="container py-8">
    <button type="button" className="btn btn-primary" onClick={utils.audio}>
      再生
    </button>
  </main>
)

export default App
