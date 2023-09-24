
// galcon.dock

{
	init() {
		// fast references
		let dock = window.find(`content > div[data-area="dock"]`);
		this.els = {
			dock,
			doc: $(document),
			playPause: dock.find(`li[data-click="toggle-play"] i`),
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
			case "goto-intro": break;
			case "toggle-play":
				value = Self.els.playPause.hasClass("icon-pause")
					? "icon-play"
					: "icon-pause";
				Self.els.playPause.prop({ className: value });
				break;
			case "toggle-music": break;
			case "toggle-sound": break;
			case "toggle-fps": break;
		}
	},
	doRange(event) {
		let Self = galcon.dock,
			Drag = Self.drag;
		switch (event.type) {
			case "mousedown":
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				break;
			case "mouseup":
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doRange);
				break;
		}
	}
}
