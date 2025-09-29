/**
 * 🌌 SHADER SHADERG - Mundo 5 - Velocidade Fixa: 0.00083
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderGFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Velocidade fixa para mundo 5
#define TIME_SPEED 0.00083

void main(){
    vec2 uv =  (2.0 * gl_FragCoord.xy - resolution.xy) / min(resolution.x, resolution.y);

    for(float i = 1.0; i < 10.0; i++){
        uv.x += 0.6 / i * cos(i * 2.5* uv.y + (time * TIME_SPEED));
        uv.y += 0.6 / i * cos(i * 1.5 * uv.x + (time * TIME_SPEED));
    }
    
    gl_FragColor = vec4(vec3(0.1)/abs(sin((time * TIME_SPEED)-uv.y-uv.x)),1.0);
}`;

// 🚀 Registra o shader
registrarShader('shaderG-shader', null, shaderGFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderG-shader', NUMERO_DO_MUNDO);
