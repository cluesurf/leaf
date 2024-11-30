import z from 'zod'
import { paginationProps } from './queries'
import { List } from './models'

export const SearchLanguages = z.object({
  ...paginationProps(),
  categories: z.array(z.string()).optional(),
})

export type SearchLanguages = z.infer<typeof SearchLanguages>

export type GetLanguagesResponse = {
  languages: List<GetLanguagesResponseLanguage>
}

export type GetLanguagesResponseLanguage = {
  id: string
  slug: string
  name: string
}

export type GetLanguageResponse = {
  id: string
  languages: List<GetLanguageResponseLanguage>
}

export type GetLanguageResponseLanguage = {
  id: string
  slug: string
  name: string
  is_natural?: string
  is_constructed?: string
}
