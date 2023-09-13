
let Game = {
	init() {
		// fast references
		this.cvs = window.find("canvas");
		this.ctx = this.cvs[0].getContext("2d");

		let width = this.cvs.prop("offsetWidth"),
			height = this.cvs.prop("offsetHeight");
		this.cvs.attr({ width, height });
	},
	update() {
		
	},
	render() {
		
	}
}
