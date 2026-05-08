import { z } from 'zod'

export const MessageCountInputParser = z.object({
  count: z.number().int().gte(0),
  name: z.string(),
})

export type MessageCountInputRecord = z.infer<
  typeof MessageCountInputParser
>
