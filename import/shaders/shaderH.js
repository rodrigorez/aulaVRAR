/**
 * 🌌 SHADER SHADERH - Mundo 6 - Velocidade Fixa: 0.00140
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderHFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Velocidade fixa para mundo 6
#define TIME_SPEED 0.00140

#define PI 3.141592653589793

void main() {
    vec4 o;
    vec2 p = gl_FragCoord.xy;
    vec4 c = texture(iChannel0, p.xy / resolution.xy);
    o.rgb = .6 + .6 * cos(6.3 * atan(c.y,c.x)/(2.*PI) + vec3(0,23,21)); // velocity
	o.rgb *= c.w/5.; // ink
	o.rgb += clamp(c.z - 1., 0., 1.)/10.; // local fluid density
    o.a = 1.;
    gl_FragColor = o;
}`;

// 🚀 Registra o shader
registrarShader('shaderH-shader', null, shaderHFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderH-shader', NUMERO_DO_MUNDO);
