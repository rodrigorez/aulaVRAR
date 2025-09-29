/**
 * 🌌 SHADER SHADERP - Mundo 7 - Velocidade Fixa: 0.00052
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderPFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Velocidade fixa para mundo 7
#define TIME_SPEED 0.00052

// Tonemapping (ACES Filmic Approximation)
// Reference: Academy Color Encoding System (ACES) 
// http://www.oscars.org/science-technology/sci-tech-projects/aces
// ShaderToy reference implementation: https://www.shadertoy.com/view/Xc3yzM
vec3 aces(vec3 color) {	
    const mat3 M1 = mat3(
        0.59719, 0.07600, 0.02840,
        0.35458, 0.90834, 0.13383,
        0.04823, 0.01566, 0.83777
    );
    const mat3 M2 = mat3(
        1.60475, -0.10208, -0.00327,
       -0.53108,  1.10813, -0.07276,
       -0.07367, -0.00605,  1.07602
    );
    vec3 v = M1 * color;    
    vec3 a = v * (v + 0.0245786) - 0.000090537;
    vec3 b = v * (0.983729 * v + 0.4329510) + 0.238081;   
    return M2 * (a / b); 
}

// Dot Noise (XorDev, cheap irrational-domain field)
// Reference: https://mini.gmshaders.com/p/phi
float dot_noise(vec3 p) {
    const float PHI = 1.618033988; // golden ratio
    const mat3 GOLD = mat3(
        -0.571464913, +0.814921382, +0.096597072,
        -0.278044873, -0.303026659, +0.911518454,
        +0.772087367, +0.494042493, +0.399753815
    );
    // Gyroid-like irrational rotations and scales
    return dot(cos(GOLD * p), sin(PHI * p * GOLD)); // [-3, +3]
}

mat2 rot(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s,
                s,  c);
}

void main() {
    float t = -(time * TIME_SPEED)-500.;

    // Normalized device coords
    vec2 uv = (gl_FragCoord.xy / resolution.xy) * 2.0 - 1.0;
    uv.x *= resolution.x / resolution.y;

    // Ray direction & camera pos
    vec3 d = normalize(vec3(2.0 * gl_FragCoord.xy, 0.0) - resolution.xyy);
    vec3 p = vec3(0, 0, t);

    vec3 l = vec3(0.0); // accumulated radiance

    // Raymarch loop
    for (float i = 0.0; i < 150.0; i++) {
    
        vec3 rp = p;
        //rp.z += (time * timeMultiplier);
        //rp.y = sin(t);
        p.xy*=rot(p.z*.0001);
        // Step distance (positive safe stepping)
        float s = abs(dot_noise(rp) + (p.y)) * 0.1+ 0.015;
        
        // Clear space around camera
        //float clear = length(rp - vec3(0, 0, t)) - 3.0;
        //s = max(s, -clear);

        // Step forward
        p += d * s;

        // Accumulate radiance: field glow + moving orb
        l += (sin(p.z * 0.5 - vec3(0.5, 0.8, 0.9)) / 
             (abs(s * 0.001) + 1e-6)) 
             + 0.3 * vec3(7, 4, 1) / 
             (length(uv + vec2(-1.0 + 2.0 * smoothstep(-1.0, 1.0, sin(t * 0.50)),
                               -0.4 + sin(t * 0.25) * 0.3)) 
              * (1e-3 * abs(sin(t * 0.4) * 0.5 + 2.)));
    }

    // Tonemap + gamma correction
    // l*l = stylistic contrast boost
    // scaled HDR before ACES → gamma 2.2
    gl_FragColor = vec4(pow(aces(l * l /3e12), vec3(1.0 / 2.2)), 1.0);
}`;

// 🚀 Registra o shader
registrarShader('shaderP-shader', null, shaderPFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderP-shader', NUMERO_DO_MUNDO);
