/**
 * 🌌 SHADER SHADERO - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderOFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

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
    for (float i = 0.0; i < 400.0; i++) {
        // Nonlinear stepping (feedback-based)
        s = 0.007 + abs(s) * 0.04;
        d += s;

        // Base sinusoidal accumulation
        col += abs(vec4(2.1,.25,.1,1.)+sin(d*.5 + vec4(1.65, 0.15,  .5+p.z*9.+(time * timeMultiplier), 0.)) +2.*smoothstep(-1.,1.,sin(p.z*1.))) / (s * s + 1e-9);

        // Compute current ray position
        p = vec3(uv * d * 2.0, d + (time * timeMultiplier) * 1.0);
        // Compute rotation angle based on position and time
        float a = abs(cos((time * timeMultiplier) * 0.05) * 2.) +(time * timeMultiplier)*.2;

        // Create 2D rotation matrix
        mat2 rot = mat2(cos(a), sin(a), -sin(a), cos(a));

        // Apply rotation to XY-plane
        p.xy *= rot;
        // Sample density via dot noise
        float density = dot_noise(p+(time * timeMultiplier))*(1.+5.*smoothstep(-1.,1.,sin((time * timeMultiplier)*.25)));
        // Clear space around camera
        float clear = length(p - vec3(0, 0, (time * timeMultiplier))) - 2.0;
        s = max(s, -clear);
        s += abs(density);
    }

    // --------------------------------------------------------
    // Tone mapping
    //  tanh + gamma approach 
    // --------------------------------------------------------
    gl_FragColor = 2.*pow(tanh(col * col * col * col/ 9e27), vec4(0.4545));
}`;

// 🚀 Registra o shader
registrarShader('shaderO-shader', null, shaderOFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderO-shader', NUMERO_DO_MUNDO);
