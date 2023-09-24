
// galcon.dock

{
	init() {
		// fast references
		let dock = window.find(`content > div[data-area="dock"]`);
		this.els = {
			dock,
			doc: $(document),
			content: window.find("content"),
			playPause: dock.find(`li[data-click="toggle-play"] i`),
			range: dock.find(".range"),
		};
		// bind event handlers
		this.els.range.on("mousedown", this.doRange);
	},
	dispatch(event) {
		let APP = galcon,
			Self = APP.dock,
			name,
			value,
			el;
		// console.log(event);
		switch (event.type) {
			// system events
			case "window.focus":
				Self.els.content.removeClass("freeze");
				Self.dispatch({ type: "toggle-play", state: "play" });
				break;
			case "window.blur":
				Self.els.content.addClass("freeze");
				Self.dispatch({ type: "toggle-play", state: "pause" });
				break;
			// custom events
			case "goto-intro":
				if (APP.start.starfield) APP.start.starfield.stop();
				if (GameUI.fpsControl) GameUI.fpsControl.stop();
				APP.start.dispatch({ type: "intro-view" });
				break;
			case "toggle-play":
				el = Self.els.playPause;
				value = el.hasClass("icon-pause");
				if (event.state) value = event.state === "pause";

				el.prop({ className: value ? "icon-play" : "icon-pause" });
				// pause / play everything
				Self.els.content.toggleClass("paused", !value);

				if (GameUI.fpsControl) {
					GameUI.fpsControl[value ? "stop" : "start"]();
				} else {
					APP.start.starfield[value ? "stop" : "start"]();
				}
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
