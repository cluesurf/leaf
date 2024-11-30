'use client'

import React from 'react'
import Settings, { SettingsInput } from '~/component/provider/Settings'
import Fonts from '~/component/provider/Fonts'
import { Storage } from '~/component/provider/Storage'
import { MDXProvider } from '@mdx-js/react'
import InteractionProvider from '~/hook/useInteractionManager'
import { ToastProvider } from '../Toast'
import { Base, PageSettings, QueryMap } from '~/hook/usePageSettings'
import { Provider as ReduxProvider } from 'react-redux'
import { Store, UnknownAction } from 'redux'

import components from '..'

export default function Provider({
  store,
  children,
  path,
  settings,
  base,
  cached,
  queryMap,
}: {
  store: Store<any, UnknownAction, unknown>
  settings?: SettingsInput
  path?: string
  children: React.ReactNode
  base?: Base
  cached?: Base
  queryMap?: QueryMap
}) {
  return (
    <ReduxProvider store={store}>
      <Settings value={settings}>
        <Fonts>
          <Storage>
            <MDXProvider components={components}>
              <InteractionProvider>
                <ToastProvider>
                  {path ? (
                    <PageSettings
                      path={path}
                      base={base}
                      cached={cached}
                      queryMap={queryMap}
                    >
                      {children}
                    </PageSettings>
                  ) : (
                    children
                  )}
                </ToastProvider>
              </InteractionProvider>
            </MDXProvider>
          </Storage>
        </Fonts>
      </Settings>
    </ReduxProvider>
  )
}
