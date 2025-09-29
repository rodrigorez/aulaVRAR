/**
 * 🌌 SHADER SHADERF - Mundo 2 - Velocidade Fixa: 0.00002
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderFFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

#define PI 3.14159265359
#define E 2.7182818284
#define GR 1.61803398875

// Velocidade fixa para mundo 2
#define TIME_SPEED 0.00002
#define time ((time * TIME_SPEED)*0.7+100.0)
#define saw(x) (acos(cos(x))/PI)
#define sphereN(uv) (clamp(1.0-length(uv*2.0-1.0), 0.0, 1.0))
#define clip(x) (smoothstep(0.25, .75, x))

vec2 cmul(vec2 v1, vec2 v2) {
    return vec2(v1.x * v2.x - v1.y * v2.y, v1.y * v2.x + v1.x * v2.y);
}

vec2 cdiv(vec2 v1, vec2 v2) {
    return vec2(v1.x * v2.x + v1.y * v2.y, v1.y * v2.x - v1.x * v2.y) / dot(v2, v2);
}

// Hash for pseudo-random
float hash21(vec2 p) {
    p = fract(p * vec2(234.34, 435.345));
    p += dot(p, p + 34.23);
    return fract(p.x * p.y);
}

// Smooth noise
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f*f*(3.0-2.0*f);
    
    float a = hash21(i);
    float b = hash21(i + vec2(1.0, 0.0));
    float c = hash21(i + vec2(0.0, 1.0));
    float d = hash21(i + vec2(1.0, 1.0));
    
    return mix(mix(a, b, f.x), mix(c, d, f.x), f.y);
}

// Fractal Brownian Motion
float fbm(vec2 p) {
    float value = 0.0;
    float amplitude = 0.5;
    float frequency = 2.0;
    
    for(int i = 0; i < 5; i++) {
        value += amplitude * noise(p * frequency);
        amplitude *= 0.5;
        frequency *= 2.0;
    }
    return value;
}

// New warping function with better variety
vec2 warpUV(vec2 uv, float t) {
    // Create multiple warp layers
    vec2 warp1 = vec2(
        sin(uv.y * 3.0 + t) * 0.1,
        cos(uv.x * 3.0 + t * 1.3) * 0.1
    );
    
    vec2 warp2 = vec2(
        fbm(uv * 2.0 + vec2(t * 0.2, 0.0)) * 0.2,
        fbm(uv * 2.0 + vec2(0.0, t * 0.3)) * 0.2
    );
    
    // Spiral distortion
    float r = length(uv);
    float theta = atan(uv.y, uv.x) + r * 2.0 + t * 0.5;
    vec2 spiral = vec2(cos(theta), sin(theta)) * resolution;
    
    return mix(uv + warp1 + warp2, spiral, 0.3 + 0.2 * sin(t * 0.4));
}

vec2 map(vec2 uv, vec2 multa, vec2 offa, vec2 multb, vec2 offb) {
    return saw(cdiv(cmul(uv, multa) + offa, cmul(uv, multb) + offb)*PI)*2.0-1.0;
}

vec2 iterate(vec2 uv, vec2 dxdy, out float magnification, vec2 multa, vec2 offa, vec2 multb, vec2 offb) {
    vec2 a = uv;
    vec2 b = uv + vec2(dxdy.x, 0.0);
    
    vec2 ma = map(a, multa, offa, multb, offb);
    vec2 mb = map(b, multa, offa, multb, offb);
    
    magnification = length(mb-ma) / dxdy.x;
    return map(uv, multa, offa, multb, offb);
}

// Generate dynamic color palette
vec3 palette(float t, vec3 a, vec3 b, vec3 c, vec3 d) {
    return a + b * cos(6.28318 * (c * t + d));
}

void main() {
    vec2 uv = gl_FragCoord.xy / resolution.xy;
    vec2 originalUV = uv;
    
    // Create multiple rhythm layers
    float beat1 = 0.5 + 0.5*sin(time*2.0);
    float beat2 = 0.5 + 0.5*sin(time*3.7 + 1.0);
    float beat3 = 0.5 + 0.5*sin(time*1.3 + 2.0);
    float masterBeat = pow(beat1 * beat2, 0.5);
    
    // Pulsing scale with variety - centered properly
    float scale = 2.0 + sin(time*0.3)*1.5 + beat1*0.5;
    uv = (uv - 0.5) * scale;
    uv.x *= resolution.x/resolution.y;
    
    // Warp the UV coordinates for movement
    uv = warpUV(uv, time);
    
    float magnification = 1.0;
    vec3 colorAccum = vec3(0.0);
    float weightSum = 0.0;
    
    // Create base glow to prevent complete blackness
    vec3 baseGlow = vec3(0.02, 0.03, 0.04) * (1.0 + beat3);
    
    const int iterations = 5;
    for(int i = 0; i < iterations; i++) {
        float iter = float(i)/float(iterations);
        
        // Varying parameters for each iteration
        vec2 multa = vec2(cos(time*1.1 + iter*PI), sin(time*0.9 + iter*PI*0.7));
        vec2 offa = vec2(cos(time*0.7 + iter*2.0), sin(time*0.6 + iter*1.5)) * 2.0;
        vec2 multb = vec2(cos(time*0.8 + iter*PI*0.8), sin(time*1.2 + iter*PI*1.1));
        vec2 offb = vec2(cos(time*0.5 + iter*1.7), sin(time*0.4 + iter*2.3)) * 1.5;
        
        vec2 transformedUV = iterate(uv, 0.5/resolution.xy, magnification, multa, offa, multb, offb);
        
        // Create patterns
        float pattern1 = sphereN(transformedUV);
        float pattern2 = sin(length(transformedUV)*10.0 - time*2.0)*0.5 + 0.5;
        float pattern3 = fbm(transformedUV*3.0 + vec2(time*0.2));
        
        float combinedPattern = mix(pattern1, pattern2, beat2) + pattern3*0.3;
        combinedPattern *= 1.0/(1.0 + magnification*0.5); // Anti-speckle
        
        // Dynamic color generation
        vec3 color1 = palette(
            combinedPattern + iter*0.3 + time*0.1,
            vec3(0.5, 0.5, 0.5),
            vec3(0.5, 0.5, 0.5),
            vec3(1.0, 1.0, 1.0),
            vec3(0.0 + beat1*0.3, 0.33 + beat2*0.2, 0.67 + beat3*0.1)
        );
        
        // Glow effect
        float glow = exp(-magnification*2.0) * (0.5 + 0.5*sin(time + iter*PI));
        color1 += vec3(glow * beat1, glow * beat2, glow * beat3) * 0.3;
        
        // Energy waves
        float wave = sin(length(transformedUV)*20.0 - time*4.0 + iter*2.0)*0.5 + 0.5;
        wave = pow(wave, 3.0);
        color1 += vec3(wave*0.2, wave*0.1, wave*0.3) * masterBeat;
        
        float weight = 1.0/(1.0 + float(i));
        colorAccum += color1 * weight;
        weightSum += weight;
        
        uv = transformedUV * 0.95; // Slight zoom for next iteration
    }
    
    colorAccum /= weightSum;
    
    // Add organic movement overlay
    vec2 flowUV = originalUV*4.0;
    float flow = fbm(flowUV + vec2(time*0.3, time*0.2));
    vec3 flowColor = vec3(
        0.1 + 0.1*sin(flow*10.0 + time),
        0.05 + 0.05*cos(flow*12.0 + time*1.3),
        0.15 + 0.1*sin(flow*8.0 + time*0.7)
    );
    
    // Radial pulse from center
    float radialPulse = 1.0 - length(originalUV - 0.5)*2.0;
    radialPulse = pow(max(0.0, radialPulse), 2.0);
    radialPulse *= 0.5 + 0.5*sin(time*3.0 + length(originalUV - 0.5)*10.0);
    
    // Combine everything with guaranteed minimum brightness
    vec3 finalColor = baseGlow + colorAccum * (0.7 + 0.3*masterBeat);
    finalColor += flowColor * (0.3 + 0.2*beat3);
    finalColor += vec3(radialPulse * 0.1, radialPulse * 0.05, radialPulse * 0.15);
    
    // Edge glow to frame the visuals
    float edgeFade = 1.0 - pow(length(originalUV - 0.5)*1.4, 2.0);
    finalColor *= 0.3 + 0.7*edgeFade;
    
    // Final color enhancement
    finalColor = pow(finalColor, vec3(0.9)); // Slight brightness boost
    finalColor = mix(finalColor, smoothstep(vec3(0.0), vec3(1.0), finalColor), 0.3); // Contrast
    
    gl_FragColor = vec4(clamp(finalColor, 0.0, 1.0), 1.0);
}`;

// 🚀 Registra o shader
registrarShader('shaderF-shader', null, shaderFFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderF-shader', NUMERO_DO_MUNDO);
