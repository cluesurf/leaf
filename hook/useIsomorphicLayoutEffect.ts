import { useEffect, useLayoutEffect } from 'react'
import IS_SERVER from '~/utility/isServer'

const useIsomorphicLayoutEffect = IS_SERVER
  ? useEffect
  : useLayoutEffect

export default useIsomorphicLayoutEffect
