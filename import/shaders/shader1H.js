/**
 * 🌌 SHADER SHADER1H - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1HFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

    /*
    "Bits" by @XorDev
    
    Tweet:
    https://x.com/XorDev/status/1925548343054496239
*/
void main()
{
    //Raymarch iterator, step distance and z-depth
    float i, d, z;
    //Clear gl_FragColor and raymarch 100 steps
    for(gl_FragColor *= i; i++<1e2;
        //Pick color and glow
        gl_FragColor += (cos(z+vec4(6,1,2,3))+1.)/d)
    {
        //Raymarch sample point
        vec3 p = z * normalize(vec3(gl_FragCoord.xy+gl_FragCoord.xy,0)-resolution.xyy);
        //Scroll forward
        p.z -= (time * timeMultiplier);
        //Turbulence
        //https://mini.gmshaders.com/p/turbulence
        //Rounded for blocky effect
        for(d = .4; d < 3e1; d += d)
            p += cos(round(p*d)-z*.1).yzx/d;
        //Distance to depth columns
        z += d = length(sin(p.xy))*.1;
    }
    //Tanh tonemapping
    //https://www.shadertoy.com/view/ms3BD7
    gl_FragColor = tanh(gl_FragColor/5e3);
}`;

// 🚀 Registra o shader
registrarShader('shader1H-shader', null, shader1HFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1H-shader', NUMERO_DO_MUNDO);
