import React, { Component } from 'react'
import Map from 'ol/Map'
import View from 'ol/View'
import { mergeLeft } from 'ramda'
import { defaults as defaultControls } from 'ol/control.js'

export default class extends Component {
  constructor(props) {
    super(props)

    // DOM reference used by THIS component
    this.mapRef = React.createRef()

    // Create a map reference
    this.map = new Map({
      layers: [...this.props.layers],
      controls: defaultControls({
        zoom: false,
        rotateOptions: false,
        rotate: false,
        attribution: false
      }).extend([
        // Specify controls externally to this component?
      ]),
      view: new View(
        mergeLeft(this.props.viewOptions || {}, {
          center: [0, 0],
          zoom: 2.5,
          projection: 'EPSG:4326'
        })
      )
    })
  }

  componentDidMount() {
    this.map.setTarget(this.mapRef.current)
  }

  shouldComponentUpdate = async () =>
    await new Promise(res =>
      setTimeout(() => {
        this.map.updateSize()
        res(false)
      }, 350)
    )

  componentWillUnmount() {
    this.map.dispose()
  }

  render() {
    const { children, style, className } = this.props
    const { map, mapRef } = this
    return (
      <div className={className} style={style}>
        {children ? children({ map }) : null}
        <div ref={mapRef} style={{ width: '100%', height: '100%' }} />
      </div>
    )
  }
}
