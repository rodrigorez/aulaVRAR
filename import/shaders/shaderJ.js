/**
 * 🌌 SHADER SHADERJ - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderJFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
    float vege = buf(gl_FragCoord.xy).x;
    float prey = buf(gl_FragCoord.xy).y * 2.;
    float pred = buf(gl_FragCoord.xy).z;

    gl_FragColor = vec4(0,0,0,1);
    gl_FragColor = mix(gl_FragColor, vec4(0., 1., 0.1, 1), smoothstep(0., 10., vege - prey - pred));
    gl_FragColor = mix(gl_FragColor, vec4(0., 0.5, 1., 1), smoothstep(0., 10., prey - pred));
    gl_FragColor = mix(gl_FragColor, vec4(0.5, 0., 0., 1), smoothstep(0., 10., pred));

    float plant_growth = 0.75 - 0.25 * cos(2.*PI * (time * timeMultiplier) / 60.);
    if ((time * timeMultiplier) < 30.) plant_growth = 1.;

    vec2 uv = gl_FragCoord.xy / resolution.xy;
    if (uv.y < 0.02) gl_FragColor = vec4(0,0,0,1);
    if (uv.y < 0.01 && uv.x < plant_growth) gl_FragColor = vec4(0., 1., 0.1, 1);

    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1./2.2));
}`;

// 🚀 Registra o shader
registrarShader('shaderJ-shader', null, shaderJFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderJ-shader', NUMERO_DO_MUNDO);
