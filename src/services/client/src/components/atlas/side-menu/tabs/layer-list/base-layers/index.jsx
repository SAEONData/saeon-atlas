import React, { useContext, forwardRef } from 'react'
import { MapContext } from '../../../../../../modules/provider-map'
import {
  Box,
  Card,
  CardHeader,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Tooltip,
  Collapse,
  CardContent,
} from '@material-ui/core'
import { DragIndicator, Info as InfoIcon } from '@material-ui/icons'
import QuickForm from '@saeon/quick-form'
import { Slider } from '../../../../../'
import {
  ToggleVisibility,
  DeleteLayer,
  ExpandLayer,
  AddLayer,
} from '../../../../../layer-card-components'

export default () => {
  const { proxy } = useContext(MapContext)

  return (
    <Box style={{ display: 'flex', flexDirection: 'column' }}>
      {proxy
        .getLayers()
        .getArray()
        .map(layer => {
          const id = layer.get('id')
          const title = layer.get('title')
          const visible = layer.get('visible')

          if (id !== 'terrestrisBaseMap') return null

          return (
            <div key={id}>
              <QuickForm>
                {({ updateForm, expanded }) => (
                  <Card style={{ marginBottom: 10 }}>
                    <CardHeader
                      title={
                        <Typography style={{ wordBreak: 'break-word' }} variant="caption">
                          {title.truncate(55)}
                        </Typography>
                      }
                      component={forwardRef(({ children }, ref) => (
                        <AppBar ref={ref} color="default" position="relative" variant="outlined">
                          <Toolbar
                            style={{ paddingRight: 0, paddingLeft: 0, display: 'flex' }}
                            variant="dense"
                          >
                            {/* Drag Icon */}
                            <DragIndicator fontSize="small" style={{ marginRight: 10 }} />

                            {/* Title (comes from CardHeader.title prop) */}
                            <Tooltip placement="right-end" title={title}>
                              <div>{children}</div>
                            </Tooltip>

                            {/* Expand layer info */}
                            <ExpandLayer
                              expanded={expanded}
                              toggleExpanded={() => updateForm({ expanded: !expanded })}
                            />
                          </Toolbar>
                        </AppBar>
                      ))}
                    />

                    {/* Content */}
                    <Collapse in={expanded}>
                      <CardContent style={{ display: 'flex' }}>
                        {/* Toggle layer visibility */}
                        <ToggleVisibility
                          visible={visible}
                          toggleVisible={() => layer.setVisible(!visible)}
                        />

                        {/* Show layer info */}
                        <IconButton
                          size="small"
                          onClick={() => alert('TODO - Add GeoServer/ESRI/Base layer info')}
                        >
                          <InfoIcon fontSize="small" />
                        </IconButton>

                        {/* Delete layer */}
                        <DeleteLayer onClick={() => proxy.removeLayer(layer)} />
                      </CardContent>
                      <CardContent>
                        <Slider
                          defaultValue={layer.get('opacity') * 100}
                          title={'Opacity'}
                          updateValue={({ value }) => layer.setOpacity(value / 100)}
                        />
                      </CardContent>
                    </Collapse>
                  </Card>
                )}
              </QuickForm>
            </div>
          )
        })
        .filter(_ => _)}
      <AddLayer onClick={() => alert('TODO - Allow adding base layers')} />
    </Box>
  )
}