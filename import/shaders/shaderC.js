/**
 * 🌌 SHADER SHADERC - Mundo 3 - Velocidade Fixa: 0.00700
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderCFragmentShader = `uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

/*=================================
=          Shifting Dunes         =
=              Jaenam             =
==================================*/
// Date:    2025-09-28
// License: Creative Commons (CC BY-NC-SA)

// Velocidade fixa para mundo 3
#define TIME_SPEED 0.00700

#define N(p,t) sin(p*3.+sin(p*6.+t))*cos(p*3.+cos(p*6.+t))

void main()
{
    float i, z, d, t = (time * TIME_SPEED);
    for( gl_FragColor *= i; ++i < 1e2; )
    {
        vec3 p = z * normalize(vec3(gl_FragCoord.xy, 0) - resolution.xyy);
        
        for(d = 5.; d < 1e2; d += d)
            p += .6*N(p.yzx,t)/ d;
        z += d = .015 + max(d=length(p.xy)-2.5, -d * .1)/2.;
        gl_FragColor += cos((.4-fract(length(p))) + vec4(1, 2, 3, 0) * .3)/ d;   
    }
    gl_FragColor = tanh(gl_FragColor * gl_FragColor /5e6);
}`;

// 🚀 Registra o shader
registrarShader('shaderC-shader', null, shaderCFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderC-shader', NUMERO_DO_MUNDO);
