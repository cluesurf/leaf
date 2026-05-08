import { z } from 'zod'

import { DataHashKey } from '~/test/hold/data'
import { DATA_HASH_KEY } from '~/test/hold/data/base'

export const DataHashKeyParser: z.ZodType<DataHashKey> = z.enum(
  DATA_HASH_KEY as [DataHashKey, ...DataHashKey[]],
)
