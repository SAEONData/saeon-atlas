import React from 'react'
import { ApolloClient, InMemoryCache } from '@apollo/client'
import { CssBaseline } from '@material-ui/core'
import { ThemeProvider } from '@material-ui/core/styles'
import { DEFAULT_ERROR, DEFAULT_WARNING, DEFAULT_INFO, DEFAULT_SUCCESS } from './config'
import { ApolloProvider } from '@apollo/client'
import ErrorBoundary from './modules/error-boundary'
import AuthProvider from './modules/provider-auth'
import FeedbackProvider from './modules/provider-feedback'
import Layout from './modules/layout'
import theme from './theme'

export default ({ link }) => (
  <ApolloProvider
    client={
      new ApolloClient({
        cache: new InMemoryCache(),
        link,
      })
    }
  >
    <CssBaseline>
      <ThemeProvider theme={theme}>
        <ErrorBoundary>
          <FeedbackProvider
            defaultError={DEFAULT_ERROR}
            defaultWarning={DEFAULT_WARNING}
            defaultInfo={DEFAULT_INFO}
            defaultSuccess={DEFAULT_SUCCESS}
          >
            <AuthProvider>
              <Layout />
            </AuthProvider>
          </FeedbackProvider>
        </ErrorBoundary>
      </ThemeProvider>
    </CssBaseline>
  </ApolloProvider>
)