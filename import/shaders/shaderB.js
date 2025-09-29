/**
 * 🌌 SHADER SHADERB - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderBFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

/*
    "Accretion" by @XorDev
    
    gl_FragCoord.xy discovered an interesting refraction effect
    by adding the raymarch iterator to the turbulence!
    https://x.com/XorDev/status/1936884244128661986
*/

void main()
{
    //Raymarch depth
    float z,
    //Step distance
    d,
    //Raymarch iterator
    i;
    //Clear gl_FragColor and raymarch 20 steps
    for(gl_FragColor*=i; i++<2e1; )
    {
        //Sample point (from ray direction)
        vec3 p = z*normalize(vec3(gl_FragCoord.xy+gl_FragCoord.xy,0)-resolution.xyx)+.1;
        
        //Polar coordinates and additional transformations
        p = vec3(atan(p.y/.2,p.x)*2., p.z/3., length(p.xy)-5.-z*.2);
        
        //Apply turbulence and refraction effect
        for(d=0.; d++<7.;)
            p += sin(p.yzx*d+(time * timeMultiplier)+.3*i)/d;
            
        //Distance to cylinder and waves with refraction
        z += d = length(vec4(.4*cos(p)-.4, p.z));
        
        //Coloring and brightness
        gl_FragColor += (1.+cos(p.x+i*.4+z+vec4(6,1,2,0)))/d;
    }
    //Tanh tonemap
    gl_FragColor = tanh(gl_FragColor*gl_FragColor/4e2);
}`;

// 🚀 Registra o shader
registrarShader('shaderB-shader', null, shaderBFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderB-shader', NUMERO_DO_MUNDO);
