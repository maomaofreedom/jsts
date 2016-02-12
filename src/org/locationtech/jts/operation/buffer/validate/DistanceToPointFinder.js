import LineString from '../../../geom/LineString';
import Geometry from '../../../geom/Geometry';
import Coordinate from '../../../geom/Coordinate';
import Polygon from '../../../geom/Polygon';
import LineSegment from '../../../geom/LineSegment';
import PointPairDistance from './PointPairDistance';
import GeometryCollection from '../../../geom/GeometryCollection';
export default class DistanceToPointFinder {
	constructor(...args) {
		switch (args.length) {
			case 0:
				{
					let [] = args;
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	static computeDistance(...args) {
		switch (args.length) {
			case 3:
				if (args[2] instanceof PointPairDistance && (args[0] instanceof LineString && args[1] instanceof Coordinate)) {
					let [line, pt, ptDist] = args;
					var coords = line.getCoordinates();
					var tempSegment = new LineSegment();
					for (var i = 0; i < coords.length - 1; i++) {
						tempSegment.setCoordinates(coords[i], coords[i + 1]);
						var closestPt = tempSegment.closestPoint(pt);
						ptDist.setMinimum(closestPt, pt);
					}
				} else if (args[2] instanceof PointPairDistance && (args[0] instanceof Polygon && args[1] instanceof Coordinate)) {
					let [poly, pt, ptDist] = args;
					DistanceToPointFinder.computeDistance(poly.getExteriorRing(), pt, ptDist);
					for (var i = 0; i < poly.getNumInteriorRing(); i++) {
						DistanceToPointFinder.computeDistance(poly.getInteriorRingN(i), pt, ptDist);
					}
				} else if (args[2] instanceof PointPairDistance && (args[0] instanceof Geometry && args[1] instanceof Coordinate)) {
					let [geom, pt, ptDist] = args;
					if (geom instanceof LineString) {
						DistanceToPointFinder.computeDistance(geom, pt, ptDist);
					} else if (geom instanceof Polygon) {
						DistanceToPointFinder.computeDistance(geom, pt, ptDist);
					} else if (geom instanceof GeometryCollection) {
						var gc = geom;
						for (var i = 0; i < gc.getNumGeometries(); i++) {
							var g = gc.getGeometryN(i);
							DistanceToPointFinder.computeDistance(g, pt, ptDist);
						}
					} else {
						ptDist.setMinimum(geom.getCoordinate(), pt);
					}
				} else if (args[2] instanceof PointPairDistance && (args[0] instanceof LineSegment && args[1] instanceof Coordinate)) {
					let [segment, pt, ptDist] = args;
					var closestPt = segment.closestPoint(pt);
					ptDist.setMinimum(closestPt, pt);
				}
				break;
		}
	}
	getClass() {
		return DistanceToPointFinder;
	}
}

