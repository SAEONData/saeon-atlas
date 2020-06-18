import React from 'react'
import { Fab } from '@material-ui/core'
import { Info as InfoIcon } from '@material-ui/icons'
import { MenuContext, DragMenu } from '@saeon/snap-menus'
import AboutContent from '../about'
import packageJson from '../../../../../package.json'
import useStyles from '../../style'
import { isMobile } from 'react-device-detect'

export default () => {
  const classes = useStyles()
  return (
    <MenuContext.Consumer>
      {({ addMenu, removeMenu, getMenuById }) => {
        return (
          <>
            <div style={{ clear: 'both' }} />
            <Fab
              size="large"
              color="primary"
              style={{ float: 'right', marginTop: 12, marginRight: 12 }}
              className={classes.menuIcon}
              aria-label="toggle config menu"
              onClick={() => {
                const id = 'configMenu'
                if (getMenuById(id)) {
                  removeMenu(id)
                } else {
                  addMenu({
                    id,
                    Component: props => (
                      <DragMenu
                        title={`About ${packageJson.name}`}
                        defaultSnap={isMobile ? 'Top' : 'Top'}
                        {...props}
                      >
                        {() => <AboutContent />}
                      </DragMenu>
                    ),
                  })
                }
              }}
            >
              <InfoIcon />
            </Fab>
          </>
        )
      }}
    </MenuContext.Consumer>
  )
}
