/**
 * 🌌 ZONAS 11 - SISTEMA BASE DE SHADERS
 * Conversões e utilitários para shaders Shadertoy → A-Frame
 */

// 🛡️ Sistema de interceptação de erros WebGL
function inicializarMonitorWebGL() {
  // Intercepta erros WebGL em tempo real
  const originalError = console.error;
  console.error = function(...args) {
    const errorMsg = args.join(' ');
    
    if (errorMsg.includes('WebGL') || errorMsg.includes('texSubImage2D') || errorMsg.includes('glTexStorage2D')) {
      console.warn('🛡️ Erro WebGL interceptado:', errorMsg);
      
      // Tenta recuperação automática
      setTimeout(() => {
        const sky = document.querySelector('a-sky');
        if (sky && sky.getAttribute('material').includes('shader:')) {
          console.log('🔄 Tentando fallback para textura padrão...');
          sky.setAttribute('src', '#city-texture');
          sky.removeAttribute('material');
        }
      }, 100);
      
      return; // Não propaga erro para evitar spam
    }
    
    originalError.apply(console, args);
  };
}

// Inicializa monitoramento assim que possível
inicializarMonitorWebGL();

// 🎯 Função para registrar shader no A-Frame
function registrarShader(nomeShader, vertexShader, fragmentShader, uniforms = {}) {
  AFRAME.registerShader(nomeShader, {
    schema: {
      time: { type: 'time', is: 'uniform' },
      resolution: { type: 'vec2', is: 'uniform', default: { x: 1024, y: 512 } },
      ...uniforms
    },
    
    vertexShader: vertexShader || `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    
    fragmentShader: fragmentShader
  });
}

// 🔄 Conversão padrão Shadertoy → A-Frame
function converterShadertoy(shadertoyCode) {
  return shadertoyCode
    // Substituições básicas
    .replace(/void\s+mainImage\s*\(\s*out\s+vec4\s+fragColor\s*,\s*in\s+vec2\s+fragCoord\s*\)/g, 'void main()')
    .replace(/fragColor/g, 'gl_FragColor')
    .replace(/fragCoord/g, 'gl_FragCoord.xy')
    .replace(/iTime/g, 'time')
    .replace(/iResolution/g, 'resolution')
    // Adiciona uniforms e varying
    .replace(/void main\(\)/, `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      void main()
    `);
}

// 🎨 Aplicar shader ao <a-sky>
function aplicarShaderAoSky(nomeShader, idMundo) {
  console.log(`🎯 Tentando aplicar shader '${nomeShader}' ao mundo ${idMundo}`);
  
  function tentarAplicarShader() {
    const sky = document.querySelector('a-sky');
    if (!sky) {
      console.log('⏳ Sky element ainda não encontrado...');
      return false;
    }

    // Verifica se o shader foi registrado
    if (!AFRAME.shaders || !AFRAME.shaders[nomeShader]) {
      console.log(`⏳ Aguardando shader '${nomeShader}' ser registrado...`);
      return false;
    }

    console.log(`🌌 Sky element encontrado e shader '${nomeShader}' disponível`);
    
    // Remove qualquer textura anterior
    sky.removeAttribute('src');
    sky.removeAttribute('color');
    
    // Aplica shader
    try {
      const materialStr = `shader: ${nomeShader}; side: back`;
      console.log(`🎨 Aplicando material: ${materialStr}`);
      
      sky.setAttribute('material', materialStr);
      sky.setAttribute('geometry', 'primitive: sphere; radius: 100; segmentsWidth: 64; segmentsHeight: 32');
      
      console.log(`✅ Shader '${nomeShader}' aplicado ao mundo ${idMundo}`);
      
      // Verifica se foi aplicado corretamente
      setTimeout(() => {
        const appliedMaterial = sky.getAttribute('material');
        console.log('🔍 Material aplicado:', appliedMaterial);
      }, 1000);
      
      return true;
      
    } catch (error) {
      console.warn(`⚠️ Erro ao aplicar shader '${nomeShader}':`, error);
      // Fallback para cor sólida
      sky.setAttribute('color', '#1a1a1a');
      return false;
    }
  }
  
  // Polling para aguardar shader estar disponível
  function iniciarPolling() {
    const intervalId = setInterval(() => {
      if (tentarAplicarShader()) {
        clearInterval(intervalId);
      }
    }, 200); // Verifica a cada 200ms
    
    // Timeout de segurança (10 segundos)
    setTimeout(() => {
      clearInterval(intervalId);
      console.warn(`⚠️ Timeout: shader '${nomeShader}' não foi aplicado em 10 segundos`);
      // Aplica fallback
      const sky = document.querySelector('a-sky');
      if (sky) sky.setAttribute('color', '#1a1a1a');
    }, 10000);
  }
  
  // Verifica se DOM já está carregado ou espera carregar
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', iniciarPolling);
  } else {
    // DOM já carregado, inicia polling imediatamente
    iniciarPolling();
  }
}

// 🚀 Carregar shader específico do mundo (SIMPLES)
function carregarShaderMundo(idMundo) {
  const script = document.createElement('script');
  script.src = `../shaders/mundo${idMundo}.js`;
  script.onload = () => console.log(`✅ Shader do mundo ${idMundo} carregado`);
  script.onerror = () => {
    console.warn(`⚠️ Shader mundo${idMundo}.js não encontrado`);
    // Aplica cor sólida como fallback
    const sky = document.querySelector('a-sky');
    if (sky) sky.setAttribute('color', '#1a1a1a');
  };
  document.head.appendChild(script);
}