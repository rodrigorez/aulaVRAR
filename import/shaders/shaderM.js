/**
 * 🌌 SHADER SHADERM - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderMFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;



void mainImage(out vec4 o, vec2 u) {
    
    vec3 q,p = resolution;
    
    float i, s,
          // start the ray at a small random distance,
          // this will reduce banding
          d = .125*texelFetch(iChannel0, ivec2(u)%1024, 0).a,
          t = (time * timeMultiplier);
          
    // scale coords
    u =(u+u-p.xy)/p.y;
    
    for(o*=i; i++<1e2; ) {
        
        // shorthand for standard raymarch sample, then move forward:
        // p = ro + rd * d, p.z -= 5.;
        q = p = vec3(u * d, d - 5.);

        // turbulence
        for (s = 1.; s++ <6.;
            q += sin(.6*t+p.zxy*s*.3)*.4,
            p += sin(t+p.yzx*s)*.25);

        // distance to spheres
        d += s = .005 + abs(min(length(p+1.)-2., length(q-1.)-3.))*.2;
        
        // color: 1.+cos so we don't go negative, cos(d+vec4(6,4,2,0)) samples from the palette
        // divide by s for form and distance
        o += (1.+cos(p.z+vec4(6,4,2,0))) / s;
        
    }
    
    // tonemap and divide brightness
    o = tanh(o / 8e3 / max(length(u), .5));
}`;

// 🚀 Registra o shader
registrarShader('shaderM-shader', null, shaderMFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderM-shader', NUMERO_DO_MUNDO);
