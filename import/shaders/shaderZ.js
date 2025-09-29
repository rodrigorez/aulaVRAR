/**
 * 🌌 SHADER SHADERZ - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderZFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// saw @chronos' Starfall shaders and had to tinker with colorful lights :)
// inspo from https://www.shadertoy.com/view/Wc2cRc


#define R(a) mat2(cos(a+vec4(0,33,11,0)))
void mainImage(out vec4 o, vec2 u) {
    float i,s,
          d = .1*texelFetch(iChannel0, ivec2(u)%1024, 0).a,
          t=(time * timeMultiplier);
    vec3  p,resolution = resolution; 
    for (o*=i; i++<1e2; o += (1.+cos(t+2.*p.z+vec4(3,1,0,0)))/s)
            p = vec3((u+u-resolution.xy)/resolution.y * d, d),
            p += cos(t+p.yzx*6.)*.2,
            p.yz *= R(.15*t+.6*p.z)+sin(p.x)*.3,
            p.xz *= R(.05*t+.08*p.z)+sin(p.y)*.2,
            d += s = dot(abs(p-floor(p)-.5), vec3(.1));
    o = tanh(o*o/5e6);
}`;

// 🚀 Registra o shader
registrarShader('shaderZ-shader', null, shaderZFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderZ-shader', NUMERO_DO_MUNDO);
