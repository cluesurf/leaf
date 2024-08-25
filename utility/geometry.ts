export type Point2D = {
  x: number
  y: number
}

export function calculatePolygonHeight(
  sides: number,
  radius: number,
): number {
  // Ensure the number of sides is valid
  if (sides < 3) {
    throw new Error('Number of sides must be at least 3')
  }

  // Calculate the height of the polygon
  const height = radius * (1 + Math.cos(Math.PI / sides))

  return height
}

export function distanceBetweenVertices({
  sides,
  radius,
  distance,
}: {
  sides: number
  radius: number
  distance: number
}): number {
  if (sides < 3) {
    throw new Error('A polygon must have at least 3 sides.')
  }
  if (distance < 1 || distance >= sides) {
    throw new Error('distance must be between 1 and sides-1.')
  }

  const angle = (distance * Math.PI) / sides
  return 2 * radius * Math.sin(angle)
}

export function calculateShortestWidthOfPolygon(
  sides: number,
  radius: number,
) {
  if (sides < 3) {
    throw new Error('A polygon must have at least 3 sides.')
  }

  if (sides % 2 === 0) {
    return radius * (2 * Math.cos(Math.PI / sides))
  } else {
    return radius * (1 + Math.cos(Math.PI / sides))
  }
}

export function calculateIncircleRadius(
  sides: number,
  outerRadius: number,
) {
  if (sides < 3) {
    throw new Error('A polygon must have at least 3 sides.')
  }
  const radius = outerRadius * Math.cos(Math.PI / sides)
  return radius
}

export function calculatePolygonSideLength(
  sides: number,
  radius: number,
) {
  if (sides < 3) {
    throw new Error('A polygon must have at least 3 sides.')
  }
  const sideLength = 2 * radius * Math.sin(Math.PI / sides)
  return sideLength
}

export function calculateCircumradiusFromIncircleRadius(
  sides: number,
  radius: number,
) {
  if (sides < 3) {
    throw new Error('A polygon must have at least 3 sides.')
  }
  return radius / Math.cos(Math.PI / sides)
}

type Point = {
  x: number
  y: number
}

export function calculatePolygonVertices(
  sides: number,
  radius: number,
): Array<Point> {
  const vertices: Array<Point> = []
  for (let i = 0; i < sides; i++) {
    const angle = (2 * Math.PI * i) / sides
    vertices.push({
      x: radius * Math.cos(angle),
      y: radius * Math.sin(angle),
    })
  }
  return vertices
}

export function calculateSideLength(
  radius: number,
  sides: number,
): number {
  return 2 * radius * Math.sin(Math.PI / sides)
}

export function unitVector(p1: Point, p2: Point): Point {
  const length = Math.sqrt((p2.x - p1.x) ** 2 + (p2.y - p1.y) ** 2)
  return {
    x: (p2.x - p1.x) / length,
    y: (p2.y - p1.y) / length,
  }
}

export function normalVector(p1: Point, p2: Point): Point {
  const unit = unitVector(p1, p2)
  return {
    x: -unit.y,
    y: unit.x,
  }
}

export function calculateTrianglePositions(
  vertices: Array<Point>,
  sideIndex: number,
  triangles: number,
  height: number,
): Array<{ baseCenter: Point; tip: Point }> {
  const sideLength = calculateSideLength(vertices[0].x, vertices.length)
  const spacing = sideLength / (triangles + 1)
  const p1 = vertices[sideIndex]
  const p2 = vertices[(sideIndex + 1) % vertices.length]
  const unit = unitVector(p1, p2)
  const normal = normalVector(p1, p2)

  const positions: Array<{ baseCenter: Point; tip: Point }> = []

  for (let i = 1; i <= triangles; i++) {
    const baseCenter = {
      x: p1.x + i * spacing * unit.x,
      y: p1.y + i * spacing * unit.y,
    }
    const tip = {
      x: baseCenter.x + height * normal.x,
      y: baseCenter.y + height * normal.y,
    }
    positions.push({ baseCenter, tip })
  }

  return positions
}

