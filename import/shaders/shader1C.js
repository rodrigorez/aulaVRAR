/**
 * 🌌 SHADER SHADER1C - Convertido do Shadertoy
 * Sistema de shaders modulares Zonas 11
 * Conversão automática preservando funcionalidades originais
 */

// 🎨 Código do fragmentShader convertido
const shader1CFragmentShader = `uniform float time;
uniform float timeMultiplier;
uniform vec2 resolution;
varying vec2 vUv;

// CC0: Another flaming experiment
//  Doesn't look like real flames but gl_FragCoord.xy think it looks neat anyway

void mainImage(out vec4 gl_FragColor, vec2 C) {
  vec3 
      resolution=resolution    // Screen resolution
    , o                // Output color accumulator
    , p                // Current ray position in 3D space
    , P                // Stored/reference position for calculations
    ;
  
  // RAYMARCHING LOOP: Cast a ray from camera through each pixel
  for (
  float 
      i                // Ray step counter
    , j                // Temporary variable for turbulence and distance calculations
    , d                // Distance to nearest surface (SDF result)
    , z                // Current depth along the ray
    , t=(time * timeMultiplier)          // Current time for animations
    ; ++i<88.          
    ; z+=d/8.          // Step forward by distance/8 (conservative step size to reduce artifacts)
    ) {
    
    // RAY SETUP: Calculate ray direction from camera through current pixel
    p=z*normalize(vec3(C-.5*resolution.xy, resolution.y));  // Convert screen coords to 3D ray direction
    p.z-=4.;         // Move camera back 4 units from origin
    P=p;             // Store original ray position for later use
    
    // SPACE TRANSFORMATION: Bend/twist the space for visual effect
    p.xz*=mat2(cos(P.y*P.y/4.+2.*P.y-t+vec4(0,11,33,0)));  // Rotate XZ plane based on Y position and time
    p.x+=sin(.2*t-P.x);  // Add sinusoidal wave distortion
    
    // TURBULENCE: Add fractal noise to create flame-like distortion
    //  Based on @XorDev's turbulence shaders
    for(
        d=j=9.       
      ; --j>5.       
      ; d/=.8        // Increase frequency (more detail)
      )
      p += .4*(p.y+2.)*cos(p.zxy*d-3.*t)/d;  // Add scaled noise based on position and time
    
    // DISTANCE FIELD: Calculate distance to the flame surface
    j=length(p-P);   // Distance from current to original position (used for coloring)
    p=abs(p);        // Mirror space (creates symmetry)
    
    // Intersection of boxes
    d=abs(
      min(
          // Box aligned with z
          max(
              p.z-.1           // Plane in Z
            , p.x-1.-.3*P.y    // Plane in X, tapered by Y position
            )
          // Box aligned with x
        , max(
              p.x-.2           // Plane constraint in X  
            , p.z-1.-.3*P.y    // Plane constraint in Z, tapered by Y position
            )
        ))+9e-3;  // Add small epsilon to make boxes translucent
    
    // COLOR CALCULATION: Generate flame colors based on position and movement
    P = 1.+sin(.5+j-P.y+P.z+vec3(2,3,4));  // RGB color variations using sine waves
    
    // VOLUMETRIC RENDERING: Accumulate color based on density (1/distance)
    o += P.x/d*P;    // Add color contribution: intensity/distance * color
  }
  
  // TONE MAPPING: Convert accumulated light to final pixel color
  gl_FragColor = tanh(o.xyzx/2E3);  // Compress bright values, output RGBA (xyzx creates alpha=x)
}`;

// 🚀 Registra o shader
registrarShader('shader1C-shader', null, shader1CFragmentShader);

// 📝 Para aplicar este shader ao mundo, use:
// aplicarShaderAoSky('shader1C-shader', NUMERO_DO_MUNDO);
