import makeStyles from '@material-ui/core/styles/makeStyles'
import { blue, deepOrange, green, purple } from '@material-ui/core/colors'

export default makeStyles(theme => ({
  layout: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
  },
  pushDown: {
    marginTop: 48,
  },
  pre: Object.fromEntries(Object.entries(theme.pre).filter(([key]) => key !== 'backgroundColor')),

  toolbar: {
    backgroundColor: theme.palette.secondary.light,
    borderBottom: `1px solid ${theme.palette.secondary.dark}`,
    display: 'flex',
    justifyContent: 'flex-start',
    boxSizing: 'content-box',
  },

  smallAvatar: {
    width: theme.spacing(2),
    height: theme.spacing(2),
    fontSize: 10,
    backgroundColor: deepOrange[500],
  },

  blue: {
    backgroundColor: blue[500],
  },

  green: {
    backgroundColor: green[500],
  },

  purple: {
    backgroundColor: purple[500],
  },

  content: {
    position: 'relative',
    height: 'calc(100% - 48px)',
  },

  playButton: {
    marginRight: theme.spacing(1),
  },
  saveButton: {
    marginLeft: 'auto',
  },
  tab: {
    minWidth: 30,
  },
  msgBox: {
    padding: theme.spacing(1),
    fontFamily: 'monospace',
  },
}))
