/**
 * 🌌 SHADER SHADERU - Mundo 8 - Velocidade Fixa: 0.00024
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderUFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Velocidade fixa para mundo 8
#define TIME_SPEED 0.00024

// ------------------------------------------------------------
// Dot Noise (by Xor, https://www.shadertoy.com/view/wfsyRX)
// Produces smooth chaotic noise using golden ratio rotations.
// ------------------------------------------------------------
float dot_noise(vec3 p) {
    const float PHI = 1.618033988; // golden ratio
    const mat3 GOLD = mat3(
        -0.571464913, +0.814921382, +0.096597072,
        -0.278044873, -0.303026659, +0.911518454,
        +0.772087367, +0.494042493, +0.399753815
    );
    return dot(cos(GOLD * p), sin(PHI * p * GOLD));
}

// ------------------------------------------------------------
// Main raymarch entry
// ------------------------------------------------------------
void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * resolution.xy) / resolution.y;
    
    vec4 col = vec4(0.0);
    float d = 0.0; // depth accumulator
    float s = 0.0; // step size
    vec3 p;        // current ray position

    // Volumetric raymarch loop
    for (float i = 0.0; i < 150.0; i++) {
        // Nonlinear stepping (feedback-based)
        s = 0.001 + abs(s) * 0.1;
        d += s;

        // Base sinusoidal accumulation
        col += sin(d + vec4(2.65, 2.15, d * 0.5, 2.9) - 2.9) / (s * s + 1e-9);

        // Compute current ray position
        p = vec3(uv * d * 3.0, d + (time * TIME_SPEED) * 3.0);

        // Sample density via dot noise
        float density = abs(dot_noise(p));
        s += density;

        // Tunnel shaping
        float clear = length(p.xy) -.75;
        s = max(-clear, s); // sharpen tunnel edges
    }

    // --------------------------------------------------------
    // Tone mapping
    // Inspired by tanh + gamma approach (psychedelic shaping)
    // See: Krzysztof Narkowicz - "ACES Filmic Tone Mapping Curve"
    // --------------------------------------------------------
    gl_FragColor = pow(tanh(col * col * col / 4e21), vec4(0.4545));
}`;

// 🚀 Registra o shader
registrarShader('shaderU-shader', null, shaderUFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderU-shader', NUMERO_DO_MUNDO);
