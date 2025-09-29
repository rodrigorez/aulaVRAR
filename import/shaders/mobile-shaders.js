/**
 * 📱 SHADERS MÓVEIS OTIMIZADOS - Zonas 11
 * Versões leves dos shaders complexos originais
 */

// 🎨 MUNDO 1 - Versão Mobile do Shader Fractal
const mundo1MobileShader = `
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = time * 0.1; // Animação mais lenta
  
  // Fractal simplificado - apenas 3 iterações em vez de 150
  vec2 z = uv * 2.0 - 1.0;
  vec3 color = vec3(0.0);
  
  for(int i = 0; i < 3; i++) { // Reduzido de 150 para 3
    float r = length(z);
    if(r > 2.0) break;
    
    z = vec2(z.x*z.x - z.y*z.y, 2.0*z.x*z.y) + vec2(sin(t), cos(t)) * 0.5;
    color += vec3(0.5, 0.7, 1.0) * (1.0 / (r + 1.0));
  }
  
  gl_FragColor = vec4(color * 0.5, 1.0);
}
`;

// 🌊 MUNDO 2 - Versão Mobile do Shader Oceano
const mundo2MobileShader = `
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = time * 0.05; // Muito mais lento
  
  // Ondas simplificadas - sem ray marching
  float wave1 = sin(uv.x * 5.0 + t) * 0.1;
  float wave2 = cos(uv.y * 3.0 + t * 0.7) * 0.05;
  
  vec3 oceanColor = vec3(0.1, 0.3, 0.6) + vec3(wave1 + wave2);
  oceanColor = mix(oceanColor, vec3(0.6, 0.8, 1.0), uv.y * 0.5);
  
  gl_FragColor = vec4(oceanColor, 1.0);
}
`;

// 🔥 MUNDO 3 - Versão Mobile do Shader Plasma
const mundo3MobileShader = `
uniform float time;
uniform vec2 resolution;
varying vec2 vUv;

void main() {
  vec2 uv = vUv;
  float t = time * 0.2;
  
  // Plasma ultra-simplificado
  float plasma = sin(uv.x * 6.0 + t) + 
                 sin(uv.y * 4.0 + t * 0.8) + 
                 sin((uv.x + uv.y) * 3.0 + t * 0.5);
  
  vec3 color = vec3(
    0.5 + 0.5 * sin(plasma + 0.0),
    0.5 + 0.5 * sin(plasma + 2.0),
    0.5 + 0.5 * sin(plasma + 4.0)
  );
  
  gl_FragColor = vec4(color, 1.0);
}
`;

// 🌌 Sistema de Registro dos Shaders Móveis
function registrarShadersMobeis() {
  registrarShader('mundo1-mobile', null, mundo1MobileShader);
  registrarShader('mundo2-mobile', null, mundo2MobileShader);
  registrarShader('mundo3-mobile', null, mundo3MobileShader);
  
  console.log('📱 Shaders móveis registrados com sucesso!');
}

// 🔄 Mapeamento Mundo → Shader Mobile
const SHADER_MOBILE_MAP = {
  1: 'mundo1-mobile',
  2: 'mundo2-mobile', 
  3: 'mundo3-mobile'
};

// 🚀 Função para aplicar shader móvel específico
function aplicarShaderMobile(idMundo) {
  const shaderName = SHADER_MOBILE_MAP[idMundo];
  
  if (shaderName) {
    aplicarShaderAoSky(shaderName, idMundo);
    console.log(`📱 Shader móvel aplicado: ${shaderName} para mundo ${idMundo}`);
  } else {
    console.warn(`⚠️ Shader móvel não encontrado para mundo ${idMundo}`);
  }
}

// Auto-registro quando carregado
document.addEventListener('DOMContentLoaded', registrarShadersMobeis);