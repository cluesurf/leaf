import React from 'react'
import Settings, { SettingsInput } from '~/component/provider/Settings'
import Fonts from '~/component/provider/Fonts'
import { Storage } from '~/component/provider/Storage'
import { MDXProvider } from '@mdx-js/react'
import {
  HR,
  H1,
  H2,
  H3,
  H4,
  H5,
  H6,
  Li,
  Ol,
  P,
  Ul,
  TableScroller,
  Table,
  TBody,
  TR,
  TH,
  TD,
  A,
  Pre,
  Code,
  Column,
  Whole,
} from '~/component/Content'
import Gloss from '~/component/Gloss'
import Text from '~/component/Text'
import InteractionProvider from '~/hook/useInteractionManager'
import { ToastProvider } from '../Toast'
import { Base, PageSettings, QueryMap } from '~/hook/usePageSettings'

const components = {
  Gloss,
  Column,
  Whole,
  p: P,
  h1: H1,
  h2: H2,
  h3: H3,
  h4: H4,
  h5: H5,
  h6: H6,
  H1: H1,
  H2: H2,
  H3: H3,
  H4: H4,
  H5: H5,
  H6: H6,
  ol: Ol,
  li: Li,
  ul: Ul,
  hr: HR,
  T: Text,
  a: A,
  pre: Pre,
  code: Code,
  table: props => (
    <TableScroller>
      <Table {...props} />
    </TableScroller>
  ),
  tbody: TBody,
  tr: TR,
  th: TH,
  td: TD,
}

export default function Provider({
  children,
  path,
  settings,
  base,
  cached,
  queryMap,
}: {
  settings?: SettingsInput
  path?: string
  children: React.ReactNode
  base?: Base
  cached?: Base
  queryMap?: QueryMap
}) {
  return (
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
  )
}
