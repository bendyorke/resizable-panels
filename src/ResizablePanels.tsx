import React, {useState, FunctionComponent} from 'react'
import './ResizablePanels.css'

type PanelDimensions = {
  height?: number
  width?: number
}

type PanelProps = PanelDimensions & {
  onHSplit: () => void
  onVSplit: () => void
}

const Panel: FunctionComponent<PanelProps> = ({
  height = 100,
  width = 100,
  onVSplit,
  onHSplit,
}) => {
  return (
    <div className="Panel" style={{height: height + '%', width: width + '%'}}>
      <header className="Panel-controls">
        <div className="Panel-control" onClick={onVSplit}>
          🀱
        </div>
        <div className="Panel-control Panel-controlHSplit" onClick={onHSplit}>
          🁣
        </div>
      </header>
      <main className="Panel-main" style={{minHeight: 36}}></main>
      <footer className="Panel-footer"></footer>
    </div>
  )
}

interface IRowPanel {
  width: number
  isCol?: boolean
}

type RowProps = {
  height: number
  initialPanels?: IRowPanel[]
}

const Row: FunctionComponent<RowProps> = ({
  height,
  initialPanels = [{width: 50}, {width: 50}],
}) => {
  const [panels, setPanels] = useState<IRowPanel[]>(initialPanels)

  const onVSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce(
        (memo: Array<IRowPanel>, {width}: IRowPanel, index: number) => {
          if (panelIndex === index) {
            return memo.concat([{width: width / 2}, {width: width / 2}])
          } else {
            return memo.concat([{width}])
          }
        },
        []
      )
    )
  }

  const onHSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce(
        (memo: Array<IRowPanel>, panel: IRowPanel, index: number) => {
          if (panelIndex === index) {
            return memo.concat([{...panel, isCol: true}])
          } else return memo.concat([panel])
        },
        []
      )
    )
  }

  return (
    <div className="Row" style={{height: height + '%'}}>
      {panels.map(({width, isCol}, index) =>
        isCol ? (
          <Col key={index} width={width} />
        ) : (
          <Panel
            key={index}
            width={width}
            onVSplit={onVSplit(index)}
            onHSplit={onHSplit(index)}
          />
        )
      )}
    </div>
  )
}

interface IColPanel {
  height: number
  isRow?: boolean
}

type ColProps = {
  width: number
  initialPanels?: IColPanel[]
}

const Col: FunctionComponent<ColProps> = ({
  initialPanels = [{height: 50}, {height: 50}],
  width,
}) => {
  const [panels, setPanels] = useState<IColPanel[]>(initialPanels)

  const onHSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce(
        (memo: Array<IColPanel>, {height}: IColPanel, index: number) => {
          if (panelIndex === index) {
            return memo.concat([{height: height / 2}, {height: height / 2}])
          } else {
            return memo.concat([{height}])
          }
        },
        []
      )
    )
  }

  const onVSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce(
        (memo: Array<IColPanel>, panel: IColPanel, index: number) => {
          if (panelIndex === index) {
            return memo.concat([{...panel, isRow: true}])
          } else return memo.concat([panel])
        },
        []
      )
    )
  }

  return (
    <div className="Col" style={{width: width + '%'}}>
      {panels.map(({height, isRow}, index) =>
        isRow ? (
          <Row key={index} height={height} />
        ) : (
          <Panel
            key={index}
            width={100}
            height={height}
            onVSplit={onVSplit(index)}
            onHSplit={onHSplit(index)}
          />
        )
      )}
    </div>
  )
}

type ResizablePanelsType = {
  Row: FunctionComponent<RowProps>
  Col: FunctionComponent<ColProps>
}

type ResizablePanelsProps = {
  children?: React.ReactNode
}

const ResizablePanels: FunctionComponent<ResizablePanelsProps> &
  ResizablePanelsType = ({children}) => {
  return (
    <div className="ResizablePanels">
      <Row initialPanels={[{width: 100}]} height={100} />
    </div>
  )
}

// Assign Row and Col components to default export
ResizablePanels.Row = Row
ResizablePanels.Col = Col

export default ResizablePanels
