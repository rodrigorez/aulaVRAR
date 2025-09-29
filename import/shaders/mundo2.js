/**
 * 🌌 SHADER MUNDO 2 - Gradient Simples
 * Exemplo básico de gradient
 */

const mundo2FragmentShader = converterShadertoy(`
void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    vec2 uv = fragCoord / iResolution.xy;
    
    // Gradient baseado na posição e tempo
    vec3 col = vec3(0.5 + 0.5*cos(iTime + uv.xyx + vec3(0,2,4)));
    
    fragColor = vec4(col, 1.0);
}
`);

registrarShader('mundo2-gradient', null, mundo2FragmentShader);
aplicarShaderAoSky('mundo2-gradient', 2);