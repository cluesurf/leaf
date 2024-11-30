import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Response } from '../shared/queries'
import {
  GetLanguageResponse,
  GetLanguagesResponse,
} from '../shared/languages'

const HOST = 'http://localhost:3001'

const queries = createApi({
  reducerPath: 'queries', // The key in the Redux store
  baseQuery: fetchBaseQuery({ baseUrl: `${HOST}/queries` }),
  tagTypes: ['language', 'script'], // Tags for caching and invalidation
  endpoints: builder => ({
    getLanguages: builder.query<GetLanguagesResponse, void>({
      query: () => '/languages',
      providesTags: ['language'],
      transformResponse,
    }),
    getLanguage: builder.query<GetLanguageResponse, number>({
      query: id => `/languages/${id}`,
      providesTags: result => [{ type: 'language', id: result?.id }],
      transformResponse,
    }),
    getScripts: builder.query<GetLanguagesResponse, void>({
      query: () => '/scripts',
      providesTags: ['script'],
      transformResponse,
    }),
    getScript: builder.query<GetLanguageResponse, number>({
      query: id => `/scripts/${id}`,
      providesTags: result => [{ type: 'script', id: result?.id }],
      transformResponse,
    }),
    // addPost: builder.mutation<Post, NewPost>({
    //   query: newPost => ({
    //     url: '/posts',
    //     method: 'POST',
    //     body: newPost,
    //   }),
    //   invalidatesTags: ['Post'], // Invalidate cache to refetch posts
    // }),
  }),
})

export const {
  useGetLanguagesQuery,
  useGetLanguageQuery,
  useGetScriptsQuery,
  useGetScriptQuery,
  // useAddPostMutation,
} = queries

export default queries

function transformResponse(response: Response) {
  if (response.type === 'success') {
    return response.data
  }

  throw new Error(response.message)
}
