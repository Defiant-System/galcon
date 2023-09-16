
precision mediump float;

varying vec2 vTextureCoord;
varying vec3 vTransformedNormal;
varying vec4 vPosition;
uniform vec3 uAmbientColor;
uniform vec3 uPointLightingLocation;
uniform vec3 uPointLightingSpecularColor;
uniform vec3 uPointLightingDiffuseColor;
uniform sampler2D uColorMapSampler;

void main(void) {
	vec3 lightWeighting;
	vec3 lightDirection = normalize(uPointLightingLocation - vPosition.xyz);
	vec3 normal = normalize(vTransformedNormal);

	float diffuseLightWeighting = max(dot(normal, lightDirection), 0.0);
	lightWeighting = uAmbientColor
		+ uPointLightingSpecularColor 
		+ uPointLightingDiffuseColor * diffuseLightWeighting;

	vec4 fragmentColor;
	fragmentColor = texture2D(uColorMapSampler, vec2(vTextureCoord.s, vTextureCoord.t));
	gl_FragColor = vec4(fragmentColor.rgb * lightWeighting, fragmentColor.a);
}
