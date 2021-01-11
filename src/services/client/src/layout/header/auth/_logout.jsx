import { Link, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import useStyles from './style'
import { CATALOGUE_API_ADDRESS, CATALOGUE_CLIENT_ADDRESS } from '../../../config'

export default ({ userInfo }) => {
  const classes = useStyles()
  return (
    <Tooltip title="Logout of the SAEON Data Portal">
      <Link
        className={clsx(classes.link)}
        color="inherit"
        variant="overline"
        href={`${CATALOGUE_API_ADDRESS}/logout?redirect=${CATALOGUE_CLIENT_ADDRESS}`}
      >
        Logout {userInfo.email}
      </Link>
    </Tooltip>
  )
}
