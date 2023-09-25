
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
				let el = $(event.target),
					knob = el.find("span"),
					drag = {
						knob,
						min: 9,
						max: +el.prop("offsetWidth") - +knob.prop("offsetWidth") - 9,
						click: event.clientX - knob.offset().left,
						field: el.parent().find(".attack-fleet"),
						stage: galcon.stage,
					};
				// prepare range knob
				// drag.el.css({  });

				Self.drag = drag;
				// cover app
				Self.els.content.addClass("cover");
				// bind event handlers
				Self.els.doc.on("mousemove mouseup", Self.doRange);
				break;
			case "mousemove":
				let left = Math.min(Math.max(event.clientX - Drag.click, Drag.min), Drag.max),
					val = Math.invLerp(Drag.min, Drag.max, left);
				Drag.knob.css({ left });
				// attack fleet size
				Drag.field.html(`${val * 100 | 0}%`);
				// update global value
				Drag.stage.attack_force = val;
				break;
			case "mouseup":
				// uncover app
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doRange);
				break;
		}
	}
}
