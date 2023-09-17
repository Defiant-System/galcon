
let Fx = {
	init() {
		this.pack = [];
		this.cvs = document.createElement("canvas");
		this.ctx = this.cvs.getContext("2d", { willReadFrequently: true });
		this.cvs.width = 320;
		this.cvs.height = 240;

		this.loadImage();
	},
	loadImage() {
		let width = this.cvs.width,
			height = this.cvs.height,
			img = new Image();
		img.onload = () => {
			this.ctx.drawImage(img, 0, 0);
			this.pack[0] = this.ctx.getImageData(0, 0, width, height);
			this.ctx.drawImage(img, -320, 0);
			this.pack[1] = this.ctx.getImageData(0, 0, width, height);
			this.ctx.drawImage(img, 0, -240);
			this.pack[2] = this.ctx.getImageData(0, 0, width, height);
			this.ctx.drawImage(img, -320, -240);
			this.pack[3] = this.ctx.getImageData(0, 0, width, height);

			this._loaded = true;
		};
		img.src = "~/img/explosion.jpg";
	},
	explode(x, y) {
		let ctx = GameUI.ctx;

		ctx.save();
		ctx.globalCompositeOperation = "lighter";
		// ctx.drawImage(this.img, x, y);
		ctx.putImageData(this.pack[0], 50, 20);
		ctx.putImageData(this.pack[1], 400, 20);
		ctx.putImageData(this.pack[2], 50, 270);
		ctx.putImageData(this.pack[3], 400, 270);
		ctx.restore();
	}
};
