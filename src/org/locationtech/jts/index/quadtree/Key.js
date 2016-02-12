import Coordinate from '../../geom/Coordinate';
import DoubleBits from './DoubleBits';
import Envelope from '../../geom/Envelope';
export default class Key {
	constructor(...args) {
		this.pt = new Coordinate();
		this.level = 0;
		this.env = null;
		switch (args.length) {
			case 1:
				{
					let [itemEnv] = args;
					this.computeKey(itemEnv);
					break;
				}
		}
	}
	get interfaces_() {
		return [];
	}
	static computeQuadLevel(env) {
		var dx = env.getWidth();
		var dy = env.getHeight();
		var dMax = dx > dy ? dx : dy;
		var level = DoubleBits.exponent(dMax) + 1;
		return level;
	}
	getLevel() {
		return this.level;
	}
	computeKey(...args) {
		switch (args.length) {
			case 1:
				{
					let [itemEnv] = args;
					this.level = Key.computeQuadLevel(itemEnv);
					this.env = new Envelope();
					this.computeKey(this.level, itemEnv);
					while (!this.env.contains(itemEnv)) {
						this.level += 1;
						this.computeKey(this.level, itemEnv);
					}
					break;
				}
			case 2:
				{
					let [level, itemEnv] = args;
					var quadSize = DoubleBits.powerOf2(level);
					this.pt.x = Math.floor(itemEnv.getMinX() / quadSize) * quadSize;
					this.pt.y = Math.floor(itemEnv.getMinY() / quadSize) * quadSize;
					this.env.init(this.pt.x, this.pt.x + quadSize, this.pt.y, this.pt.y + quadSize);
					break;
				}
		}
	}
	getEnvelope() {
		return this.env;
	}
	getCentre() {
		return new Coordinate((this.env.getMinX() + this.env.getMaxX()) / 2, (this.env.getMinY() + this.env.getMaxY()) / 2);
	}
	getPoint() {
		return this.pt;
	}
	getClass() {
		return Key;
	}
}

