import { useState } from 'react'
import SqlEditor from './sql-editor'
import ResultsTable from './results'
import SplitPane from 'react-split-pane'
import clsx from 'clsx'
import useStyles from './style'
import { WithQglQuery } from '../../../../hooks'
import Loading from '../../../../components/loading'
import { gql } from '@apollo/client'
import { Fade } from '@material-ui/core'
import DashboardBuilder from './dashboard'
import { useTheme } from '@material-ui/core/styles'

export default ({ databook }) => {
  const theme = useTheme()
  const classes = useStyles()
  const [sql, setSql] = useState(`select
*
from odp_925377aa_6914_41e8_8b92_f448ebe11f9c
limit 10`)

  return (
    <SplitPane split="horizontal" minSize={400}>
      {/* SQL EDITOR */}
      <div className={clsx(classes.root)}>
        <SplitPane split="vertical" minSize={200} defaultSize={1000}>
          <SqlEditor
            sql={sql}
            runQuery={val => {
              setSql(val)
            }}
          />
          <DashboardBuilder />
        </SplitPane>
      </div>

      {/* QUERY RESULTS */}
      <WithQglQuery
        QUERY={gql`
          query($id: ID!, $sql: String!) {
            browserClient {
              databook(id: $id) {
                id
                execute(sql: $sql)
              }
            }
          }
        `}
        variables={{ id: databook.doc._id, sql }}
      >
        {({ error, loading, data }) => {
          if (error) {
            throw error
          }

          if (loading) {
            return <Loading />
          }

          return (
            <Fade in={Boolean(data)}>
              <div
                style={{
                  position: 'absolute',
                  top: 0,
                  bottom: 0,
                  right: 0,
                  left: 0,
                  backgroundColor: theme.palette.common.white,
                }}
              >
                <ResultsTable data={data.browserClient.databook.execute} />
              </div>
            </Fade>
          )
        }}
      </WithQglQuery>
    </SplitPane>
  )
}
