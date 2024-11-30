import React, {
  RefObject,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { useResizeObserver } from 'usehooks-ts'

type SVGInput = {
  className?: string
  width?: number | string
  height?: number | string
  children: React.ReactNode
} & Omit<
  React.ComponentPropsWithoutRef<'div'>,
  'className' | 'children'
>

const SVG: React.FC<SVGInput> = ({
  className,
  width,
  height,
  children,
  style: divStyle = {},
  ...props
}) => {
  const [aspectRatio, setAspectRatio] = useState<number>(1)
  const ref = useRef<HTMLDivElement>(null) as RefObject<HTMLDivElement>
  const svgRef = useRef<SVGGElement>(null) as RefObject<SVGGElement>
  const [svgBBox, setSvgBBox] = useState<DOMRect>()

  const { width: divWidth = 0, height: divHeight = 0 } =
    useResizeObserver({
      ref,
    })

  const [actualWidth, setWidth] = useState(width)
  const [actualHeight, setHeight] = useState(height)

  useLayoutEffect(() => {
    const typeW = typeof width
    const typeH = typeof height

    if (typeH === 'undefined') {
      if (typeW === 'number') {
        setHeight((width as number) / aspectRatio)
      } else if (typeW === 'string') {
        setHeight(divWidth / aspectRatio)
      } else if (svgBBox) {
        setHeight(svgBBox.height)
      }
    } else {
      setHeight(height)
    }

    if (typeW === 'undefined') {
      if (typeH === 'number') {
        setWidth((height as number) * aspectRatio)
      } else if (typeH === 'string') {
        setWidth(divHeight * aspectRatio)
      } else if (svgBBox) {
        setWidth(svgBBox.width)
      }
    } else {
      setWidth(width)
    }
  }, [width, height, aspectRatio, divWidth, divHeight, svgBBox])

  useEffect(() => {
    if (svgRef.current) {
      const bbox = svgRef.current.getBBox()
      setAspectRatio(bbox.width / bbox.height)
      setSvgBBox(bbox)
    }
  }, [svgRef])

  return (
    <div
      ref={ref}
      className="relative"
      style={{ ...divStyle, width: actualWidth, height: actualHeight }}
      {...props}
    >
      <svg
        className={className}
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${svgBBox?.width ?? 0} ${svgBBox?.height ?? 0}`}
      >
        <g
          // transform={`translate=${}`}
          ref={svgRef}
        >
          {children}
        </g>
      </svg>
    </div>
  )
}

export default SVG
