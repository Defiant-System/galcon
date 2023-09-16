
let Surface = {
	vpb: {}, // Vertex Position Buffers
	vtb: {}, // Vertex Texture Buffers
	vib: {}, // Vertex Index Buffers
	vnb: {}, // Vertex Normal Buffers
	shader: { // Shader Related
		frag: `@import "../glsl/per-fragment-lighting-fs.frag"`,
		vert: `@import "../glsl/per-fragment-lighting-vs.vert"`,
	},
	matrix: {},
	texture: {},
	utils: {},
	init() {
		this.cvs = document.createElement("canvas");
		this.wgl = this.cvs.getContext("webgl") || this.cvs.getContext("experimental-webgl");
		this.wgl.viewportWidth = this.cvs.width = 150;
		this.wgl.viewportHeight = this.cvs.height = 150;
		this.wgl.ratio = this.wgl.viewportWidth / this.wgl.viewportHeight;

		// this.texture.maps = "astroid burst gaia gas_giant hoth".split(" ");
		this.texture.maps = "alien astroid burst gaia gas_giant hoth ixchel jupiter mars mercury moon mustafar muunilinst pluto quom saturn sun tatooine venus".split(" ");
		this.utils.mat3 = mat3;
		this.utils.mat4 = mat4;
		this.matrix.projection = mat4.create();
		this.matrix.modelview  = mat4.create();
		this.matrix.mvStack    = [];
		
		this.initShaders();
		this.initBuffers();
		this.initTexture();

		this.wgl.clearColor(0.0, 0.0, 0.0, 0.0);
		this.wgl.enable(this.wgl.DEPTH_TEST);
	},
	initShaders() {
		this.shader.fragmentShader = this.compileShader("frag");
		this.shader.vertexShader = this.compileShader("vert");

		this.shader.program = this.wgl.createProgram();
		this.wgl.attachShader(this.shader.program, this.shader.vertexShader);
		this.wgl.attachShader(this.shader.program, this.shader.fragmentShader);
		this.wgl.linkProgram(this.shader.program);
		this.wgl.useProgram(this.shader.program);

		this.shader.program.vertexPositionAttribute = this.wgl.getAttribLocation(this.shader.program, "aVertexPosition");
		this.wgl.enableVertexAttribArray(this.shader.program.vertexPositionAttribute);
		this.shader.program.vertexNormalAttribute = this.wgl.getAttribLocation(this.shader.program, "aVertexNormal");
		this.wgl.enableVertexAttribArray(this.shader.program.vertexNormalAttribute);
		this.shader.program.textureCoordAttribute = this.wgl.getAttribLocation(this.shader.program, "aTextureCoord");
		this.wgl.enableVertexAttribArray(this.shader.program.textureCoordAttribute);
		this.shader.program.pMatrixUniform = this.wgl.getUniformLocation(this.shader.program, "uPMatrix");
		this.shader.program.mvMatrixUniform = this.wgl.getUniformLocation(this.shader.program, "uMVMatrix");
		this.shader.program.nMatrixUniform = this.wgl.getUniformLocation(this.shader.program, "uNMatrix");
		this.shader.program.colorMapSamplerUniform = this.wgl.getUniformLocation(this.shader.program, "uColorMapSampler");
		this.shader.program.useLightingUniform = this.wgl.getUniformLocation(this.shader.program, "uUseLighting");
		this.shader.program.ambientColorUniform = this.wgl.getUniformLocation(this.shader.program, "uAmbientColor");
		this.shader.program.pointLightingLocationUniform = this.wgl.getUniformLocation(this.shader.program, "uPointLightingLocation");
		this.shader.program.pointLightingDiffuseColorUniform = this.wgl.getUniformLocation(this.shader.program, "uPointLightingDiffuseColor");
	},
	initBuffers() {
		var latitudeBands = 25,
			longitudeBands = 25,
			radius = 13,
			vertexPositionData = [],
			normalData = [],
			textureCoordData = [],
			indexData = [];

		for (var latNumber=0; latNumber <= latitudeBands; latNumber++) {
			var theta = latNumber * Math.PI / latitudeBands,
				sinTheta = Math.sin(theta),
				cosTheta = Math.cos(theta);

			for (var longNumber=0; longNumber <= longitudeBands; longNumber++) {
				var phi = longNumber * 2 * Math.PI / longitudeBands,
					sinPhi = Math.sin(phi),
					cosPhi = Math.cos(phi),
					x = cosPhi * sinTheta,
					y = cosTheta,
					z = sinPhi * sinTheta,
					u = 1 - (longNumber / longitudeBands),
					v = 1 - (latNumber / latitudeBands);

				normalData.push(x);
				normalData.push(y);
				normalData.push(z);
				textureCoordData.push(u);
				textureCoordData.push(v);
				vertexPositionData.push(radius * x);
				vertexPositionData.push(radius * y);
				vertexPositionData.push(radius * z);
			}
		}

		for (latNumber=0; latNumber < latitudeBands; latNumber++) {
			for (longNumber=0; longNumber < longitudeBands; longNumber++) {
				var first = (latNumber * (longitudeBands + 1)) + longNumber,
					second = first + longitudeBands + 1;
				indexData.push(first);
				indexData.push(second);
				indexData.push(first + 1);

				indexData.push(second);
				indexData.push(second + 1);
				indexData.push(first + 1);
			}
		}

		this.vnb.sphere = this.wgl.createBuffer();
		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vnb.sphere);
		this.wgl.bufferData(this.wgl.ARRAY_BUFFER, new Float32Array(normalData), this.wgl.STATIC_DRAW);
		this.vnb.sphere.itemSize = 3;
		this.vnb.sphere.numItems = normalData.length / 3;

		this.vtb.sphere = this.wgl.createBuffer();
		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vtb.sphere);
		this.wgl.bufferData(this.wgl.ARRAY_BUFFER, new Float32Array(textureCoordData), this.wgl.STATIC_DRAW);
		this.vtb.sphere.itemSize = 2;
		this.vtb.sphere.numItems = textureCoordData.length / 2;

		this.vpb.sphere = this.wgl.createBuffer();
		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vpb.sphere);
		this.wgl.bufferData(this.wgl.ARRAY_BUFFER, new Float32Array(vertexPositionData), this.wgl.STATIC_DRAW);
		this.vpb.sphere.itemSize = 3;
		this.vpb.sphere.numItems = vertexPositionData.length / 3;

		this.vib.sphere = this.wgl.createBuffer();
		this.wgl.bindBuffer(this.wgl.ELEMENT_ARRAY_BUFFER, this.vib.sphere);
		this.wgl.bufferData(this.wgl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indexData), this.wgl.STATIC_DRAW);
		this.vib.sphere.itemSize = 1;
		this.vib.sphere.numItems = indexData.length;
	},
	initTexture() {
		var maps = this.texture.maps;
		name = maps.pop();
		this.texture[name] = this.wgl.createTexture();
		this.texture[name].image = new Image();
		this.texture[name].image.onload = () => {
			var texture_img = this.texture[name];
			this.wgl.pixelStorei(this.wgl.UNPACK_FLIP_Y_WEBGL, true);
			this.wgl.bindTexture(this.wgl.TEXTURE_2D, texture_img);
			this.wgl.texImage2D(this.wgl.TEXTURE_2D, 0, this.wgl.RGBA, this.wgl.RGBA, this.wgl.UNSIGNED_BYTE, texture_img.image);
			this.wgl.texParameteri(this.wgl.TEXTURE_2D, this.wgl.TEXTURE_MAG_FILTER, this.wgl.LINEAR);
			this.wgl.texParameteri(this.wgl.TEXTURE_2D, this.wgl.TEXTURE_MIN_FILTER, this.wgl.LINEAR_MIPMAP_NEAREST);
			this.wgl.generateMipmap(this.wgl.TEXTURE_2D);
			this.wgl.bindTexture(this.wgl.TEXTURE_2D, null);
			if (maps.length) this.initTexture();
			else delete this.texture.maps;
		}
		this.texture[name].image.src = `~/img/${name}.jpg`;
	},
	compileShader(name) {
		let method = name === "frag" ? "FRAGMENT_SHADER" : "VERTEX_SHADER",
			shader = this.wgl.createShader(this.wgl[method]);
		this.wgl.shaderSource(shader, this.shader[name]);
		this.wgl.compileShader(shader);
		return shader;
	},
	render: function(planet) {
		var pih = Math.PI / 180,
			mat3 = this.utils.mat3,
			mat4 = this.utils.mat4,
			normalMatrix = mat3.create(),
			texture = Object.keys(this.texture)[planet.texture];
		
		// textures are not ready
		if (this.texture.maps) return;

		this.wgl.viewport(0, 0, this.wgl.viewportWidth, this.wgl.viewportHeight);
		this.wgl.clear(this.wgl.COLOR_BUFFER_BIT | this.wgl.DEPTH_BUFFER_BIT);
		mat4.perspective(45, this.wgl.ratio, 0.1, 100.0, this.matrix.projection);

		this.wgl.uniform1i(this.shader.program.useColorMapUniform, true);
		this.wgl.uniform1i(this.shader.program.useLightingUniform, true);
		// ambient color
		this.wgl.uniform3f(this.shader.program.ambientColorUniform, 0.2, 0.15, 0.15);
		// light position
		this.wgl.uniform3f(this.shader.program.pointLightingLocationUniform, -11.0, 4.0, -13.0);
		// diffuse color
		this.wgl.uniform3f(this.shader.program.pointLightingDiffuseColorUniform, 0.9, 0.9, 0.9);

		mat4.identity(this.matrix.modelview);
		mat4.translate(this.matrix.modelview, [0, 0, -35]);
		mat4.rotate(this.matrix.modelview, planet.tilt * pih, [1, 0, -1]);
		mat4.rotate(this.matrix.modelview, planet.rotation * pih, [0, 1, 0]);

		this.wgl.activeTexture(this.wgl.TEXTURE0);
		this.wgl.bindTexture(this.wgl.TEXTURE_2D, this.texture[texture]);
		this.wgl.uniform1i(this.shader.program.colorMapSamplerUniform, 0);

		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vpb.sphere);
		this.wgl.vertexAttribPointer(this.shader.program.vertexPositionAttribute, this.vpb.sphere.itemSize, this.wgl.FLOAT, false, 0, 0);
		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vtb.sphere);
		this.wgl.vertexAttribPointer(this.shader.program.textureCoordAttribute, this.vtb.sphere.itemSize, this.wgl.FLOAT, false, 0, 0);
		this.wgl.bindBuffer(this.wgl.ARRAY_BUFFER, this.vnb.sphere);
		this.wgl.vertexAttribPointer(this.shader.program.vertexNormalAttribute, this.vnb.sphere.itemSize, this.wgl.FLOAT, false, 0, 0);

		// set uniform matrix
		this.wgl.uniformMatrix4fv(this.shader.program.pMatrixUniform, false, this.matrix.projection);
		this.wgl.uniformMatrix4fv(this.shader.program.mvMatrixUniform, false, this.matrix.modelview);
		mat4.toInverseMat3(this.matrix.modelview, normalMatrix);
		mat3.transpose(normalMatrix);
		this.wgl.uniformMatrix3fv(this.shader.program.nMatrixUniform, false, normalMatrix);

		this.wgl.bindBuffer(this.wgl.ELEMENT_ARRAY_BUFFER, this.vib.sphere);
		this.wgl.drawElements(this.wgl.TRIANGLES, this.vib.sphere.numItems, this.wgl.UNSIGNED_SHORT, 0);
	}
};
