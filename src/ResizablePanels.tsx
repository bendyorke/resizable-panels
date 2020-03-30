import React, {FunctionComponent, ReactNode} from 'react'
import './ResizablePanels.css'

type PanelProps = {
  height?: number | string
  width?: number | string
}

const Panel: FunctionComponent<PanelProps> = ({
  height = '100%',
  width = '100%',
}) => {
  return (
    <div className="Panel" style={{height, width}}>
      <header className="Panel-controls">
        <div className="Panel-control">🀱 </div>
        <div className="Panel-control Panel-controlHSplit">🁣 </div>
      </header>
      <main className="Panel-main" style={{minHeight: 36}}></main>
      <footer className="Panel-footer"></footer>
    </div>
  )
}

type RowProps = {}

const Row: FunctionComponent<RowProps> = () => {
  return (
    <div className="Row">
      <Panel />
    </div>
  )
}

type ColProps = {}

const Col: FunctionComponent<ColProps> = () => {
  return <div>Row</div>
}

type ResizablePanelsType = {
  Row: FunctionComponent<RowProps>
  Col: FunctionComponent<ColProps>
}

type ResizablePanelsProps = {
  children?: ReactNode
}

const ResizablePanels: FunctionComponent<ResizablePanelsProps> &
  ResizablePanelsType = ({children}) => {
  return <div className="ResizablePanels">{children || <Row />}</div>
}

// Assign Row and Col components to default export
ResizablePanels.Row = Row
ResizablePanels.Col = Col

export default ResizablePanels
