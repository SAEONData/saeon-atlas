import { CATALOGUE_API_ADDRESS } from '../../config'
import { Button, Tooltip } from '@material-ui/core'
import clsx from 'clsx'
import useStyles from './style'
import NRFIcon from '../../icons/nrf-icon'

export default ({ redirect }) => {
  const classes = useStyles()

  return (
    <Tooltip title={'Login via the SAEON identity server'} placement="bottom-end">
      <span>
        <Button
          fullWidth
          href={`${CATALOGUE_API_ADDRESS}/login/saeon-identity-server?redirect=${redirect}`}
          className={clsx(classes.button)}
          color="primary"
          disableElevation={true}
          variant="outlined"
          startIcon={<NRFIcon style={{ fontSize: 24 }} />}
        >
          Connect with SAEON
        </Button>
      </span>
    </Tooltip>
  )
}