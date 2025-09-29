/**
 * 🌌 SHADER SHADERR - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderRFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// ------------------------------------------------------------
// Value noise (based on IQ's shader: https://www.shadertoy.com/view/4sfGzS)
// ------------------------------------------------------------

// Simple integer hash function (not high quality, replace for production)
float hash(ivec3 p) {
    // 3D → 1D
    int n = p.x * 3 + p.y * 113 + p.z * 311;

    // 1D hash (Hugo Elias style)
    n = (n << 13) ^ n;
    n = n * (n * n * 15731 + 789221) + 1376312589;

    return float(n & 0x0fffffff) / float(0x0fffffff);
}

// Smoothed value noise
float noise(vec3 x) {
    ivec3 i = ivec3(floor(x));
    vec3 f = fract(x);
    f = f * f * (3.0 - 2.0 * f); // smoothstep

    return mix(
        mix(
            mix(hash(i + ivec3(0, 0, 0)),
                hash(i + ivec3(1, 0, 0)), f.x),
            mix(hash(i + ivec3(0, 1, 0)),
                hash(i + ivec3(1, 1, 0)), f.x), f.y),
        mix(
            mix(hash(i + ivec3(0, 0, 1)),
                hash(i + ivec3(1, 0, 1)), f.x),
            mix(hash(i + ivec3(0, 1, 1)),
                hash(i + ivec3(1, 1, 1)), f.x), f.y),
        f.z
    );
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
        s = 0.001 + abs(s) * 0.12;
        d += s;

        // Base sinusoidal accumulation
        col += sin(p.y * 0.5 + p.z + vec4(1.0, 0.5, 0.4, 1.0)) / (s * s + 1e-9);

        // Current ray position
        p = vec3(uv * d * 2.0, d + (time * timeMultiplier) * 5.0);

        // Turbulence base
        vec3 b = p;
        b += sin(b + (time * timeMultiplier) * 0.9).yzx; // single octave turbulence

        // Apply turbulence influence
        p.xy += sin(b.xy * 0.91 + p.z);

        // Sample density (difference of noises)
        float density = noise(p + (time * timeMultiplier)) - noise(p);

        // Tunnel shaping (clear space near camera)
        float clear = length(p.xy) - 3.0 - 7.0 * smoothstep(-1.0, 1.0, sin((time * timeMultiplier) * 0.25));
        s = max(s, -clear);
        s += abs(density);
    }

    // --------------------------------------------------------
    // Tone mapping: tanh + gamma
    // --------------------------------------------------------
    gl_FragColor = pow(tanh(col * col * col * col / 4e28), vec4(0.4545));
}`;

// 🚀 Registra o shader
registrarShader('shaderR-shader', null, shaderRFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderR-shader', NUMERO_DO_MUNDO);
