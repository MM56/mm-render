/**
 * Render class
 *
 * @class
 *
 * @license {@link https://opensource.org/licenses/MIT|MIT}
 *
 * @example
 * Render.init();
 * Render.add(cb, 30);
 */
class Render {

	constructor() {
		this._update = this._update.bind(this);
		this.add = this.add.bind(this);
		this.remove = this.remove.bind(this);
		this.reset = this.reset.bind(this);
		this.start = this.start.bind(this);

		this.reset();
	}

	/**
	 * init method
	 *
	 * @param {object} options
	 * @param {boolean} [options.autostart = true]
	 * @param {function} options.preUpdate
	 * @param {function} options.postUpdate
	 * @returns
	 *
	 * @memberof Render
	 */
	init(options = { autostart: true }) {
		if (this._initialized) {
			return;
		}

		this._initialized = true;
		const noop = function() {};

		if (typeof options.preUpdate === 'function') {
			this._preUpdate = options.preUpdate;
		} else {
			this._preUpdate = noop;
		}
		if (typeof options.postUpdate === 'function') {
			this._postUpdate = options.postUpdate;
		} else {
			this._postUpdate = noop;
		}

		const autostart = typeof options.autostart === 'boolean' ? options.autostart : true;
		if (autostart) {
			this._update();
		}
	}

	_update() {
		this._preUpdate();

		const now = Date.now();
		let i = this._datas.length - 1;
		while (i >= 0) {
			const data = this._datas[ i ];
			const delta = now - data.lastTime;
			const interval = 1000 / data.fps;
			if (delta > interval) {
				data.lastTime += interval;
				data.cb();
			}
			i--;
		}

		const newTime = performance.now() / 1e3;
		this._deltaTime = newTime - this._oldTime;
		this._oldTime = newTime;

		this.elapsedTime += this._deltaTime;

		this._postUpdate();

		this._raf = requestAnimationFrame(this._update);
	}

	/**
	 * add method adds a callback that will be called every x fps
	 *
	 * @param {function} cb
	 * @param {number} [fps=60]
	 *
	 * @memberof Render
	 */
	add(cb, fps = 60) {
		if (typeof cb !== 'function') {
			throw new Error('Invalid callback');
		} else if (!this._initialized) {
			this.init();
		}
		const data = { cb, fps, lastTime: Date.now() };
		this._datas.push(data);
		data.id = this._datas.length;
	}

	/**
	 * remove method removes a callback to be called
	 *
	 * @param {function} cb
	 *
	 * @memberof Render
	 */
	remove(cb) {
		if (typeof cb !== 'function') {
			throw new Error('Invalid callback');
		}
		let i = this._datas.length - 1;
		while (i >= 0) {
			const data = this._datas[ i ];
			if (data.cb === cb) {
				this._datas.splice(i, 1);
				break;
			}
			i--;
		}
	}

	/**
	 * reset method resets or sets default internal variables
	 *
	 * @memberof Render
	 */
	reset() {
		this._datas = [];
		this._initialized = false;

		this._deltaTime = 0;
		this._oldTime = 0;
		this.elapsedTime = 0;

		this.paused = false;
	}

	/**
	 * start method allows you to start the requestAnimationFrame calls (useful if not autostarted)
	 *
	 * @memberof Render
	 */
	start() {
		this._update();
	}

}

export default new Render();
