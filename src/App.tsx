import React, {FunctionComponent} from 'react'
import './App.css'
import ResizablePanels from './ResizablePanels'

type AppProps = {}

const App: FunctionComponent<AppProps> = () => {
  return (
    <div className="App">
      <ResizablePanels />
    </div>
  )
}

export default App
