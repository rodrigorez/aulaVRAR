/**
 * 🌌 TEMPLATE SHADER MUNDO X - [NOME DO SEU EFEITO]
 * Baseado em: [URL do Shadertoy se disponível]
 * 
 * INSTRUÇÕES:
 * 1. Substitua X pelo número do mundo
 * 2. Cole seu código do Shadertoy onde indicado
 * 3. Renomeie o arquivo para mundoX.js
 * 4. Copie para docs/shaders/
 */

const mundoXFragmentShader = converterShadertoy(`
// 🎯 COLE SEU CÓDIGO SHADERTOY AQUI
// Exemplo básico:

void mainImage( out vec4 fragColor, in vec2 fragCoord )
{
    // Normalizar coordenadas (0.0 a 1.0)
    vec2 uv = fragCoord / iResolution.xy;
    
    // Exemplo: Gradient animado baseado no tempo
    float time = iTime * 0.5;
    
    // Cores que mudam com o tempo e posição
    vec3 col = vec3(
        0.5 + 0.5 * cos(time + uv.x + 0.0),  // Vermelho
        0.5 + 0.5 * cos(time + uv.y + 2.0),  // Verde  
        0.5 + 0.5 * cos(time + uv.x + 4.0)   // Azul
    );
    
    fragColor = vec4(col, 1.0);
}
`);

// 🚀 Registra o shader no A-Frame
registrarShader('mundoX-[nome]', null, mundoXFragmentShader);

// 🌌 Aplica ao fundo 360° do mundo X
aplicarShaderAoSky('mundoX-[nome]', X);

console.log('✅ Shader mundo X carregado: [NOME DO SEU EFEITO]');