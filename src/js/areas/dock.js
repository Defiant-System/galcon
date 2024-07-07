
// galcon.dock

{
	init() {
		// fast references
		let dock = window.find(`content > div[data-area="dock"]`);
		this.els = {
			dock,
			doc: $(document),
			ul: dock.find("ul.dock"),
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
				if (Self.els.content.hasClass("get-ready")) return;
				Self.els.content.removeClass("freeze");
				if (!Self.els.content.hasClass("paused")) {
					Self.dispatch({ type: "toggle-play", state: "play" });
				}
				break;
			case "window.blur":
				if (Self.els.content.hasClass("get-ready")) return;
				Self.els.content.addClass("freeze");
				if (!Self.els.content.hasClass("paused")) {
					Self.dispatch({ type: "toggle-play", state: "pause" });
				}
				break;
			// custom events
			case "goto-intro":
				// if (APP.start.starfield) APP.start.starfield.stop();
				if (GameUI.fpsControl) GameUI.fpsControl.stop();
				APP.start.dispatch({ type: "intro-view" });
				break;
			case "toggle-play":
				el = Self.els.playPause;
				if (el.parent().hasClass("disabled")) return;
				
				value = el.hasClass("icon-pause");
				if (event.state) value = event.state === "pause";

				el.prop({ className: value ? "icon-play" : "icon-pause" });
				if (!event.state) {
					// pause / play everything
					Self.els.content.toggleClass("paused", !value);
				}
				if (GameUI.fpsControl) {
					GameUI.fpsControl[value ? "stop" : "start"]();
				} else {
					// APP.start.starfield[value ? "stop" : "start"]();
				}
				break;
			case "toggle-music":
				// update settings
				APP.settings.Music = event.play || !APP.settings.Music;

				if (!APP.settings.Music) {
					if (window.midi.playing) window.midi.pause();
				} else {
					window.midi.play({
						path: "/cdn/midi/music/Theme - Star Wars Cantina Band.mid",
						reverb: "cathedral",
						volume: .35,
						loop: true,
					});
				}
				// icon UI update
				Self.els.ul.find(`li[data-click="toggle-music"]`).toggleClass("active", !APP.settings.Music);
				break;
			case "toggle-sound":
				// toggle sound effects
				APP.settings.Sound =
				window.audio.mute = event.mute || !window.audio.mute;
				// icon UI update
				Self.els.ul.find(`li[data-click="toggle-sound"]`).toggleClass("active", window.audio.mute);
				break;
			case "toggle-fps":
				// toggle fps box
				APP.settings.Fps =
				GameUI.showFps = event.show || !GameUI.showFps;
				// icon UI update
				Self.els.ul.find(`li[data-click="toggle-fps"]`).toggleClass("active", !GameUI.showFps);
				break;
		}
	},
	doRange(event) {
		let APP = galcon,
			Self = APP.dock,
			Drag = Self.drag;
		switch (event.type) {
			// native event
			case "mousedown":
				let el = $(event.target),
					knob = el.find("span"),
					drag = {
						el,
						knob,
						min: 9,
						max: +el.prop("offsetWidth") - +knob.prop("offsetWidth") - 9,
						click: event.clientX,
						field: el.parent().find(".attack-fleet"),
						stage: APP.stage,
					},
					moveX = Math.min(Math.max(event.offsetX - (+knob.prop("offsetWidth") * .5), drag.min), drag.max);
				// exit if disabled
				if (el.parent().hasClass("disabled")) return;
				// prepare range knob
				knob.css({ left: moveX });
				// update click value
				drag.click -= moveX;
				// keep "hover" effect
				el.parent().addClass("active");
				// save reference to drag object
				Self.drag = drag;
				// prevent hiding
				Self.els.ul.removeClass("autohide");
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
				// reset range UI
				Drag.el.parent().removeClass("active");
				// autohide dock
				Self.els.ul.addClass("autohide");
				// uncover app
				Self.els.content.removeClass("cover");
				// unbind event handlers
				Self.els.doc.off("mousemove mouseup", Self.doRange);
				break;
			// custom event
			case "set-value":
				let v = event.value || .65;
				Self.els.dock.find(".range span").css({ left: Math.lerp(9, 133, v) });
				Self.els.dock.find(".attack-fleet").html(`${v * 100 | 0}%`);
				APP.stage.attack_force = v;
				break;
		}
	}
}
