import React from 'react'
import { Route, Switch, withRouter } from 'react-router'
import LoginView from './containers/LoginView'
import ChatView from './containers/ChatView'
import ConversationsView from './containers/ConversationsView'

function AppRouter (props) {
  const renderRoute = Component => routeProps => {
    return (
      <Component {...props} {...routeProps} />
    )
  }
  return (
    <Switch>
      <Route
        path={'/'}
        exact
        render={renderRoute(LoginView)}
      />
      <Route
        path={'/conversations'}
        exact
        component={renderRoute(ConversationsView)}
      />
      <Route
        path={'/chat/:id'}
        render={renderRoute(ChatView)}
      />
    </Switch>
  )
}

export default withRouter(AppRouter)