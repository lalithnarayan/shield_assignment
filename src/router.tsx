import React from 'react'
import { createHashRouter, RouteObject } from 'react-router-dom'
import ErrorPage from './components/error-page'
import { getDefaultLayout } from './components/layout'
import { TablePage } from './pages/table'

export const routerObjects: RouteObject[] = [
  {
    path: '/',
    Component: TablePage,
  },
]

export function createRouter(): ReturnType<typeof createHashRouter> {
  const routeWrappers = routerObjects.map((router) => {
    // @ts-ignore TODO: better type support
    const getLayout = router.Component?.getLayout || getDefaultLayout
    const Component = router.Component!
    const page = getLayout(<Component />)
    return {
      ...router,
      element: page,
      Component: null,
      ErrorBoundary: ErrorPage,
    }
  })
  return createHashRouter(routeWrappers)
}
