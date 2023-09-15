
class Ship {
	constructor(pos, planet, fleet_id, owner, value) {
		this.pos = pos;
		this.ppos = new Point(pos._x, pos._y);
		this.vpos = new Point(pos._x, pos._y);
		this.dv = new Point(0, 0);

		this.ship_radius = 10;
		this.speed = 0.65;
		this.angle_speed = Math.PI / 64;
		
		this.angle = 0;
		this.vangle = 0;
		this.rotation_time = 0;
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
		let tmp_point = new Point(this.vpos._x - this.ppos._x, this.vpos._y - this.ppos._y);
		let vector_angle = this.vangle;
		let diff_angle = Math.atan2(tmp_point._y, tmp_point._x);
		let move_angle = this.angle_speed * 4 * delta;

		if (this.vframe == 0) vector_angle = diff_angle;
        if (diff_angle - vector_angle > Math.PI) vector_angle += Math.PI * 2;
        if (vector_angle - diff_angle > Math.PI) diff_angle += Math.PI * 2;
        if (vector_angle < diff_angle) vector_angle += move_angle;
        if (vector_angle > diff_angle) vector_angle -= move_angle;
        if (Math.abs(diff_angle - vector_angle) < move_angle) vector_angle = diff_angle;

		this.vangle = vector_angle;
		this.vframe += 1;
	}

	Move(rect, delta, smooth) {
		this.collision_num = 0;
		
		let tmp_point = new Point();
		tmp_point._x = this.pos._x - this.ppos._x;
		tmp_point._y = this.pos._y - this.ppos._y;

		if (tmp_point._x + tmp_point._y < this.speed / 15 && this.frame % 16 == 0) {
			this.pos._x += (Math.random() * 2 - 1) * this.speed * 3;
			this.pos._y += (Math.random() * 2 - 1) * this.speed * 3;
		}
			
		tmp_point._x = this.target.pos._x - this.pos._x;
		tmp_point._y = this.target.pos._y - this.pos._y;
		let currAngle = this.angle;
		let diffAngle = Math.atan2(tmp_point._y, tmp_point._x);

		if (this.frame == 0) {
			currAngle = diffAngle;
		} else {
			if (diffAngle - currAngle > Math.PI) {
				currAngle += Math.PI * 2;
			}
			if (currAngle - diffAngle > Math.PI) {
				diffAngle += Math.PI * 2;
			}
			if (currAngle < diffAngle) {
				currAngle += this.angle_speed * delta;
				this.rotation_time += 1;
			}
			if (currAngle > diffAngle) {
				currAngle -= this.angle_speed * delta;
				this.rotation_time += 1;
			}
			if (Math.abs(diffAngle - currAngle) < this.angle_speed * delta) {
				currAngle = diffAngle;
				this.rotation_time = 0;
			}
		}

		if (this.rotation_time > 40) this.angle_speed += Math.PI * 2 / (64 * 40);
		if (currAngle > Math.PI) currAngle -= Math.PI * 2;
		if (currAngle < -Math.PI) currAngle += Math.PI * 2;

		this.angle = currAngle;
		this.pos._x += Math.cos(this.angle) * this.speed * delta;
		this.pos._y += Math.sin(this.angle) * this.speed * delta;

		if (this.pos._x < rect.left) this.pos._x = rect.left;
		if (this.pos._x > rect.right) this.pos._x = rect.right;
		if (this.pos._y < rect.top) this.pos._y = rect.top;
		if (this.pos._y > rect.bottom) this.pos._y = rect.bottom;
		
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
		if (smooth) {
			this.vpos._x += (this.pos._x - this.vpos._x) * 0.12 * delta;
			this.vpos._y += (this.pos._y - this.vpos._y) * 0.12 * delta;
		} else {
			this.vpos._x = this.pos._x;
			this.vpos._y = this.pos._y;
		}
		this.frame += 1;
	}
	
	CollidePlanet(planet) {
		if (this.pos.distance(planet.pos) > planet.radius + this.ship_radius) return;
		if (planet === this.target) return this.Arrived();

		// tangent slide
		let tmp_pos = new Point(this.target.pos._x - planet.pos._x, this.target.pos._y - planet.pos._y);
		let dist = this.target.pos.distance(planet.pos);
		if (dist == 0) dist = 1;
		
		tmp_pos._x = tmp_pos._x / dist;
		tmp_pos._y = tmp_pos._y / dist;
		dist = tmp_pos._x;
		tmp_pos._x = -tmp_pos._y;
		tmp_pos._y = dist;
		dist = this.dv._x * tmp_pos._x + this.dv._y * tmp_pos._y;
		let _loc_5 = 0.5;

		if (dist > 0) {
			this.pos._x -= tmp_pos._x * this.speed * _loc_5;
			this.pos._y -= tmp_pos._y * this.speed * _loc_5;
		} else{
			this.pos._x += tmp_pos._x * this.speed * _loc_5;
			this.pos._y += tmp_pos._y * this.speed * _loc_5;
		}

		this.dv._x = planet.pos._x - this.pos._x;
		this.dv._y = planet.pos._y - this.pos._y;
		dist = planet.pos.distance(this.pos);

		var _loc_3 = (planet.radius + this.ship_radius) / dist;
		this.pos._x = planet.pos._x - this.dv._x * _loc_3;
		this.pos._y = planet.pos._y - this.dv._y * _loc_3;
	}
	
	Collide(ship) {
		let collision_count = 0;
        // while (collision_count < ship.collision_num) {
        //     if (ship.collision_history[collision_count] == this) {
        //         return;
        //     }
        //     collision_count++;
        // }

        this.collision_history[this.collision_num] = ship;
        this.collision_num += 1;
        this.dv._x = ship.pos._x - this.pos._x;
        this.dv._y = ship.pos._y - this.pos._y;
        var _loc_3 = Math.sqrt(this.dv._x * this.dv._x + this.dv._y * this.dv._y);
        if (_loc_3 > this.ship_radius * 2) {
            return;
        }

        if (_loc_3 == 0) {
            _loc_3 = 1;
            this.dv._x = Math.random() * 2 - 1;
            this.dv._y = Math.random() * 2 - 1;
        }
            
        var _loc_4 = (this.pos._x + ship.pos._x) / 2;
        var _loc_5 = (this.pos._y + ship.pos._y) / 2;
        var _loc_6 = this.ship_radius / _loc_3;
        this.dv._x = this.dv._x * _loc_6;
        this.dv._y = this.dv._y * _loc_6;
        this.pos._x = _loc_4 - this.dv._x;
        this.pos._y = _loc_5 - this.dv._y;
        ship.pos._x = _loc_4 + this.dv._x;
        ship.pos._y = _loc_5 + this.dv._y;
	}

	Arrived() {
		if (this.pos.distance(this.target.pos) < this.target.radius) {
			let index = Main.allships.findIndex(s => s == this);
			Main.allships.splice(index, 1);
		}
	}
}
