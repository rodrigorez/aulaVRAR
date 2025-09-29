/**
 * 🌌 SHADER MUNDO 1 - Orb Light (Versão Final Calibrada)
 * Baseado em shader do Shadertoy com controles HSL variáveis
 * Parâmetros calibrados conforme interface de teste
 */

// 🎨 Código do fragmentShader (VERSÃO FINAL COM PARÂMETROS CALIBRADOS)
const mundo1FragmentShader = `
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

// Multiplicadores de velocidade calibrados EXATOS
#define T (time * 0.01)     // Velocidade Geral: 1.0 * Ultra-Fino: 0.01
#define HSL_T (time * 0.00188)  // Velocidade HSL: 0.00188

// Função para converter HSL para RGB
vec3 hsl2rgb(float h, float s, float l) {
    h = mod(h, 360.0) / 360.0;
    float c = (1.0 - abs(2.0 * l - 1.0)) * s;
    float x = c * (1.0 - abs(mod(h * 6.0, 2.0) - 1.0));
    float m = l - c / 2.0;
    
    vec3 rgb;
    if (h < 1.0/6.0) {
        rgb = vec3(c, x, 0.0);
    } else if (h < 2.0/6.0) {
        rgb = vec3(x, c, 0.0);
    } else if (h < 3.0/6.0) {
        rgb = vec3(0.0, c, x);
    } else if (h < 4.0/6.0) {
        rgb = vec3(0.0, x, c);
    } else if (h < 5.0/6.0) {
        rgb = vec3(x, 0.0, c);
    } else {
        rgb = vec3(c, 0.0, x);
    }
    
    return rgb + m;
}

// Implementa tanh para WebGL
float tanh_impl(float x) {
    float ex = exp(x);
    float emx = exp(-x);
    return (ex - emx) / (ex + emx);
}

vec4 tanh_impl(vec4 x) {
    return vec4(tanh_impl(x.x), tanh_impl(x.y), tanh_impl(x.z), tanh_impl(x.w));
}

float orb(vec3 p) {
    float t = T * 0.00001;  // Velocidade do Orb: 0.00001
    return length(p - vec3(
            sin(sin(t*0.2)+t*0.4) * 6.0,
            1.0+sin(sin(t*0.5)+t*0.2) * 4.0,
            12.0+T+cos(t*0.3)*8.0));
}

void main() {
    // Coordenadas de tela
    vec2 u = gl_FragCoord.xy;
    float d = 0.0;
    float a = 0.0;
    float e = 0.0;
    float i = 0.0;
    float s = 0.0;
    float t = T;
    vec3 p = vec3(resolution, 1.0);
    vec4 o = vec4(0.0);
    
    // scale coords
    u = (u + u - p.xy) / p.y;
    
    // camera movement - intensidade calibrada: 0.30000
    u += vec2(cos(t*0.1)*0.30000, cos(t*0.3)*0.30000*0.3);
    
    // Ray marching loop
    for(int iter = 0; iter < 64; iter++) {
        i = float(iter);
        
        // march point
        p = vec3(u * d, d + t);
        
        // entity (orb)
        e = orb(p) - 0.1;
        
        // spin by t, twist by p.z
        float angle = 0.1*t + p.z/8.0;
        mat2 rotation = mat2(cos(angle), sin(angle), -sin(angle), cos(angle));
        p.xy *= rotation;
        
        // mirrored planes 4 units apart
        s = 4.0 - abs(p.y);
        
        // noise loop
        for(float noise_scale = 0.8; noise_scale < 32.0; noise_scale *= 2.0) {
            // apply turbulence
            p += cos(0.7*t + p.yzx) * 0.2;
            
            // apply noise
            s -= abs(dot(sin(0.1*t + p * noise_scale), vec3(0.6))) / noise_scale;
            
            if(noise_scale > 16.0) break;
        }
        
        // accumulate distance
        d += s = min(0.03 + 0.2*abs(s), e = max(0.5*e, 0.01));
        
        // grayscale color and orb light
        o += vec4(1.0) / (s + e*3.0);
        
        // exit conditions
        if(d > 50.0 || e < 0.01) break;
    }
    
    // tanh tonemap, brightness
    o = tanh_impl(o / 10.0);
    
    // HSL SEMPRE VARIÁVEIS - Parâmetros EXATOS da interface
    float hueAmplitude = 150.0;     // Amplitude Hue: 150.00000°
    float satAmplitude = 0.0;       // Amplitude Saturation: 0.00000
    float lightAmplitude = 0.0;     // Amplitude Lightness: 0.00000
    
    float animatedHue = 180.0 + sin(HSL_T * 0.7) * hueAmplitude + cos(HSL_T * 1.3) * hueAmplitude * 0.5;
    
    // Valores base fixos para Saturation e Lightness
    float intensity = length(o.rgb);
    float baseSat = 0.7;   // Saturação fixa
    float baseLight = 0.5; // Luminosidade fixa
    
    float finalSat = clamp(baseSat * (0.3 + 0.7 * intensity), 0.0, 1.0);
    float finalLight = clamp(baseLight * (0.2 + 0.8 * intensity), 0.0, 1.0);
    
    // Converte HSL para RGB
    vec3 colorRGB = hsl2rgb(animatedHue, finalSat, finalLight);
    
    // Aplica cor ao resultado final
    vec3 finalColor = o.rgb * colorRGB * 2.0;
    
    gl_FragColor = vec4(finalColor, 1.0);
}
`;

// 🚀 Registra e aplica o shader (Com LOG de controle)
console.log('🎆 Registrando shader mundo1-orb-light...');
registrarShader('mundo1-orb-light', null, mundo1FragmentShader);
console.log('✅ Shader mundo1-orb-light registrado!');

// Aplica ao sky com pequeno delay para garantir registro
setTimeout(() => {
  console.log('🎨 Iniciando aplicação do shader ao sky...');
  aplicarShaderAoSky('mundo1-orb-light', 1);
}, 100);