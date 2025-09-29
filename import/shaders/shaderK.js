/**
 * 🌌 SHADER SHADERK - Mundo 9 - Velocidade Fixa: 0.00090
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderKFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Velocidade fixa para mundo 9
#define TIME_SPEED 0.00090

#define PI 3.14159265359

vec3 f(vec2 uv, float t) {
    float d = min(abs(abs(uv.x) - 1.), abs(abs(uv.y) - 1.));
    float a = atan(uv.y, uv.x) + PI; // [0, 2pi]
    vec3 col = 0.5 + 0.5 * cos(a + t*vec3(0, 4, 2));
    // return col * vec3(exp(-d*d/0.05));
    return col / (20.*d + 1.);
}

mat2 rot(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}


void main()
{
    // Normalized pixel coordinates (from 0 to 1)
    vec2 uv = gl_FragCoord.xy/resolution.xy;
    uv = (2. * uv - 1.) * vec2(resolution.x / resolution.y, 1);
    
    vec3 col;
    
    float sgn = 1.0;
    for (int i = 0; i < 6; ++i) {
        col += f(uv, sin(float(i))*(time * TIME_SPEED) + 2.0 * float(i));
        uv += vec2(0.2 + cos((time * TIME_SPEED) + 3.0*float(i*i)), 0);
        uv *= rot(float(i) + 0.2 * (sgn*(time * TIME_SPEED) + 0.4*sin((time * TIME_SPEED))));
        sgn *= -1.;
    }

    // Output to screen
    gl_FragColor = vec4(col,1.0);
}`;

// 🚀 Registra o shader
registrarShader('shaderK-shader', null, shaderKFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderK-shader', NUMERO_DO_MUNDO);
