import { PolygonSide } from '../utility/geometry';
type PolygonInput = {
    width: number;
    height: number;
    sides: number;
    stroke?: string;
    strokeWidth?: number;
    fill?: string;
    rotation?: number;
    flatSide?: PolygonSide;
};
declare const Polygon: React.FC<PolygonInput>;
export default Polygon;
