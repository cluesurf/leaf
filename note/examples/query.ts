/**
 * Query trees — `make.find(...)` AST primitives resolved
 * through a host-provided data layer.
 */

import { make, makeScope, renderText, Base } from '@cluesurf/calm'

// AST-side: inline `find` Casts in templates.
const recentArticlesPage = make.templateString(
  'Latest: ',
  make.walk(
    make.find('article', {
      where: make.eq(make.read('status'), 'published'),
      sort: ['published_at'],
      limit: 5,
    }),
    make.read('item', 'title'),
    { item: 'item', join: ', ' },
  ),
)

// Host wires the runtime resolver:
const articles = [
  { title: 'A', status: 'published', published_at: '2026-04-01' },
  { title: 'B', status: 'draft', published_at: '2026-04-02' },
  { title: 'C', status: 'published', published_at: '2026-04-03' },
]

renderText(recentArticlesPage, {
  scope: makeScope({ status: 'published' }),
  find: ({ resource, where, limit }) => {
    if (resource !== 'article') return []
    const w = where as { status?: string } | undefined
    return articles
      .filter(a => (w?.status ? a.status === w.status : true))
      .slice(0, limit)
  },
})
// → 'Latest: A, C'

// Catalog-side: `find` flow handlers, registered against Base.
// Default catalog stubs throw — hosts override with their data layer.
const base = new Base()

base.flow('find', { base: 'list' }, ({ resource, where, limit }) => {
  if (resource !== 'article') return []
  const w = where as { status?: string } | undefined
  return articles
    .filter(a => (w?.status ? a.status === w.status : true))
    .slice(0, limit ?? 10)
})

base.flow('find', { base: 'count' }, ({ resource, where }) => {
  if (resource !== 'article') return 0
  const w = where as { status?: string } | undefined
  return articles.filter(a => (w?.status ? a.status === w.status : true))
    .length
})

base.call('find', {
  base: 'list',
  resource: 'article',
  where: { status: 'published' },
  limit: 10,
})
// → [{ title: 'A', … }, { title: 'C', … }]

base.call('find', {
  base: 'count',
  resource: 'article',
  where: { status: 'draft' },
})
// → 1
