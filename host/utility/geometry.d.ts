export type Point2D = {
    x: number;
    y: number;
};
export declare function calculatePolygonHeight(sides: number, radius: number): number;
export declare function distanceBetweenVertices({ sides, radius, distance, }: {
    sides: number;
    radius: number;
    distance: number;
}): number;
export declare function calculateShortestWidthOfPolygon(sides: number, radius: number): number;
export declare function calculateIncircleRadius(sides: number, outerRadius: number): number;
export declare function calculatePolygonSideLength(sides: number, radius: number): number;
export declare function calculateCircumradiusFromIncircleRadius(sides: number, radius: number): number;
type Point = {
    x: number;
    y: number;
};
export declare function calculatePolygonVertices(sides: number, radius: number): Array<Point>;
export declare function calculateSideLength(radius: number, sides: number): number;
export declare function unitVector(p1: Point, p2: Point): Point;
export declare function normalVector(p1: Point, p2: Point): Point;
export declare function calculateTrianglePositions(vertices: Array<Point>, sideIndex: number, triangles: number, height: number): Array<{
    baseCenter: Point;
    tip: Point;
}>;
export declare function calculatePolygonDotPosition({ polygonRadius, polygonSideCount, polygonEdgeNumber, polygonEdgePositionRatio, // from 0 to 1
gap, dotRadius, rotation, offset, flatSide, }: {
    polygonRadius: number;
    polygonSideCount: number;
    polygonEdgeNumber: number;
    polygonEdgePositionRatio: number;
    gap?: number;
    dotRadius: number;
    rotation?: number;
    offset?: number;
    flatSide?: PolygonSide;
}): {
    x: number;
    y: number;
};
export declare function getPolygonVertex(i: number, n: number, R: number): {
    x: number;
    y: number;
};
export declare const POLYGON_SIDE: readonly ["left", "right", "top", "bottom"];
export type PolygonSide = (typeof POLYGON_SIDE)[number];
export declare function computePolygonPoints({ width, height, sides, strokeWidth, rotation, flatSide, }: {
    width: number;
    height: number;
    sides: number;
    strokeWidth: number;
    rotation?: number;
    flatSide?: PolygonSide;
}): {
    x: number;
    y: number;
}[];
export {};
