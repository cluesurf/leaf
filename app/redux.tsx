import { configureStore } from '@reduxjs/toolkit'
import {
  ApiEndpointQuery,
  QueryDefinition,
} from '@reduxjs/toolkit/query'
import queries from './frontend/queries'

const store = configureStore({
  reducer: {
    [queries.reducerPath]: queries.reducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware().concat(queries.middleware),
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type State = ReturnType<typeof store.getState>
export type Dispatch = typeof store.dispatch

export type QueryKey = NonNullable<keyof typeof queries.endpoints>
export type Queries = {
  [K in keyof typeof queries.endpoints]?: (typeof queries.endpoints)[K] extends ApiEndpointQuery<
    infer Definition,
    any
  >
    ? Definition extends QueryDefinition<
        any,
        any,
        any,
        infer ResultType,
        any
      >
      ? ResultType
      : never
    : never
}

export default store
