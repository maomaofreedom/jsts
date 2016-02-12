import Polygon from '../Polygon';
import GeometryCollection from '../GeometryCollection';
import ArrayList from '../../../../../java/util/ArrayList';
import GeometryFilter from '../GeometryFilter';
export default class PolygonExtracter {
	constructor(...args) {
		this.comps = null;
		switch (args.length) {
			case 1:
				{
					let [comps] = args;
					this.comps = comps;
					break;
				}
		}
	}
	get interfaces_() {
		return [GeometryFilter];
	}
	static getPolygons(...args) {
		switch (args.length) {
			case 1:
				{
					let [geom] = args;
					return PolygonExtracter.getPolygons(geom, new ArrayList());
					break;
				}
			case 2:
				{
					let [geom, list] = args;
					if (geom instanceof Polygon) {
						list.add(geom);
					} else if (geom instanceof GeometryCollection) {
						geom.apply(new PolygonExtracter(list));
					}
					return list;
					break;
				}
		}
	}
	filter(geom) {
		if (geom instanceof Polygon) this.comps.add(geom);
	}
	getClass() {
		return PolygonExtracter;
	}
}

