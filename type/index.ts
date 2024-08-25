
export type NestedObjectType = {
  [key: string]: NestedObjectValueType
}

export type NestedObjectValueType =
  | NestedObjectType
  | string
  | boolean
  | number
  | null
  | undefined
  | Array<
      NestedObjectType | string | boolean | number | null | undefined
    >
