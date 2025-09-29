/**
 * 🌌 SHADER SHADER1B - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1BFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

/*
    "Protostar 2" by @XorDev

    Practicing with whirling motion
    
    <512 playlist:
    https://www.shadertoy.com/playlist/N3SyzR
*/

void main()
{
    //Animation time
    float t = (time * timeMultiplier),
    //Raymarch depth
    z,
    //Step distance
    d,
    //Signed distance
    s,
    //Raymarch iterator
    i;
    
    
    //Clear gl_FragColor and raymarch 100 steps
    for(gl_FragColor*=i; i++<2e2;
        //Coloring and brightness
        gl_FragColor+=(cos(s/.6+vec4(0,1,2,0))+1.1)/d)
    {
        //Sample point (from ray direction)
        vec3 p = z*normalize(vec3(gl_FragCoord.xy+gl_FragCoord.xy,0)-resolution.xyy),
        //Rotation axis
        a = normalize(cos(vec3(0,1,0)+t-.4*s));
        //Move camera back 9 units
        p.z+=9.,
        //Rotated coordinates
        a = a*dot(a,p)-cross(a,p);
        
        //Turbulence loop
        for(d=1.;d++<6.;)
            s=length(a+=cos(a*d+t).yzx/d);
        
        //Distance to rings
        z+=d=.1*(abs(sin(s-t))+abs(a.y)/d);
    }
    //Tanh tonemap
    gl_FragColor = tanh(gl_FragColor*gl_FragColor/2e7);
}`;

// 🚀 Registra o shader
registrarShader('shader1B-shader', null, shader1BFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1B-shader', NUMERO_DO_MUNDO);
