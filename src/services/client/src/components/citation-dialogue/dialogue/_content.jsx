import { useState } from 'react'
import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import CircularProgress from '@material-ui/core/CircularProgress'
import DialogTitle from '@material-ui/core/DialogTitle'
import DialogContent from '@material-ui/core/DialogContent'
import DialogActions from '@material-ui/core/DialogActions'
import AssignmentIcon from '@material-ui/icons/Assignment'
import { gql } from '@apollo/client'
import WithGqlQuery from '../../../hooks/with-gql-query'
import Autocomplete from '../../../components/autocomplete'

const DEFAULT_CITATION_STYLE = 'apa'
const DEFAULT_CITATION_LANG = 'en_US'

export default ({ doi, open, setOpen, citationStyles, citationLocales }) => {
  const [citationParams, setCitationParams] = useState({
    style: DEFAULT_CITATION_STYLE,
    language: DEFAULT_CITATION_LANG,
    copied: false,
  })

  return (
    <WithGqlQuery
      QUERY={gql`
        query($dois: [String!], $style: CitationStyle, $language: CitationLocale) {
          catalogue {
            id
            records(dois: $dois) {
              nodes {
                citation(style: $style, language: $language)
              }
            }
          }
        }
      `}
      variables={{
        dois: [doi],
        style: citationParams.style,
        language: citationParams.language,
      }}
    >
      {({ error, loading, data }) => (
        <>
          {/* Dialogue */}
          <Dialog
            onClose={() => {
              setOpen(false)
            }}
            open={open}
            maxWidth="sm"
            fullWidth={true}
          >
            {/* TITLE */}
            <DialogTitle>{doi}</DialogTitle>

            {/* TITLE */}
            <DialogContent>
              {/* SELECT STYLE */}
              <Autocomplete
                label="Style"
                variant="outlined"
                setOption={value =>
                  setCitationParams(
                    Object.assign(
                      { ...citationParams },
                      {
                        copied: false,
                        style: value?.replace(/-/g, '_') || DEFAULT_CITATION_STYLE,
                      }
                    )
                  )
                }
                selectedOptions={citationParams.style.replace(/_/g, '-')}
                options={citationStyles?.enumValues?.map(v => v.name.replace(/_/g, '-'))}
              />

              <div style={{ marginTop: 12 }} />

              {/* SELECT LANGUAGE */}
              <Autocomplete
                label="Language"
                variant="outlined"
                setOption={value =>
                  setCitationParams(
                    Object.assign(
                      { ...citationParams },
                      {
                        copied: false,
                        language: value?.replace(/-/g, '_') || DEFAULT_CITATION_LANG,
                      }
                    )
                  )
                }
                selectedOptions={citationParams.language.replace(/_/g, '-')}
                options={citationLocales?.enumValues?.map(v => v.name.replace(/_/g, '-'))}
              />

              <div style={{ marginTop: 24 }} />

              {/* CITATION TEXT */}
              {error ? (
                <samp>{error.message}</samp>
              ) : loading ? (
                <CircularProgress />
              ) : (
                <samp>{data.catalogue.records.nodes[0].citation}</samp>
              )}
            </DialogContent>

            {/* COPY Button */}
            <DialogActions>
              <Button
                disabled={error || loading}
                onClick={() => {
                  navigator.clipboard.writeText(data.catalogue.records.nodes[0].citation)
                  setCitationParams(Object.assign({ ...citationParams }, { copied: true }))
                }}
                startIcon={<AssignmentIcon />}
              >
                {citationParams.copied ? 'Copied!' : 'Copy to cliboard'}
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </WithGqlQuery>
  )
}