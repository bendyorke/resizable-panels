import React, {useRef, useState, FunctionComponent} from 'react'
import './ResizablePanels.css'
import {computeDistribution} from './helpers'

// PANEL ////////////////////////////////////////////////////////////////////

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
      <main className="Panel-main"></main>
      <footer className="Panel-footer"></footer>
    </div>
  )
}

// DRAGGER //////////////////////////////////////////////////////////////////

type DraggerProps = {
  initDrag: () => void
  direction?: string
}

const Dragger: FunctionComponent<DraggerProps> = ({initDrag, direction}) => {
  return (
    <div
      className={`Dragger ${direction ? 'Dragger-' + direction : ''}`}
      onMouseDown={(): void => initDrag()}
    ></div>
  )
}

// ROW //////////////////////////////////////////////////////////////////////

interface RowPanel {
  width: number
  isCol?: boolean
}

type RowProps = {
  height: number
  initialPanels?: RowPanel[]
}

const Row: FunctionComponent<RowProps> = ({
  height,
  initialPanels = [{width: 50}, {width: 50}],
}) => {
  const rowEl = useRef<HTMLDivElement>(null)
  const [panels, setPanels] = useState<RowPanel[]>(initialPanels)
  const [draggingIndex, setDraggingIndex] = useState<number>(-1)

  const onVSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce((memo: Array<RowPanel>, panel: RowPanel, index: number) => {
        if (panelIndex === index) {
          return memo.concat([
            {width: panel.width / 2},
            {width: panel.width / 2},
          ])
        } else {
          return memo.concat([panel])
        }
      }, [])
    )
  }

  const onHSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce((memo: Array<RowPanel>, panel: RowPanel, index: number) => {
        if (panelIndex === index) {
          return memo.concat([{...panel, isCol: true}])
        } else return memo.concat([panel])
      }, [])
    )
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (rowEl.current) {
      const distribution = computeDistribution({
        start: rowEl.current.offsetLeft,
        size: rowEl.current.clientWidth,
        spread: panels.map(x => x.width),
        targetIndex: draggingIndex,
        dest: event.clientX,
      })

      setPanels(panels.map((panel, i) => ({...panel, width: distribution[i]})))
    }
  }

  const clearDraggingIndex = (): void => setDraggingIndex(-1)

  return (
    <div
      className="Row"
      onMouseEnter={clearDraggingIndex}
      onMouseLeave={clearDraggingIndex}
      onMouseMove={draggingIndex > -1 ? handleMouseMove : undefined}
      onMouseUp={clearDraggingIndex}
      ref={rowEl}
      style={{height: height + '%'}}
    >
      {panels.map(({width, isCol}, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Dragger
              initDrag={(): void => setDraggingIndex(index)}
              direction="horizontal"
            />
          )}
          {isCol ? (
            <Col width={width} />
          ) : (
            <Panel
              width={width}
              onVSplit={onVSplit(index)}
              onHSplit={onHSplit(index)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// COL //////////////////////////////////////////////////////////////////////

interface ColPanel {
  height: number
  isRow?: boolean
}

type ColProps = {
  width: number
  initialPanels?: ColPanel[]
}

const Col: FunctionComponent<ColProps> = ({
  initialPanels = [{height: 50}, {height: 50}],
  width,
}) => {
  const rowEl = useRef<HTMLDivElement>(null)
  const [panels, setPanels] = useState<ColPanel[]>(initialPanels)
  const [draggingIndex, setDraggingIndex] = useState<number>(-1)

  const onHSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce((memo: Array<ColPanel>, panel: ColPanel, index: number) => {
        if (panelIndex === index) {
          return memo.concat([
            {height: panel.height / 2},
            {height: panel.height / 2},
          ])
        } else {
          return memo.concat([panel])
        }
      }, [])
    )
  }

  const onVSplit = (panelIndex: number) => (): void => {
    setPanels(
      panels.reduce((memo: Array<ColPanel>, panel: ColPanel, index: number) => {
        if (panelIndex === index) {
          return memo.concat([{...panel, isRow: true}])
        } else return memo.concat([panel])
      }, [])
    )
  }

  const handleMouseMove = (event: React.MouseEvent<HTMLDivElement>): void => {
    if (rowEl.current) {
      const distribution = computeDistribution({
        start: rowEl.current.offsetTop,
        size: rowEl.current.clientHeight,
        spread: panels.map(x => x.height),
        targetIndex: draggingIndex,
        dest: event.clientY,
      })

      setPanels(panels.map((panel, i) => ({...panel, height: distribution[i]})))
    }
  }

  const clearDraggingIndex = (): void => setDraggingIndex(-1)

  return (
    <div
      className="Col"
      onMouseEnter={clearDraggingIndex}
      onMouseLeave={clearDraggingIndex}
      onMouseMove={draggingIndex > -1 ? handleMouseMove : undefined}
      onMouseUp={clearDraggingIndex}
      ref={rowEl}
      style={{width: width + '%'}}
    >
      {panels.map(({height, isRow}, index) => (
        <React.Fragment key={index}>
          {index > 0 && (
            <Dragger
              initDrag={(): void => setDraggingIndex(index)}
              direction="vertical"
            />
          )}
          {isRow ? (
            <Row height={height} />
          ) : (
            <Panel
              height={height}
              onVSplit={onVSplit(index)}
              onHSplit={onHSplit(index)}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )
}

// RESIZABLE PANELS /////////////////////////////////////////////////////////

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
