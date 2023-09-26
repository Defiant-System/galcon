
class AI {
	constructor(id) {
		let Settings = galcon.settings;

		this.id = id;
		this.ai_difficulty = Settings.Difficulty;
		this.main = Main;

		this.ai_seed = this.main.prand();
		this.ai_frame = 0;
		this.ai_redirect = Settings.Difficulty > 5;

        this.ai_ships = [50, 65, 75, 75, 85, 100, 100, 120, 135, 150];
		this.ai_rand = [0, 25, 50, 50, 75, 100, 100, 100, 100, 100];
		this.ai_speed = [500, 333, 225, 225, 150, 100, 100, 100, 100, 100];
		this.ai_vacuum_timer = [150, 120, 100, 90, 75, 60, 55, 50, 45, 40];
		this.ai_beast_ships = [2, 4, 7, 9, 12, 15, 18, 20, 23, 25];
		this.ai_beast_planets = [6, 8, 10, 12, 13, 13, 13, 13, 13, 13];

        this.OWNER_OPPO = [Owner.HUMAN];
        this.OWNER_ME = id;
	}

	Ready(oppo) {
		// exclude "me"
		if (oppo.includes(this.id)) oppo.splice(this.id, 1);
        this.OWNER_OPPO = oppo;
		this.planets = this.main.planets;
		this.allships = this.main.allships;
	}

	Tick() {
		var _loc_4 = 0;
		var _loc_5 = null;
		var _loc_2 = this.ai_rand[this.ai_difficulty];
		var _loc_3 = this.ai_speed[this.ai_difficulty];

		if (Math.round(this.ai_frame + this.ai_seed * 2) % _loc_3 == 0) {
			if (this.main.prand() * 100 < _loc_2) {
				this.AILaunch(false);
			} else{
				this.AILaunch(true);
			}
		}

		if (this.ai_redirect) {
			_loc_4 = 0;
			while (_loc_4 < this.allships.fleets.length) {
				if (this.allships.fleets[_loc_4].owner == this.OWNER_ME && (this.ai_frame + _loc_4 * 35) % (_loc_3 * 60 * param1) == 0) {
					_loc_5 = this.AIFindTarget(false, this.allships.fleets[_loc_4].pos);
					if (_loc_5 != null) {
						this.allships.RedirectFleet(this.allships.fleets[_loc_4].id, _loc_5);
					}
				}
				_loc_4++;
			}
		}

		this.ai_frame += 1;
	}

	AIWinning() {
		var _loc_1 = 0;
        var _loc_4 = 0;
        var _loc_2 = 0;
        var _loc_3 = 0;
        _loc_1 = 0;
        while (_loc_1 < this.planets.length) {
            if (this.OWNER_OPPO.includes(this.planets[_loc_1].owner)) {
                _loc_2 = _loc_2 + this.planets[_loc_1].ships;
            }
            if (this.planets[_loc_1].owner == this.OWNER_ME) {
                _loc_3 = _loc_3 + this.planets[_loc_1].ships;
            }
            _loc_1++;
        }
        _loc_4 = 0;
        while (_loc_4 < this.allships.max_count) {
            _loc_1 = (this.allships.min_index + _loc_4) % this.allships.alloc_count;
            if (this.allships.ships[_loc_1] != null) {
                if (this.OWNER_OPPO.includes(this.allships.ships[_loc_1].owner)) {
                    _loc_2 = _loc_2 + this.allships.ships[_loc_1].value;
                }
                if (this.allships.ships[_loc_1].owner == this.OWNER_ME) {
                    _loc_3 = _loc_3 + this.allships.ships[_loc_1].value;
                }
            }
            _loc_4++;
        }
        return _loc_3 > _loc_2 * 2;
	}

	AIFindTarget(param1, param2) {
		var _loc_3 = 0;
        var _loc_5 = null;
        var _loc_6 = NaN;
        var _loc_7 = NaN;
        var _loc_4 = null;
        var _loc_8 = 0;
        var _loc_9 = this.AIWinning();
        _loc_3 = 0;
        while (_loc_3 < this.planets.length) {
            if (this.planets[_loc_3].owner != this.OWNER_ME && !(_loc_9 && this.planets[_loc_3].owner == Owner.NEUTRAL)) {
                if (param1) {
                    _loc_7 = this.main.prand();
                } else{
                    _loc_5 = this.planets[_loc_3].pos.subtract(param2);
                    _loc_7 = this.planets[_loc_3].production - this.planets[_loc_3].ships - _loc_5.length * 0.2;
                }
                if (_loc_4 == null || _loc_7 > _loc_8) {
                    _loc_8 = _loc_7;
                    _loc_4 = this.planets[_loc_3];
                }
            }
            _loc_3++;
        }
        return _loc_4; // returns planet
	}
	
	AILaunch(param1) {
        var _loc_2 = 0;
        var _loc_3 = null;
        while (_loc_2 < this.planets.length) {
            if (this.planets[_loc_2].owner == this.OWNER_ME && (_loc_3 == null || this.planets[_loc_2].ships > _loc_3.ships)) {
                _loc_3 = this.planets[_loc_2];
            }
            _loc_2++;
        }
        if (_loc_3 == null) {
            return;
        }
        var _loc_4 = this.AIFindTarget(param1, _loc_3.pos);
        if (this.AIFindTarget(param1, _loc_3.pos) == null) return;
        
		let fleet_id = this.allships.fleet_id++;
        this.allships.LaunchShips(_loc_3, _loc_4, fleet_id, .65);
	}
}
