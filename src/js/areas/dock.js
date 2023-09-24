
// galcon.dock

{
	init() {
		// fast references
		let dock = window.find(`content > div[data-area="dock"]`);
		this.els = {
			dock,
			range: dock.find(".range"),
		};
		// bind event handlers
		this.els.range.on("mousedown", this.doRange);
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.dock,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// custom events
			case "goto-intro":
			case "toggle-play":
			case "toggle-music":
			case "toggle-sound":
			case "toggle-fps":
				break;
		}
	},
	doRange(event) {
		let Self = galcon.dock,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown": break;
			case "mousemove": break;
			case "mouseup": break;
		}
	}
}
