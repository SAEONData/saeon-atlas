import RegisterEventLog from '../application-logger/_register-event-log'
import { CATALOGUE_LATEST_COMMIT } from '../../config'
import packageJson from '../../../package.json'
import { debounce } from '../../lib/fns'
import useWindowSize from '../../hooks/use-window-size'

export default ({ children }) => {
  const [innerHeight, innerWidth] = useWindowSize()

  return (
    <RegisterEventLog
      event={'click'}
      handle={async ({ type, target, x, y }) =>
        console.gql({
          clientVersion: packageJson.version,
          type,
          commitHash: CATALOGUE_LATEST_COMMIT,
          createdAt: new Date(),
          info: {
            innerHeight,
            innerWidth,
            x,
            y,
            target: target.outerHTML,
            pathname: window.location.pathname,
          },
        })
      }
    >
      <RegisterEventLog
        event={'mousemove'}
        handle={debounce(async ({ type, x, y }) =>
          console.gql({
            clientVersion: packageJson.version,
            type,
            commitHash: CATALOGUE_LATEST_COMMIT,
            createdAt: new Date(),
            info: {
              pathname: window.location.pathname,
              innerHeight,
              innerWidth,
              x,
              y,
            },
          })
        )}
      >
        {children}
      </RegisterEventLog>
    </RegisterEventLog>
  )
}