export function calculatePolygonDotPosition({
  polygonRadius,
  polygonSideCount,
  polygonEdgeNumber,
  polygonEdgePositionRatio, // from 0 to 1
  gap = 0,
  dotRadius,
  rotation = 0,
  offset = 0,
  flatSide,
}: {
  polygonRadius: number
  polygonSideCount: number
  polygonEdgeNumber: number
  polygonEdgePositionRatio: number
  gap?: number
  dotRadius: number
  rotation?: number
  offset?: number
  flatSide?: PolygonSide
}) {
  const n = polygonSideCount
  const R = polygonRadius
  const e = polygonEdgeNumber
  const t = polygonEdgePositionRatio
  const o = gap

  let flatSideRotation = 0
  switch (flatSide) {
    case 'top':
      flatSideRotation = n % 2 === 0 ? -180 / n : 360 / n // Rotate counterclockwise by half a segment
      break
    case 'bottom':
      flatSideRotation = 180 / n // Rotate clockwise by half a segment
      break
    case 'left':
      flatSideRotation = -90 - 180 / n // Rotate counterclockwise by a quarter segment and additional half a segment
      break
    case 'right':
      flatSideRotation = 90 - 180 / n // Rotate clockwise by a quarter segment and additional half a segment
      break
  }

  const totalAngle = ((rotation + flatSideRotation) * Math.PI) / 180

  const V1 = rotatePoint(getPolygonVertex(e - 1, n, R), totalAngle)
  const V2 = rotatePoint(getPolygonVertex(e % n, n, R), totalAngle) // Wrap around using modulo

  // Interpolate position along the edge
  const P = {
    x: (1 - t) * V1.x + t * V2.x,
    y: (1 - t) * V1.y + t * V2.y,
  }

  // Calculate the edge vector and the normal vector
  const dx = V2.x - V1.x
  const dy = V2.y - V1.y
  const edgeLength = Math.sqrt(dx * dx + dy * dy)

  // Unit normal vector (rotate by 90 degrees counter-clockwise)
  const normal = {
    x: -dy / edgeLength,
    y: dx / edgeLength,
  }

  // Offset the point by the gap distance
  const P_offset = {
    x: P.x + (-o - dotRadius + offset) * normal.x,
    y: P.y + (-o - dotRadius + offset) * normal.y,
  }

  return {
    x: P_offset.x + R,
    y: -P_offset.y + R,
  }
}

// Calculate vertex positions
export function getPolygonVertex(i: number, n: number, R: number) {
  const angle = (2 * Math.PI * i) / n - Math.PI / 2
  return { x: R * Math.cos(angle), y: R * Math.sin(angle) }
}

function rotatePoint(
  { x, y }: { x: number; y: number },
  angle: number,
) {
  const cos = Math.cos(angle)
  const sin = Math.sin(angle)
  return {
    x: x * cos - y * sin,
    y: x * sin + y * cos,
  }
}

export const POLYGON_SIDE = ['left', 'right', 'top', 'bottom'] as const

export type PolygonSide = (typeof POLYGON_SIDE)[number]

export function computePolygonPoints({
  width,
  height,
  sides,
  strokeWidth,
  rotation = 0,
  flatSide,
}: {
  width: number
  height: number
  sides: number
  strokeWidth: number
  rotation?: number
  flatSide?: PolygonSide
}) {
  const centerX = width / 2 + strokeWidth / 2
  const centerY = height / 2 + strokeWidth / 2
  const radiusX = width / 2 - strokeWidth / 2
  const radiusY = height / 2 - strokeWidth / 2
  const offsetX = strokeWidth / 2
  const offsetY = strokeWidth / 2

  let points = Array.from({ length: sides }, (_, i) => {
    return calculatePolygonDotPosition({
      rotation,
      polygonRadius: radiusX,
      polygonSideCount: sides,
      polygonEdgeNumber: i + 1,
      polygonEdgePositionRatio: 0,
      gap: 0,
      dotRadius: 0,
      flatSide,
    })
  })

  // console.log(flatSide, angle)

  // points = rotatePolygon(points, angle)

  // const minX = Math.min(...points.map(p => p.x))
  // const minY = Math.min(...points.map(p => p.y))

  points = points.map(p => ({
    x: offsetX + p.x,
    y: offsetY + p.y,
  }))

  return points
}
