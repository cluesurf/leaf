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

const components = {
  Gloss,
  Column,
  Whole,
  p: P,
  P: P,
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
  Ol: Ol,
  Li: Li,
  Ul: Ul,
  Hr: HR,
  T: Text,
  a: A,
  A: A,
  pre: Pre,
  code: Code,
  Pre: Pre,
  Code: Code,
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

export default components
