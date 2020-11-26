import { useContext, forwardRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { context as databookContext } from '../../../context'
import { WithGqlQuery } from '../../../../../hooks'
import { gql } from '@apollo/client'
import Loading from '../../../../../components/loading'
import TabHeaders from './_tab-headers'
import Dashboard from './dashboard'
import { Fade } from '@material-ui/core'

export default forwardRef((props, ref) => {
  const [activeTabIndex, setActiveTabIndex] = useState(0)
  const { databook } = useContext(databookContext)
  const databookId = databook.doc._id

  return (
    <WithGqlQuery
      QUERY={gql`
        query($databookId: ID!) {
          dashboards(databookId: $databookId) {
            id
          }
        }
      `}
      variables={{ databookId }}
    >
      {({ error, loading, data }) => {
        if (loading) {
          return <Loading />
        }

        if (error) {
          throw error
        }

        const { dashboards } = data

        return (
          <>
            {createPortal(
              <TabHeaders
                activeTabIndex={activeTabIndex}
                setActiveTabIndex={setActiveTabIndex}
                dashboards={dashboards}
              />,
              ref.current
            )}
            {dashboards.map(({ id }, i) => {
              return (
                <Fade in={activeTabIndex === i} key={id}>
                  <div role="tabpanel" hidden={activeTabIndex !== i}>
                    {activeTabIndex === i && <Dashboard id={id} />}
                  </div>
                </Fade>
              )
            })}
          </>
        )
      }}
    </WithGqlQuery>
  )
})