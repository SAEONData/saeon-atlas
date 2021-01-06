import { useState, useContext } from 'react'
import CreateFilterIcon from 'mdi-react/FilterPlusOutlineIcon'
import {
  IconButton,
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  Tooltip,
  DialogContent,
  DialogContentText,
  CircularProgress,
  TextField,
  Typography,
} from '@material-ui/core'
import { useApolloClient, gql } from '@apollo/client'
import { useTheme } from '@material-ui/core/styles'
import { context as databookContext } from '../../../context'
import Autocomplete from '../../../../../components/autocomplete'
import QuickForm from '@saeon/quick-form'

const FILTERS_QUERY = gql`
  query($id: ID!) {
    databook(id: $id) {
      id
      filters {
        id
        name
      }
    }
  }
`
const FIELD_SPACING = 32

export default ({ data }) => {
  const theme = useTheme()
  const client = useApolloClient()
  const { databook, sql } = useContext(databookContext)
  const databookId = databook.doc._id

  const [open, setOpen] = useState(false)
  const [error, setError] = useState(false)
  const [filterName, setFilterName] = useState('')
  const [columnFiltered, setColumnFiltered] = useState('')
  const [formValues, setFormValues] = useState({})

  return (
    <>
      {/* TOGGLE DIALOGUE */}
      <Tooltip title="Create filter from current data" /*placement="left-start"*/>
        <IconButton style={{ marginLeft: 'auto' }} onClick={() => setOpen(true)} size="small">
          <CreateFilterIcon style={{ color: theme.palette.primary.light }} />
        </IconButton>
      </Tooltip>

      {/* DIALOGUE */}
      <Dialog fullWidth maxWidth="sm" open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add filter to dashboard</DialogTitle>
        <DialogContent>
          {/* ERROR MSG */}
          {error && (
            <Typography variant="body2" style={{ color: theme.palette.error.main }}>
              {JSON.stringify(error)}
            </Typography>
          )}

          {/* FILTER NAME */}
          <TextField
            id="filter-name"
            fullWidth
            style={{ marginBottom: FIELD_SPACING }}
            label="Name"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
          />

          {/* COLUMN FILTERED */}
          <DialogContentText>Select column filtered</DialogContentText>
          <Autocomplete
            id="select-column-filtered"
            options={data ? Object.keys(data[0]) : undefined}
            setOption={val => setColumnFiltered(val)}
            selectedOptions={columnFiltered}
          />

          <div style={{ marginBottom: FIELD_SPACING }} />
        </DialogContent>

        <DialogActions>
          <QuickForm loading={false}>
            {(update, { loading }) => {
              if (loading) {
                return (
                  <div style={{ margin: '0 16px 6px 0' }}>
                    <CircularProgress thickness={2} size={18} />
                  </div>
                )
              }

              return (
                <Button
                  onClick={async () => {
                    update({ loading: true })

                    const saveFilter =
                      filterDefinitions.find(({ name }) => name === name)?.saveFilter ||
                      function (data) {
                        return data
                      }

                    try {
                      // graphql query likely to be updated once API side has been changed
                      await client.mutate({
                        mutation: gql`
                          mutation(
                            $databookId: ID!
                            $name: String
                            $columnFiltered: String
                            $data: JSON!
                            $config: JSON!
                            $sql: String!
                          ) {
                            createFilter(
                              databookId: $databookId
                              name: $name
                              columnFiltered: $columnFiltered
                              data: $data
                              config: $config
                              sql: $sql
                            ) {
                              id
                            }
                          }
                        `,
                        variables: {
                          ...Object.assign(
                            {
                              name: filterName,
                              columnFiltered: columnFiltered,
                              databookId,
                              data: saveFilter(data, formValues),
                              sql,
                            },
                            { config: formValues }
                          ),
                        },
                        update: (cache, { data }) => {
                          const { databook } = cache.read({
                            query: FILTERS_QUERY,
                            variables: {
                              id: databookId,
                            },
                          })

                          cache.writeQuery({
                            query: FILTERS_QUERY,
                            variables: {
                              id: databookId,
                            },
                            data: {
                              databook: {
                                ...databook,
                                filters: [data.createFilter, ...databook.filters],
                              },
                            },
                          })
                        },
                      })
                      setOpen(false)
                    } catch (error) {
                      setError(error.message)
                    } finally {
                      update({ loading: false })
                    }
                  }}
                  size="small"
                  variant="contained"
                  color="primary"
                  disableElevation
                >
                  Create Filter
                </Button>
              )
            }}
          </QuickForm>
        </DialogActions>
      </Dialog>
    </>
  )
}
