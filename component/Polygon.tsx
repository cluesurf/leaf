import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import {
  PolygonSide,
  calculateShortestWidthOfPolygon,
  computePolygonPoints,
} from '~/utility/geometry'

const ANGLE = -Math.PI / 2 // Start the first vertex at the top center

type PolygonInput = {
  width: number
  height: number
  sides: number
  stroke?: string
  strokeWidth?: number
  fill?: string
  rotation?: number // New prop for rotation in degrees
  flatSide?: PolygonSide
}

let ID = 1

const Polygon: React.FC<PolygonInput> = ({
  sides,
  width,
  height,
  stroke = 'black',
  strokeWidth = 0,
  fill = 'black',
  flatSide,
  rotation = 0, // Default rotation is 0 degrees
}) => {
  const [xOffset, setXOffset] = useState(0)
  const [yOffset, setYOffset] = useState(0)
  const ref = useRef<SVGPolygonElement>(null)

  useLayoutEffect(() => {
    if (!ref.current) {
      return
    }

    const bbox = ref.current.getBBox()

    if (bbox.width < width) {
      setXOffset((width - bbox.width) / 2 - strokeWidth / 2)
    }

    if (bbox.height < height) {
      setYOffset((height - bbox.height) / 2 - strokeWidth / 2)
    }
  }, [ref, width, height, strokeWidth])

  const points = useMemo(() => {
    const points = computePolygonPoints({
      width,
      height,
      sides,
      strokeWidth,
      rotation,
      flatSide,
    })
    return points.map(p => `${p.x},${p.y}`).join(' ')
  }, [sides, width, height, strokeWidth, rotation, flatSide])

  if (sides < 3 || sides > 360) {
    throw new Error('Number of sides must be between 3 and 360')
  }

  // calculatePolygonHeight(sides, width / 2) + strokeWidth
  return (
    <g>
      <rect
        width={width}
        height={height}
        fill="transparent"
        style={{ pointerEvents: 'none' }}
      />
      <polygon
        // x={xOffset}
        // y={yOffset}
        ref={ref}
        points={points}
        stroke={stroke}
        strokeWidth={strokeWidth}
        fill={fill}
        strokeLinejoin="round"
        style={{ transformOrigin: 'center' }}
      />
    </g>
  )
}

export default Polygon
