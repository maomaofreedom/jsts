import LineString from '../geom/LineString';
import HashMap from '../../../../java/util/HashMap';
import GeometryTransformer from '../geom/util/GeometryTransformer';
import TaggedLinesSimplifier from './TaggedLinesSimplifier';
import IllegalArgumentException from '../../../../java/lang/IllegalArgumentException';
import GeometryComponentFilter from '../geom/GeometryComponentFilter';
import TaggedLineString from './TaggedLineString';
export default class TopologyPreservingSimplifier {
	constructor(...args) {
		this.inputGeom = null;
		this.lineSimplifier = new TaggedLinesSimplifier();
		this.linestringMap = null;
		switch (args.length) {
			case 1:
				{
					let [inputGeom] = args;
					this.inputGeom = inputGeom;
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	static get LineStringTransformer() {
		return LineStringTransformer;
	}
	static get LineStringMapBuilderFilter() {
		return LineStringMapBuilderFilter;
	}
	static simplify(geom, distanceTolerance) {
		var tss = new TopologyPreservingSimplifier(geom);
		tss.setDistanceTolerance(distanceTolerance);
		return tss.getResultGeometry();
	}
	getResultGeometry() {
		if (this.inputGeom.isEmpty()) return this.inputGeom.copy();
		this.linestringMap = new HashMap();
		this.inputGeom.apply(new LineStringMapBuilderFilter(this));
		this.lineSimplifier.simplify(this.linestringMap.values());
		var result = new LineStringTransformer(this.linestringMap).transform(this.inputGeom);
		return result;
	}
	setDistanceTolerance(distanceTolerance) {
		if (distanceTolerance < 0.0) throw new IllegalArgumentException("Tolerance must be non-negative");
		this.lineSimplifier.setDistanceTolerance(distanceTolerance);
	}
	getClass() {
		return TopologyPreservingSimplifier;
	}
}
class LineStringTransformer extends GeometryTransformer {
	constructor(...args) {
		super();
		this.linestringMap = null;
		switch (args.length) {
			case 1:
				{
					let [linestringMap] = args;
					this.linestringMap = linestringMap;
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	transformCoordinates(coords, parent) {
		if (coords.size() === 0) return null;
		if (parent instanceof LineString) {
			var taggedLine = this.linestringMap.get(parent);
			return this.createCoordinateSequence(taggedLine.getResultCoordinates());
		}
		return super.transformCoordinates(coords, parent);
	}
	getClass() {
		return LineStringTransformer;
	}
}
class LineStringMapBuilderFilter {
	constructor(...args) {
		this.tps = null;
		switch (args.length) {
			case 1:
				{
					let [tps] = args;
					this.tps = tps;
					break;
				}
		}
	}
	get interfaces_() {
		return [GeometryComponentFilter];
	}
	filter(geom) {
		if (geom instanceof LineString) {
			var line = geom;
			if (line.isEmpty()) return null;
			var minSize = line.isClosed() ? 4 : 2;
			var taggedLine = new TaggedLineString(line, minSize);
			this.tps.linestringMap.put(line, taggedLine);
		}
	}
	getClass() {
		return LineStringMapBuilderFilter;
	}
}

