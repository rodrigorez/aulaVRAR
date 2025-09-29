/**
 * 🌌 SHADER SHADER1D - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1DFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;



const float PI = 3.14159265;
vec3 cmap(float x) { return pow(.5+.5*cos(PI * x + vec3(1,2,3)), vec3(2.5)); }

void main()
{
    vec2 uv = (2. * gl_FragCoord.xy-resolution.xy)/resolution.y;
    float focal = 2.25;
    vec3 ro = vec3(0,0,(time * timeMultiplier));
    vec3 rd = normalize(vec3(uv, -focal));
    vec3 color = vec3(0);
    float t = 0.;
    for(int i = 0; i < 99; i++)
    {
        vec3 p = t * rd + ro;
        
        float T = (t+(time * timeMultiplier))/5.;
        float c = cos(T), s = sin(T);
        p.xy = mat2(c,-s,s,c) * p.xy;
        
        for(float f = 0.; f < 9.; f++) 
        {
            float a = exp(f)/exp2(f);
            p += cos(p.yzx * a + (time * timeMultiplier))/a;
        }
        float d = 1./50. + abs((ro -p-vec3(0,1,0)).y-1.)/10.;
        color += cmap(t) * 2e-3 / d;
        t += d;
    }
    
    color *= color*color;
    color = 1.-exp(-color);
    color = pow(color, vec3(1./2.2));
    gl_FragColor = vec4(color, 1);
}`;

// 🚀 Registra o shader
registrarShader('shader1D-shader', null, shader1DFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1D-shader', NUMERO_DO_MUNDO);
