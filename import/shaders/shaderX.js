/**
 * 🌌 SHADER SHADERX - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderXFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// Color tip from @Shane, ty!

// apollonian
float fractal(vec3 p) {
    // weight
    float w = 4.;
    
    // 6 - 8 iterations is usually the sweet spot
    for (float l, i; i++ < 6.; p *= l, w *= l )
        // sin(p), abs(sin(p))-1., also work,
        // but need to adjust weight(w) and scale(l=2.)
        p  = cos(p-.5),
        // low scale for this fractal type, so we just get snowflake-like shape
        // adjust 2. for scaling
        l = 2./dot(p,p);
    return length(p)/w; 
}

void mainImage(out vec4 o, vec2 u) {
    float i, // iterator
          d, // total distance
          s, // signed distance
          n, // noise iterator
          t = (time * timeMultiplier);
    // p is temporarily resolution,
    // then raymarch position
    vec3 p = resolution;
    
    // scale coords
    u = (u-p.xy/2.)/p.y;
    
    // clear o, up to 100, accumulate distance, grayscale color
    for(o*=i; i++<1e2;d += s = .002+abs(min(fractal(p), s))*.5, o += 1./s)
        // march, equivalent to p = ro + rd * d, p.z += d+t+t
        for (p = vec3(u * d, d+t+t),
             // spin by t, twist by p.z, equivalent to p.xy *= rot(.05*t+p.z*.2)
             p.xy *= mat2(cos(.05*t+p.z*.2+vec4(0,33,11,0))),
             // dist to our spiral'ish thing that will be distorted by noise
             s = sin(4.+p.y+p.x),
             // start noise at 5., until 16, grow by n+=n
             n = 5.; n < 16.; n += n )
                 // subtract noise from s
                 s -= abs(dot(cos(p*n), vec3(1))) / n;
    // divide down brightness and make a light in the center
    o = o/2e5/length(u);
    
    // @Shane depth based color tip :)
    // Colorize
    o = pow(o.xxxx, vec4(1, 2, 12, 0))*6.;
    // Depth based color and tanh tone mapping
    o = tanh(mix(o, o.yzxw, length(u))); 
}`;

// 🚀 Registra o shader
registrarShader('shaderX-shader', null, shaderXFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderX-shader', NUMERO_DO_MUNDO);
