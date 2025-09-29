/**
 * 🌌 SHADER MUNDO 3 - Plasma Effect
 * Efeito plasma colorido
 */

const mundo3FragmentShader = converterShadertoy(`
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    vec2 center = vec2(0.5, 0.5);
    
    float time = iTime * 0.5;
    
    float dist = distance(uv, center);
    float angle = atan(uv.y - center.y, uv.x - center.x);
    
    float plasma = sin(dist * 20.0 + time) * 
                   sin(angle * 8.0 + time * 2.0) * 
                   sin(uv.x * 10.0 + time * 1.5) *
                   sin(uv.y * 15.0 + time * 0.8);
    
    vec3 col = vec3(
        0.5 + 0.5 * sin(plasma + time),
        0.5 + 0.5 * sin(plasma + time + 2.094),
        0.5 + 0.5 * sin(plasma + time + 4.188)
    );
    
    fragColor = vec4(col, 1.0);
}
`);

registrarShader('mundo3-plasma', null, mundo3FragmentShader);
aplicarShaderAoSky('mundo3-plasma', 3);