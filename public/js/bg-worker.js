let Surface = {
	texture: {},
	maps: "astroid gaia gas_giant hoth ixchel jupiter mars mercury moon muunilinst pluto quom saturn sun tatooine venus".split(" "),
	init() {
		this.TAU = Math.PI * 2;
		this.piDeg = Math.PI / 180;
		this.images = [...this.maps];
		this.loadTextures();
	},
	loadTextures() {
		let Self = this,
			name = Self.images.pop(),
			request = new Request( `/app/ant/galcon/img/${name}.jpg`);
		fetch(request).then(async resp => {
			let blob = await resp.blob(),
				img = await createImageBitmap(blob);

			// image to be used in "draw"
			Self.texture[name] = img;

			if (Self.images.length) Self.loadTextures();
			// Surface is ready
			else Anim.draw();
		});
	},
	update(p) {
		let img = this.texture[this.maps[p.texture]];
		// rotate planet
		p.rotation += p.speed;
		if (!p.rotation_max && img) {
			let ratio = img.width / img.height;
			p.rotation_max = (ratio * (p.r * 2)) | 0;
		}
		if (p.speed > 0 && p.rotation > p.rotation_max) p.rotation = 0;
		if (p.speed < 0 && p.rotation < -p.r * 4) p.rotation = p.rotation_max;
	},
	render(ctx, p) {
		let img = this.texture[this.maps[p.texture]],
			r = p.r,
			x = p.x,
			y = p.y,
			r2 = r << 1,
			r0 = 1,
			r1 = r * 1.25,
			x0 = x - (r * .35),
			y0 = y - (r * .35),
			x1 = x0,
			y1 = y0,
			gradient = ctx.createRadialGradient(x0, y0, r0, x1, y1, r1);

		gradient.addColorStop(0, "#ccc");
		gradient.addColorStop(.3, "#666");
		gradient.addColorStop(1, "#181818");

		ctx.save();
		// tilt planet
		ctx.translate(x, y);
		ctx.rotate(p.tilt * this.piDeg);
		ctx.translate(-x, -y);
		// clip planet area
		ctx.beginPath();
		ctx.arc(x, y, r, 0, this.TAU);
		ctx.clip();


		let ratio = img.width / img.height,
			tH = r2,
			tW = tH * ratio;

		if (p.speed > 0) {
			let tX = x - r - p.rotation;
			ctx.drawImage(img, tX, y - r, tW, tH);
			if (p.rotation > r2) ctx.drawImage(img, tX + tW, y - r, tW, tH);
		} else {
			let tX = x - tW + r - p.rotation;
			ctx.drawImage(img, tX, y - r, tW, tH);
			if (p.rotation < -r2) ctx.drawImage(img, tX - tW, y - r, tW, tH);
			else if (p.rotation > 0) ctx.drawImage(img, tX + tW, y - r, tW, tH);
		}

		// radial gradient
		ctx.globalCompositeOperation = "hard-light";
		ctx.fillStyle = gradient;
		ctx.beginPath();
		ctx.arc(x, y, r+1, 0, this.TAU);
		ctx.fill();

		/*/ fill cover START */
		ctx.globalCompositeOperation = "overlay";
		ctx.fillStyle = "#999";  // p.color
		ctx.beginPath();
		ctx.arc(x, y, r+1, 0, this.TAU);
		ctx.fill();

		ctx.restore();
	}
};



let Anim = {
	init(canvas) {
		// initial values
		this.images = [];
		this.planets = [];
		this.paused = false;
		this.TAU = Math.PI * 2;

		Surface.init();

		// setTimeout(() => { this.paused = true }, 300);
	},
	dispatch(event) {
		let Self = Anim,
			value;
		switch (event.type) {
			case "start":
				Self.cvs = event.canvas;
				Self.ctx = Self.cvs.getContext("2d");
				Self.width = Self.cvs.width;
				Self.height = Self.cvs.height;
				Self.dispatch({ type: "create-scene" });
				break;
			case "pause":
				Self.paused = true;
				break;
			case "resume":
				if (Self.paused && Self.ctx) {
					Self.paused = false;
					Self.draw();
				}
				break;
			case "create-scene":
				// get bg image
				let request = new Request("/app/ant/galcon/img/bg-02.jpg");
				fetch(request).then(async resp => {
					let blob = await resp.blob(),
						img = await createImageBitmap(blob);
					// image to be used in "draw"
					Self.bgImage = img;
					Self.bgRotation = 0;
					// start rendering
					// Self.draw();
				});

				// add temp planets
				Self.planets.push({ x: 100, y: 100, r: 50, tilt: 15, texture: 3, speed: .15, rotation: 0 });

				// starfield
				Self.maxDepth = 64;
				Self.stars = [];

				// stars
				let count = 192;
				while (count--) {
					Self.stars.push({
						x: Utils.random(-25, 25) | 0,
						y: Utils.random(-25, 25) | 0,
						z: Utils.random(1, Self.maxDepth) | 0
					});
				}
				break;
			case "add-planets":
				break;
		}
	},
	update(Self) {
		let halfWidth = Self.width / 2,
			halfHeight = Self.height / 2,
			stars = Self.stars,
			len = stars.length;

		// update planets
		Self.planets.map(p => Surface.update(p));

		// starfield planets
		while (len--) {
			stars[len].z -= 0.01;
			if (stars[len].z <= 0) {
				stars[len].x = Utils.random(-25, 25) | 0;
				stars[len].y = Utils.random(-25, 25) | 0;
				stars[len].z = Utils.random(1, Self.maxDepth) | 0;
			}
		}
		// miniscule bg-image rotation
		Self.bgRotation += .00005;
	},
	draw() {
		let Self = Anim,
			cvs = Self.cvs,
			ctx = Self.ctx,
			halfWidth = Self.width >> 1,
			halfHeight = Self.height >> 1,
			stars = Self.stars,
			len = stars.length;
		// update scene
		Self.update(Self);
		// clear react
		cvs.width = Self.width;
		cvs.height = Self.height;
		
		// bg image
		ctx.save();
		ctx.translate(halfWidth, halfHeight);
		ctx.rotate(Self.bgRotation);
		ctx.drawImage(Self.bgImage, -512, -512); // image w & h: 1024px
		ctx.restore();

		// draw planets
		Self.planets.map(p => Surface.render(ctx, p));

		while (len--) {
			k  = 128 / stars[len].z,
			px = stars[len].x * k + halfWidth,
			py = stars[len].y * k + halfHeight;

			if (px >= 0 && px <= Self.width && py >= 0 && py <= Self.height) {
				let alpha = (1 - stars[len].z / 48),
					size = Math.max(alpha, 0.1) + 0.45,
					c = 255 - Math.round(Math.abs(alpha * 32));
				ctx.beginPath();
				ctx.fillStyle = `rgba(${c}, ${c}, ${c}, ${alpha})`;
				ctx.arc(px, py, size, 0, Self.TAU);
				ctx.fill();
			}
		}
		
		// next tick
		if (!Self.paused) requestAnimationFrame(Self.draw);
	}
};

// auto call init
Anim.init();

// forward message / event
self.onmessage = event => Anim.dispatch(event.data);



// simple utils
let Utils = {
	// get a random number within a range
	random(min, max) {
		return Math.random() * ( max - min ) + min;
	},
	// calculate the distance between two points
	calculateDistance(p1x, p1y, p2x, p2y) {
		let xDistance = p1x - p2x,
			yDistance = p1y - p2y;
		return Math.sqrt((xDistance ** 2) + (yDistance ** 2));
	}
};
