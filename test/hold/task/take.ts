import { z } from 'zod'

export const GreetUserInputParser = z.object({
  name: z.string(),
  age: z.optional(z.number().int().gte(0)),
  polite: z.optional(z.boolean()).default(true),
})

export type GreetUserInputRecord = z.infer<typeof GreetUserInputParser>

export const SumNumbersInputParser = z.object({
  values: z.array(z.number().int()),
})

export type SumNumbersInputRecord = z.infer<
  typeof SumNumbersInputParser
>
