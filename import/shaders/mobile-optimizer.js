/**
 * 📱 ZONAS 11 - OTIMIZADOR MÓVEL DE SHADERS
 * Sistema automático de detecção e adaptação para dispositivos móveis
 */

// 🔍 Detecta capacidade do dispositivo
function detectarCapacidadeDispositivo() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  
  if (!gl) return 'muito-baixa';
  
  // Informações do dispositivo
  const renderer = gl.getParameter(gl.RENDERER);
  const vendor = gl.getParameter(gl.VENDOR);
  const version = gl.getParameter(gl.VERSION);
  
  const deviceInfo = {
    isMobile: /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent),
    isIOS: /iPad|iPhone|iPod/.test(navigator.userAgent),
    isAndroid: /Android/.test(navigator.userAgent),
    memory: navigator.deviceMemory || 2, // GB estimado
    cores: navigator.hardwareConcurrency || 2,
    renderer: renderer.toLowerCase(),
    vendor: vendor.toLowerCase()
  };
  
  // 📊 Classificação de Performance
  let nivel = 'alta';
  
  if (deviceInfo.isMobile) {
    // Dispositivos móveis antigos
    if (deviceInfo.memory <= 2 || deviceInfo.cores <= 4) {
      nivel = 'baixa';
    }
    
    // GPUs muito antigas
    if (renderer.includes('adreno 3') || 
        renderer.includes('mali-4') || 
        renderer.includes('powervr sgx')) {
      nivel = 'muito-baixa';
    }
    
    // GPUs antigas mas usáveis
    if (renderer.includes('adreno 4') || 
        renderer.includes('mali-t') || 
        renderer.includes('powervr g6')) {
      nivel = 'baixa';
    }
  }
  
  console.log('📱 Dispositivo detectado:', deviceInfo);
  console.log('🎯 Nível de performance:', nivel);
  
  return { nivel, deviceInfo };
}

// 🎨 Shaders Otimizados por Nível
const SHADERS_POR_NIVEL = {
  'muito-baixa': {
    nome: 'mobile-ultra-light',
    shader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Gradient estático simples - sem animação
        vec3 color = vec3(
          0.2 + 0.3 * uv.x,
          0.3 + 0.4 * uv.y,
          0.5
        );
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  'baixa': {
    nome: 'mobile-light',
    shader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        
        // Gradient animado simples - apenas 1 operação sin/cos
        float t = time * 0.1; // Animação lenta
        vec3 color = vec3(
          0.5 + 0.3 * sin(t + uv.x),
          0.5 + 0.3 * cos(t + uv.y),
          0.4 + 0.2 * sin(t * 0.5)
        );
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  'media': {
    nome: 'mobile-medium',
    shader: `
      uniform float time;
      uniform vec2 resolution;
      varying vec2 vUv;
      
      void main() {
        vec2 uv = vUv;
        float t = time * 0.2;
        
        // Efeito ondulado simples - máximo 3 operações trigonométricas
        vec2 wave = uv + 0.1 * sin(t + uv.yx * 3.0);
        vec3 color = vec3(
          0.5 + 0.5 * cos(t + wave.x * 2.0),
          0.5 + 0.5 * cos(t + wave.y * 2.0 + 2.0),
          0.5 + 0.5 * cos(t + length(wave) * 2.0 + 4.0)
        );
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  },
  
  'alta': {
    nome: 'desktop-full',
    shader: null // Usa shaders originais complexos
  }
};

// 🚀 Aplicador Inteligente de Shaders
function aplicarShaderOtimizado(idMundo) {
  const { nivel } = detectarCapacidadeDispositivo();
  const shaderConfig = SHADERS_POR_NIVEL[nivel];
  
  console.log(`🎯 Aplicando shader de nível '${nivel}' para mundo ${idMundo}`);
  
  if (shaderConfig.shader) {
    // Usa shader otimizado para móvel
    const nomeShader = `${shaderConfig.nome}-mundo${idMundo}`;
    registrarShader(nomeShader, null, shaderConfig.shader);
    aplicarShaderAoSky(nomeShader, idMundo);
    
    console.log(`✅ Shader móvel aplicado: ${nomeShader}`);
  } else {
    // Usa shader original complexo (dispositivos potentes)
    console.log(`✅ Usando shader original complexo para mundo ${idMundo}`);
    // Chama sistema original de carregamento de shader
    carregarShaderMundo(idMundo);
  }
}

// 🎛️ Configurações de Performance
const CONFIG_PERFORMANCE = {
  'muito-baixa': {
    maxAnimationFrames: 15, // 15 FPS
    disableParticles: true,
    reducedLighting: true,
    lowResTextures: true
  },
  'baixa': {
    maxAnimationFrames: 30, // 30 FPS
    disableParticles: false,
    reducedLighting: false,
    lowResTextures: true
  },
  'media': {
    maxAnimationFrames: 60, // 60 FPS
    disableParticles: false,
    reducedLighting: false,
    lowResTextures: false
  },
  'alta': {
    maxAnimationFrames: 60, // 60 FPS
    disableParticles: false,
    reducedLighting: false,
    lowResTextures: false
  }
};

// 🔧 Aplicar Configurações de Performance
function aplicarConfiguracaoPerformance() {
  const { nivel } = detectarCapacidadeDispositivo();
  const config = CONFIG_PERFORMANCE[nivel];
  
  // Limitar FPS se necessário
  if (config.maxAnimationFrames < 60) {
    const originalRAF = window.requestAnimationFrame;
    let lastFrame = 0;
    const interval = 1000 / config.maxAnimationFrames;
    
    window.requestAnimationFrame = function(callback) {
      return originalRAF(function(time) {
        if (time - lastFrame >= interval) {
          lastFrame = time;
          callback(time);
        }
      });
    };
    
    console.log(`🎯 FPS limitado a ${config.maxAnimationFrames} para melhor performance`);
  }
  
  // Reduzir qualidade de renderização
  if (nivel === 'muito-baixa' || nivel === 'baixa') {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.setAttribute('renderer', {
        antialias: false,
        highRefreshRate: false,
        physicallyCorrectLights: false
      });
      console.log('🔧 Qualidade de renderização reduzida para dispositivo móvel');
    }
  }
}

// 🚀 Inicializador Automático
function inicializarOtimizadorMobile() {
  console.log('📱 Inicializando otimizador móvel...');
  
  // Aplica configurações de performance
  aplicarConfiguracaoPerformance();
  
  // Substitui função original de carregamento de shader
  window.carregarShaderMundoOriginal = window.carregarShaderMundo;
  window.carregarShaderMundo = aplicarShaderOtimizado;
  
  console.log('✅ Otimizador móvel ativo!');
}

// Auto-inicialização
document.addEventListener('DOMContentLoaded', inicializarOtimizadorMobile);