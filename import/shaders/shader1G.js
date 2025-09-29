/**
 * 🌌 SHADER SHADER1G - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1GFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// woke up and couldn't get back to sleep :/
#define PI=3.1415926
mat2 rot(float a){ return mat2(cos(a),-sin(a),sin(a),cos(a)); }

//-------------------------
// Lensflare 部分（精简：删除了自动旋转和鼠标中心）
float noise(float t)
{
    return texture(iChannel0,vec2(t, 0.0) / iChannelResolution[0].xy).x;
}
float noise(vec2 t)
{
    return texture(iChannel0,t / iChannelResolution[0].xy).x;
}

vec3 lensflare(vec2 uv,vec2 pos)
{
    vec2 main = uv-pos;
    vec2 uvd = uv*(length(uv));
    
    float ang = atan(main.y, main.x);
    float dist=length(main); dist = pow(dist,.1);
    float n = noise(vec2(ang*16.0,dist*32.0));   // 去掉 (time * timeMultiplier)
    
    float f0 = 1.0/(length(uv-pos)*16.0+1.0);
    f0 = f0+f0*(sin((ang + n*2.0)*1.0)*.1+dist*.1+.8);

    float f2  = max(1.0/(1.0+32.0*pow(length(uvd+0.8*pos),2.0)),.0)*00.25;
    float f22 = max(1.0/(1.0+32.0*pow(length(uvd+0.85*pos),2.0)),.0)*00.23;
    float f23 = max(1.0/(1.0+32.0*pow(length(uvd+0.9*pos),2.0)),.0)*00.21;
    
    vec2 uvx = mix(uv,uvd,-0.5);
    
    float f4  = max(0.01-pow(length(uvx+0.4*pos),2.4),.0)*6.0;
    float f42 = max(0.01-pow(length(uvx+0.45*pos),2.4),.0)*5.0;
    float f43 = max(0.01-pow(length(uvx+0.5*pos),2.4),.0)*3.0;
    
    uvx = mix(uv,uvd,-.4);
    
    float f5  = max(0.01-pow(length(uvx+0.2*pos),5.5),.0)*2.0;
    float f52 = max(0.01-pow(length(uvx+0.4*pos),5.5),.0)*2.0;
    float f53 = max(0.01-pow(length(uvx+0.6*pos),5.5),.0)*2.0;
    
    uvx = mix(uv,uvd,-0.5);
    
    float f6  = max(0.01-pow(length(uvx-0.3*pos),1.6),.0)*6.0;
    float f62 = max(0.01-pow(length(uvx-0.325*pos),1.6),.0)*3.0;
    float f63 = max(0.01-pow(length(uvx-0.35*pos),1.6),.0)*5.0;
    
    vec3 c = vec3(.0);
    c.resolution+=f2+f4+f5+f6; c.g+=f22+f42+f52+f62; c.b+=f23+f43+f53+f63;
    c+=vec3(f0);
    
    return c;
}

vec3 cc(vec3 color, float factor,float factor2) // color modifier
{
    float w = color.x+color.y+color.z;
    return mix(color,vec3(w)*factor,w*factor2);
}
//-------------------------

void mainImage(out vec4 o, vec2 u) {
    float d,a,e,e2,i,s,t = (time * timeMultiplier)*10.0;
    vec4 colortint=vec4(1,0,1,0);
    vec3  p = resolution;    
    
    // scale coords
    u = (u+u-p.xy)/p.y;
    
    // cinema bars
    if (abs(u.y) > .8) { o = vec4(0); return; }
    
    //-------------------------
    // 鼠标旋转相机
    vec2 mouse = iMouse.xy / resolution.xy;
    float yaw   = (mouse.x-0.5) * 6.2831;
    float pitch = (mouse.y-0.5) * 3.1415;

    vec3 rd = normalize(vec3(u, 1.0));
    rd.yz = rd.yz * rot(pitch);
    rd.xz = rd.xz * rot(yaw);

    vec3 ro = vec3(0.0, 0.0, -t*0.5*3.0); 
    //-------------------------

    for(o*=i; i++<128.;
        d += s = min(.01+.4*abs(s),e=max(.8*e, .01)),
        o += (1.+colortint*cos(.1*p.z*vec4(3.0,1.0,3.14/2.0,0.0)))/(s+e*2.))//color
        
        for (p = ro + rd*d,
            e = length(p - vec3(
                sin(sin(t*.2)+t*.4) * 2.,
                1.+sin(sin(t*.5)+t*.2) *2.,
                10.0 + ro.z))-.1,
            e2 = length(p - vec3(
                sin(sin(t*.2)+t*.4) * 2.,
                1.+sin(sin(t*.5)+t*.2) *2.,
                -10.0 + ro.z))-.1,
             e=(e+e2)*0.75,
            p.xy *= mat2(cos(.1*t+p.z/16.+vec4(0,33,11,0))),
            s = 4. - abs(p.y),
            a = .42; a < 16.; a += a)
            
            p += cos(.4*t+p.yzx)*.3,
            s -= abs(dot(sin(.1*t+p * a ), .18+p-p)) / a;
    
    // tonemap
    u += (u.yx*.9+.3-vec2(-1.,.5));
    o = tanh(o/6./max(dot(u,u), .001));

    //-------------------------
    // Lensflare (固定以 rd.xy 为中心)
    vec3 flare = lensflare(rd.xy, vec2(0.0,0.0));
    flare = cc(flare*1.0, .5*0.1, .1);
    o.rgb += flare * 1.0;
    //o.rgb = flare * 1.0;
}`;

// 🚀 Registra o shader
registrarShader('shader1G-shader', null, shader1GFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1G-shader', NUMERO_DO_MUNDO);
