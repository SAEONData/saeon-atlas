import React, { useContext, forwardRef } from 'react'
import { MapContext } from '../../../../../modules/provider-map'
import { debounce } from '../../../../../lib/fns'
import {
  Box,
  Card,
  CardHeader,
  AppBar,
  Toolbar,
  Icon as IconButton,
  Typography,
  Tooltip,
  Collapse,
  CardContent,
  Slider,
} from '@material-ui/core'
import {
  DragIndicator,
  ExpandLess,
  ExpandMore,
  Delete as DeleteIcon,
  Visibility,
  VisibilityOff,
} from '@material-ui/icons'
import QuickForm from '@saeon/quick-form'

export default () => {
  const { proxy } = useContext(MapContext)

  console.log(proxy.getLayers().getArray())

  return (
    // Application layers
    <Box m={1}>
      {proxy
        .getLayers()
        .getArray()
        .map(layer => {
          const id = layer.get('id')
          const title = layer.get('title')
          const visible = layer.get('visible')

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
                            <IconButton
                              style={{ marginLeft: 'auto' }}
                              onClick={() => updateForm({ expanded: !expanded })}
                            >
                              {expanded ? (
                                <ExpandLess fontSize="small" />
                              ) : (
                                <ExpandMore fontSize="small" />
                              )}
                            </IconButton>

                            {/* Toggle layer visibility */}
                            <IconButton onClick={() => layer.setVisible(!visible)}>
                              {visible ? (
                                <Visibility fontSize="small" />
                              ) : (
                                <VisibilityOff fontSize="small" />
                              )}
                            </IconButton>

                            {/* Delete layer */}
                            <IconButton
                              onClick={() => proxy.removeLayer(layer)}
                              style={{ marginRight: 10 }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Toolbar>
                        </AppBar>
                      ))}
                    />

                    {/* Content */}
                    <Collapse in={expanded}>
                      <CardContent>
                        <QuickForm
                          effects={[debounce(({ value }) => layer.setOpacity(value / 100))]}
                          value={layer.get('opacity') * 100}
                        >
                          {({ updateForm, value }) => {
                            return (
                              <div style={{ margin: '5px 0', paddingRight: 5, width: '100%' }}>
                                <Typography style={{ display: 'table-cell', paddingRight: 20 }}>
                                  Opacity
                                </Typography>

                                <Slider
                                  style={{ display: 'table-cell' }}
                                  value={value}
                                  onChange={(e, v) => updateForm({ value: v })}
                                  step={0.00001}
                                  marks={false}
                                  min={1}
                                  max={100}
                                  valueLabelDisplay="off"
                                />
                              </div>
                            )
                          }}
                        </QuickForm>
                      </CardContent>
                    </Collapse>
                  </Card>
                )}
              </QuickForm>
            </div>
          )
        })}
    </Box>

    // Base layers
  )
}