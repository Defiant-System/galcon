
class Ship {
	constructor(pos, planet, fleet_id, owner, value) {
		let ship_speed_multiplier = 1.3;

		this.pos = pos;
		this.ppos = new Point(pos._x, pos._y);
		this.vpos = new Point(pos._x, pos._y);
		this.dv = new Point(0, 0);

		this.ship_radius = 5.1;
		this.speed = 0.65;
		this.aspeed = Math.PI / 64;
		
		this.angle = 0;
		this.vangle = 0;

		this.rot_time = 0;
		this.frame = 0;
		this.vframe = 0;

		this.target = planet;
		this.fleet_id = fleet_id;
		this.owner = owner;
		this.value = value;

		this.collision_history = [];
		this.collision_num = 0;
	}

	Rotate(delta) {
		let px = this.vpos._x - this.ppos._x,
			py = this.vpos._y - this.ppos._y,
			npos = new Point(px, py);

		let vangl = this.vangle;
		let theta = Math.atan2(npos._y, npos._x);
		let aPlus = this.aspeed * 4 * delta;

		if (this.vframe == 0) vangl = theta;
		if (theta - vangl > Math.PI) vangl = vangl + Math.PI * 2;
		if (vangl - theta > Math.PI) theta = theta + Math.PI * 2;
		if (vangl < theta) vangl = vangl + aPlus;
		if (vangl > theta) vangl = vangl - aPlus;
		if (Math.abs(theta - vangl) < aPlus) vangl = theta;

		this.vangle = vangl;
		this.vframe += 1;
	}

	Move(rect, delta, WTF) {
		this.collision_num = 0;
		
		let px = this.pos._x - this.ppos._x,
			py = this.pos._y - this.ppos._y,
			npos = new Point(px, py);

		if (npos.x + npos.y < this.speed / 15 && this.frame % 16 == 0) {
			this.pos._x = this.pos._x + (Math.random() * 2 - 1) * this.speed * 3;
			this.pos._y = this.pos._y + (Math.random() * 2 - 1) * this.speed * 3;
		}
			
		npos._x = this.target.pos._x - this.pos._x;
		npos._y = this.target.pos._y - this.pos._y;
		let _loc_5 = this.angle;
		let _loc_6 = Math.atan2(npos._y, npos._x);

		if (this.frame == 0) {
			_loc_5 = _loc_6;
		} else {
			if (_loc_6 - _loc_5 > Math.PI) {
				_loc_5 = _loc_5 + Math.PI * 2;
			}
			if (_loc_5 - _loc_6 > Math.PI) {
				_loc_6 = _loc_6 + Math.PI * 2;
			}
			if (_loc_5 < _loc_6) {
				_loc_5 = _loc_5 + this.aspeed * delta;
				var _loc_8 = this.rot_time + 1;
				this.rot_time = _loc_8;
			}
			if (_loc_5 > _loc_6) {
				_loc_5 = _loc_5 - this.aspeed * delta;
				var _loc_8 = this.rot_time + 1;
				this.rot_time = _loc_8;
			}
			if (Math.abs(_loc_6 - _loc_5) < this.aspeed * delta) {
				_loc_5 = _loc_6;
				this.rot_time = 0;
			}
		}

		if (this.rot_time > 40) {
			this.aspeed = this.aspeed + Math.PI * 2 / (64 * 40);
		}
		if (_loc_5 > Math.PI) {
			_loc_5 = _loc_5 - Math.PI * 2;
		}
		if (_loc_5 < -Math.PI) {
			_loc_5 = _loc_5 + Math.PI * 2;
		}

		this.angle = _loc_5;
		this.pos._x = this.pos._x + Math.cos(this.angle) * this.speed * delta;
		this.pos._y = this.pos._y + Math.sin(this.angle) * this.speed * delta;

		if (this.pos.x < rect.left) this.pos.x = rect.left;
		if (this.pos.x > rect.right) this.pos.x = rect.right;
		if (this.pos.y < rect.top) this.pos.y = rect.top;
		if (this.pos.y > rect.bottom) this.pos.y = rect.bottom;
		
		this.ppos._x = this.vpos._x;
		this.ppos._y = this.vpos._y;
		this.stuckcheck += 1;
		if (this.stuckcheck > 60) {
			this.stuckcheck = 0;
			if (this.pos.subtract(this.checkpos).length < 3) {
				this.stuck += 1;
			} else {
				this.stuck = 0;
				this.checkpos = new Point(this.pos._x, this.pos._y);
			}
		}
		if (WTF) {
			this.vpos._x = this.vpos._x + (this.pos._x - this.vpos._x) * 0.12 * delta;
			this.vpos._y = this.vpos._y + (this.pos._y - this.vpos._y) * 0.12 * delta;
		} else {
			this.vpos._x = this.pos._x;
			this.vpos._y = this.pos._y;
		}
		this.frame += 1;
	}
	
	CollidePlanet(planet) {
		if (planet === this.target) return this.Arrived();

		this.dv._x = planet.pos._x - this.pos._x;
		this.dv._y = planet.pos._y - this.pos._y;
		var _loc_2 = Math.sqrt(this.dv._x * this.dv._x + this.dv._y * this.dv._y);
		if (_loc_2 > planet.radius + this.ship_radius) {
			return;
		}

		// tangent slide
		let _loc_4 = new Point(this.target.pos._x - planet.pos._x, this.target.pos._y - planet.pos._y);
		_loc_2 = Math.sqrt(_loc_4._x * _loc_4._x + _loc_4._y * _loc_4._y);
		if (_loc_2 == 0) _loc_2 = 1;
		
		_loc_4._x = _loc_4._x / _loc_2;
		_loc_4._y = _loc_4._y / _loc_2;
		_loc_2 = _loc_4._x;
		_loc_4._x = -_loc_4._y;
		_loc_4._y = _loc_2;
		_loc_2 = this.dv._x * _loc_4._x + this.dv._y * _loc_4._y;
		let _loc_5 = 0.5;

		if (_loc_2 > 0) {
			this.pos._x = this.pos._x - _loc_4._x * this.speed * _loc_5;
			this.pos._y = this.pos._y - _loc_4._y * this.speed * _loc_5;
		} else{
			this.pos._x = this.pos._x + _loc_4._x * this.speed * _loc_5;
			this.pos._y = this.pos._y + _loc_4._y * this.speed * _loc_5;
		}

		this.dv._x = planet.pos._x - this.pos._x;
		this.dv._y = planet.pos._y - this.pos._y;
		_loc_2 = Math.sqrt(this.dv._x * this.dv._x + this.dv._y * this.dv._y);

		var _loc_3 = (planet.radius + this.ship_radius) / _loc_2;
		this.pos._x = planet.pos._x - this.dv._x * _loc_3;
		this.pos._y = planet.pos._y - this.dv._y * _loc_3;
	}
	
	Collide() {
		
	}

	Arrived() {
		// stops loop
		Game._paused = true;
	}
}
