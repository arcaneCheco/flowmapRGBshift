uniform sampler2D uImage;
uniform sampler2D uFlowmap;
varying vec2 vUv;

vec4 getRGB(sampler2D image, vec2 uv, float angle, float amount) {
    vec2 offset = vec2(cos(angle), sin(angle)) * amount;
    vec4 r = texture2D(image, uv + offset);
    vec4 g = texture2D(image, uv);
    vec4 b = texture2D(image, uv - offset);
    return vec4(r.r, g.g, b.b, g.a);
}

void main() {
	// vec3 img = texture2D(uImage, vUv).rgb;

	vec3 flow = texture2D(uFlowmap, vUv).rgb;

	gl_FragColor = vec4(flow, 1.);
}