import React from 'react'
import { render } from 'react-dom'
import { Provider, ReactReduxContext } from 'react-redux'
import * as redux from 'redux'
import { MemoryRouter } from 'react-router-dom'
import { createMemoryHistory } from 'history'
import { ApolloProvider } from '@apollo/client'

import Chat from '../src'
import apolloClient from '../src/apolloClient'
import { ThemeProvider } from './theme'

;(async () => {
  const history = createMemoryHistory()
  
  const reducer = (state = {}, action) => {
    return state
  }

  const store = redux.createStore(
    redux.combineReducers({
      root: reducer
    })
  )

  render(
    <ApolloProvider client={apolloClient}>
      <Provider store={store} context={ReactReduxContext}>
        <ThemeProvider>
          <MemoryRouter memoryHistory={history}>
            <Chat />
          </MemoryRouter>
        </ThemeProvider>
      </Provider>
    </ApolloProvider>,
    document.getElementById('root')
  )
})()
