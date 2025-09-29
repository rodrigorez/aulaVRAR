/**
 * 🌌 SHADER SHADERQ - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderQFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

#define R(a) mat2(cos(a+vec4(0,33,11,0)))
void mainImage(out vec4 o, vec2 u) {
    float i,s,
          d,l,
          t=(time * timeMultiplier)*.2,
          f = ((tanh(cos(t)*23.)*.3)*16.);
    vec3  p = resolution;
    
    u =(u+u-p.xy)/p.y;
    
    o = vec4(0);
    l = .3*length(u - vec2(-8, -3.));
    for (i = 0.; i < 100.; ++i) {
        
        // raymarch, calculate position
        p = vec3(u * d, d);
      
        // warp p with turbulence
        p += cos(t+p.yzx*6.)*.3;
        
        // rots
        p.xy *= R(.3*t+.6*p.z)+sin(p.y)*.2;
        p.xz *= R(.1*t+.08*p.z)+sin(p.y)*.2;
        
        // accumulate distance
        d += s = max(cos(p.z), dot(abs(p-floor(p)-.5), vec3(.1)));
        
        // accumulate brightness and color
        o += 1./s*length(p.xy) + 5e1*vec4(f*d*s,f*s,1,0)/l;
    }
    
    // tonemap, flip light
    o = tanh(o*o/1e9/max(f > 1. ? f * length(u) : 1.,.001));
}`;

// 🚀 Registra o shader
registrarShader('shaderQ-shader', null, shaderQFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderQ-shader', NUMERO_DO_MUNDO);
