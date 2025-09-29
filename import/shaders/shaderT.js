/**
 * 🌌 SHADER SHADERT - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shaderTFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// CC0: Glowing mountain lines
// Playing around with @XorDev's dot noise function
// Not what gl_FragCoord.xy intended, but it works

// Twigl: https://twigl.app?ol=true&ss=-OZ0M95iFPCSAPdqq9Lt

// Shader entry point: gl_FragColor = output color, C = pixel coordinates
void mainImage(out vec4 gl_FragColor, vec2 C) {
 float
   a      // Amplitude for noise octaves
 , d      // Distance field value
 , i      // Ray marching step counter
 ;
 vec3
   p      // Current 3D position being sampled
 , Z=resolution                    // Screen resolution
 , gl_FragCoord.xy=normalize(vec3(C, Z.y) -.5*Z)  // Ray direction from camera
 ;
 vec4 o;  // Accumulated color output
 // Main raymarching loop - march ray through 3D space
 for(
   Z=vec3(0,0,fract(-(time * timeMultiplier))/gl_FragCoord.xy.z)     // Ray position (raymarching state)
 ; ++i<60.
 ; Z+=1./abs(gl_FragCoord.xy)   // Step along ray direction
 )
   // Sample at two different Z depths (j=0 and j=2, skipping j=1)
   for(
      int j
    ; j<3
    ; j+=2
    ) {
     // Calculate 3D world position
     p=Z[j]*gl_FragCoord.xy;
     p.z+=(time * timeMultiplier);    // Move forward with time

     p*=.2;         // Scale down the sampling space
     d=p.y;         // Start with Y coordinate as base
     gl_FragColor=1.+sin(.5*p.x+p.z+vec4(2,1,0,2));  // Color based on position

     // Generate fractal noise with 3 octaves
     for(
       a=.6         // Initial amplitude
     ; a>.1         // Gives 3 amplitudes
     ; p=p.yzx      // Rotate coordinates (x->y, y->z, z->x)
     )
       // Dot noise by XorDev found here: https://www.shadertoy.com/view/wfsyRX
       d+=a+a*dot(sin(p), cos(p*1.618).yzx)  // Add noise octave
     , a*=.5                                 // Halve amplitude each octave
     , p.yz*=.2*mat2(6,8,-8,6)               // Scale & rotate Y,Z coordinates
     ;

     // Convert to distance field and add fog effect
     d=abs(d)+5e-4/gl_FragCoord.xy[j]/gl_FragCoord.xy[j]+.01*smoothstep(10.,60.,Z[j]);
     // Accumulate color contribution (volumetric rendering)
     o+=gl_FragColor.w/d*gl_FragColor*smoothstep(60.,40.,Z[j]);
   }
   
 // Apply tone mapping to prevent color overflow
 gl_FragColor=tanh(o/5e2);
}`;

// 🚀 Registra o shader
registrarShader('shaderT-shader', null, shaderTFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shaderT-shader', NUMERO_DO_MUNDO);
