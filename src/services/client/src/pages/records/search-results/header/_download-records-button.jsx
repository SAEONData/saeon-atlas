import { useContext, useState } from 'react'
import { IconButton, Tooltip, Fade, CircularProgress } from '@material-ui/core'
import DownloadIcon from 'mdi-react/DownloadCircleIcon'
import { context as globalContext } from '../../../../contexts/global'
import StyledBadge from './components/styled-badge'
import { CATALOGUE_API_ADDRESS } from '../../../../config'
import { gql, useApolloClient } from '@apollo/client'
import packageJson from '../../../../../package.json'

const MUTATTION = gql`
  mutation($state: JSON!, $createdBy: String!) {
    persistSearchState(state: $state, createdBy: $createdBy)
  }
`

export default ({ catalogue }) => {
  const client = useApolloClient()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(false)
  const resultCount = catalogue?.records.totalCount
  const { global } = useContext(globalContext)
  const { selectedIds } = global

  if (loading) {
    return (
      <Fade key="loading" in={loading}>
        <CircularProgress thickness={2} size={18} style={{ margin: '0 15px' }} />
      </Fade>
    )
  }

  if (error) {
    throw new Error(`Unable to download records. ${error.message}`)
  }

  return (
    <Fade key="not-loading" in={!loading}>
      <Tooltip title={`Download ${selectedIds?.length || resultCount} metadata records`}>
        <span>
          <IconButton
            onClick={async () => {
              setLoading(true)
              const { error, data } = await client.mutate({
                mutation: MUTATTION,
                variables: {
                  createdBy: `${packageJson.name} v${packageJson.version}`,
                  state: selectedIds.length
                    ? { ids: selectedIds }
                    : Object.fromEntries(
                        Object.entries({ ...global }).filter(([key]) => key !== 'selectedIds')
                      ),
                },
              })

              if (data) {
                window.open(
                  `${CATALOGUE_API_ADDRESS}/metadata-records?search=${data.persistSearchState}`
                )
                setLoading(false)
              }

              if (error) {
                setError(error)
              }
            }}
            disabled={!resultCount || resultCount > 10000}
          >
            <StyledBadge
              color={
                selectedIds?.length || (resultCount && resultCount < 10000) ? 'primary' : 'default'
              }
              badgeContent={selectedIds?.length || resultCount || 0}
              anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
              invisible={false}
            >
              <DownloadIcon />
            </StyledBadge>
          </IconButton>
        </span>
      </Tooltip>
    </Fade>
  )
}