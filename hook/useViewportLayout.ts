import React, { CSSProperties, useContext } from 'react'
import { ViewportDimensionsContext } from './useViewportDimensions'

export type ViewportLayout3SectionStateInput = {
  container: CSSProperties
  grid: CSSProperties
  middle: CSSProperties
  left: CSSProperties
  right: CSSProperties
  width: number
}

export function useViewportLayout3Section(): ViewportLayout3SectionStateInput {
  const { width } = useContext(ViewportDimensionsContext)

  if (width >= 1536) {
    return {
      width,
      container: {
        display: 'flex',
        justifyContent: 'center',
      },
      grid: {
        display: 'flex',
        width: 1536,
      },
      middle: {
        width: 888,
      },
      left: {
        width: 324,
      },
      right: {
        width: 324,
      },
    }
  }

  if (width >= 1244) {
    return {
      width,
      container: {
        display: 'flex',
      },
      grid: {
        display: 'flex',
        maxWidth: 1536,
        minWidth: 1244,
        flex: 1,
      },
      middle: {
        maxWidth: 888,
        minWidth: 576,
        width: width - 324 - 324,
      },
      left: {
        width: 324,
      },
      right: {
        width: 324,
      },
    }
  }

  if (width >= 1056) {
    return {
      width,
      container: {
        display: 'flex',
      },
      grid: {
        display: 'flex',
        minWidth: 1056,
        maxWidth: 1244,
        flex: 1,
      },
      middle: {
        width: 576,
        flex: 1,
      },
      left: {
        maxWidth: 324,
        minWidth: 240,
        flex: 1,
      },
      right: {
        maxWidth: 324,
        minWidth: 240,
        flex: 1,
      },
    }
  }

  if (width >= 888) {
    return {
      width,
      container: {
        display: 'flex',
      },
      grid: {
        display: 'flex',
        minWidth: 888,
        flex: 1,
      },
      middle: {
        maxWidth: 888,
        minWidth: 576,
        width: width - 324,
        flex: 1,
      },
      left: {
        width: 324,
        flex: 1,
      },
      right: {
        display: 'none',
      },
    }
  }

  if (width >= 804) {
    return {
      width,
      container: {
        display: 'flex',
      },
      grid: {
        display: 'flex',
        minWidth: 804,
        flex: 1,
      },
      middle: {
        width: 576,
      },
      left: {
        maxWidth: 324,
        minWidth: 240,
        flex: 1,
      },
      right: {
        display: 'none',
      },
    }
  }

  if (width === 0) {
    return {
      width,
      container: {
        visibility: 'hidden',
      },
      grid: {
        visibility: 'hidden',
      },
      middle: {
        visibility: 'hidden',
      },
      left: {
        visibility: 'hidden',
      },
      right: {
        visibility: 'hidden',
      },
    }
  }

  return {
    width,
    container: {
      display: 'flex',
    },
    grid: {
      display: 'flex',
      flex: 1,
    },
    middle: {
      justifyContent: 'center',
      maxWidth: 804,
      width,
      flex: 1,
    },
    left: {
      display: 'none',
    },
    right: {
      display: 'none',
    },
  }
}

export type ViewportLayoutSplitStateInput = {
  width: number
  container: CSSProperties
  grid: CSSProperties
  left: CSSProperties
  right: CSSProperties
}

export function useViewportLayoutSplit(): ViewportLayoutSplitStateInput {
  const { width } = useContext(ViewportDimensionsContext)

  if (width >= 1536) {
    return {
      width,
      container: {
        display: 'flex',
        justifyContent: 'center',
      },
      grid: {
        display: 'flex',
        width: 1536,
      },
      left: {
        maxWidth: 768,
        width: '100%',
      },
      right: {
        maxWidth: 768,
        width: '100%',
      },
    }
  }

  if (width > 1152) {
    return {
      width,
      container: {
        display: 'flex',
        justifyContent: 'center',
        width: '100%',
      },
      grid: {
        display: 'flex',
        width: '100%',
      },
      left: {
        width: '100%',
        minWidth: 576,
        height: '100%',
      },
      right: {
        width: '100%',
        minWidth: 576,
        height: '100%',
      },
    }
  }

  return {
    width,
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    grid: {
      display: 'flex',
      width: '100%',
    },
    left: {
      maxWidth: 768,
      flex: 1,
    },
    right: {
      maxWidth: 768,
      flex: 1,
    },
  }
}

export type ViewportLayoutFillStateInput = {
  width: number
  container: CSSProperties
  grid: CSSProperties
}

export function useViewportLayoutFill(): ViewportLayoutFillStateInput {
  const { width } = useContext(ViewportDimensionsContext)

  if (width >= 1536) {
    return {
      width,
      container: {
        display: 'flex',
        justifyContent: 'center',
      },
      grid: {
        width: 1536,
      },
    }
  }

  return {
    width,
    container: {
      display: 'flex',
      justifyContent: 'center',
      width: '100%',
    },
    grid: {
      width: '100%',
    },
  }
}
