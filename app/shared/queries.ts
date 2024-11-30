import { z } from 'zod'

export const paginationProps = () => ({
  size: z.number().int().default(100).optional(),
  page: z.number().int().min(1).max(1000).default(1).optional(),
})

export const Pagination = z.object({
  ...paginationProps(),
})

export type Response<T extends any = any> =
  | SuccessResponse<T>
  | ErrorResponse

export type SuccessResponse<T extends any = any> = {
  type: 'success'
  data: T
}

export type ErrorResponse = {
  type: 'error'
  code?: string
  message: string
}

export type Pagination = z.infer<typeof Pagination>
