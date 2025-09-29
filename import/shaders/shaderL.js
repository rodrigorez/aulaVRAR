/**
 * 🌌 SHADER SHADERL - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderLFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;



void mainImage(out vec4 o, vec2 u) {
    
    vec3 p = resolution;
    
    float i, s,
          // start the ray at a small random distance,
          // this will reduce banding
          d = .125*texelFetch(iChannel0, ivec2(u)%1024, 0).a,
          t = (time * timeMultiplier)*.7;
          
    // scale coords
    u =(u+u-p.xy)/p.y;
    
    for(o*=i; i++<1e2; ) {
        
        // shorthand for standard raymarch sample, then move forward:
        // p = ro + rd * d, p.z += t;
        p = vec3(u * d, d + t);
       
        // warp p with xor-style turbulence
        // 's' is basically how often to swizzle-perturb,
        // '.25' is basically how big to swizzle-perturb
        // play with this part: p += sin(t+p.yzx*s)*.25
        // and number of iterations
        for (s = 1.; s++ <6.;p += sin(t+p.yzx*s)*.25);
            
        // 1. - length(p.x) is the complement of the distance to a cylinder,
        // aka, a tunnel (inside the cylinder). remove the above turbulence warping to see it.
        
        // .005 + abs(tunnel) * .15 makes it translucent and understeps a lot (*.15)
        // to give it a blurry/smooth effect, play with .005 and *.15
        // this whole blurb is the radius of the tunnel: tanh(cos(.1*t+sin(t*.5)))*.6+.3
        // you can replace the whole thing with a constant number to simplify things
        d += s = .005 + abs(tanh(cos(.3*t+sin(t*.5)))*.6+.3-length(p.xy-u))*.15;
        
        // color: 1.+cos so we don't go negative, cos(d+vec4(1,2,3,4)) samples from the palette
        // divide by s for form and distance
        o += (1.+cos(p.z+vec4(4,2,1,0))) / s;
        
    }
    
    // tonemap and divide brightness
    o = tanh(o / 8e3 / max(length(u), .5));
}`;

// 🚀 Registra o shader
registrarShader('shaderL-shader', null, shaderLFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderL-shader', NUMERO_DO_MUNDO);
