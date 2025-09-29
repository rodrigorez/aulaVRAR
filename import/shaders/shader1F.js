/**
 * 🌌 SHADER SHADER1F - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1FFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// original code from XorDev all credit belongs to him!
// https://x.com/XorDev/status/1957832841762398583

void main()
{
    // Shadertoy uniform mappings:
    // resolution = resolution (resolution in twigl geek mode)
    // (time * timeMultiplier) = time (t in twigl geek mode)
    // gl_FragCoord.xy = gl_FragCoord (gl_FragCoord.xy in twigl geekest mode)
    
    vec2 resolution = resolution.xy;
    float t = (time * timeMultiplier);
    vec4 gl_FragCoord.xy = vec4(gl_FragCoord.xy, 0.0, 1.0); // Convert vec2 to vec4 like gl_FragCoord
    vec4 o = vec4(0.0); // output color
    vec2 mouse = iMouse.xy / resolution;
    
    vec3 x,c,p;x.x+=9.;
    
for(float i,z,f;i++<5e1;p=mix(c,p,.3),z+=f=.2*(abs(p.z+p.x+16.+tanh(p.y)/.1)+sin(p.x-p.z+t+t)+1.),o+=(cos(p.x*.2+f+vec4(6,1,2,0))+2.)/f/z)

// for(c=p=z*normalize(gl_FragCoord.xy.rgb*2.-resolution.xyy),p.y*=f=.3;f++<5.;p+=cos(p.yzx*f+i+z+x*t)/f);

for(c=p=z*normalize((gl_FragCoord.xy.rgb+vec3(-resolution.x*0.15,0,0))*2.-resolution.xyy),p.y*=f=.3;f++<5.;p+=cos(p.yzx*f+i+z+x*t)/f);

// mouse x // for(c=p=z*normalize((gl_FragCoord.xy.rgb+vec3(-resolution.x*(mouse.x-0.5),0,0))*2.-resolution.xyy),p.y*=f=.3;f++<5.;p+=cos(p.yzx*f+i+z+x*t)/f);

// mouse xy // for(c=p=z*normalize((gl_FragCoord.xy.rgb+vec3(-resolution.x*(mouse.x-0.5),-resolution.y*(mouse.y-0.5),0))*2.-resolution.xyy),p.y*=f=.3;f++<5.;p+=cos(p.yzx*f+i+z+x*t)/f);



o=tanh(o/3e1);

    gl_FragColor = o;
}`;

// 🚀 Registra o shader
registrarShader('shader1F-shader', null, shader1FFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1F-shader', NUMERO_DO_MUNDO);
