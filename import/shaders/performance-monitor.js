/**
 * 🛡️ SISTEMA DE FALLBACK INTELIGENTE - Zonas 11
 * Detecta problemas de performance e faz fallback automático
 */

class PerformanceMonitor {
  constructor() {
    this.frameCount = 0;
    this.lastTime = performance.now();
    this.fpsHistory = [];
    this.isMonitoring = false;
    this.fallbackActivated = false;
    
    // Configurações
    this.FPS_THRESHOLD = 20; // Abaixo de 20 FPS = problema
    this.SAMPLE_SIZE = 30; // Amostras para média
    this.CHECK_INTERVAL = 1000; // Verifica a cada 1 segundo
  }
  
  // 📊 Inicia monitoramento
  startMonitoring() {
    if (this.isMonitoring) return;
    
    this.isMonitoring = true;
    console.log('📊 Monitoramento de performance iniciado...');
    
    const monitor = () => {
      if (!this.isMonitoring) return;
      
      this.checkPerformance();
      setTimeout(monitor, this.CHECK_INTERVAL);
    };
    
    monitor();
    this.startFrameTracking();
  }
  
  // 🎯 Rastreia FPS
  startFrameTracking() {
    const trackFrame = (currentTime) => {
      if (!this.isMonitoring) return;
      
      this.frameCount++;
      
      // Calcula FPS a cada segundo
      if (currentTime - this.lastTime >= 1000) {
        const fps = this.frameCount;
        this.fpsHistory.push(fps);
        
        // Mantém apenas últimas amostras
        if (this.fpsHistory.length > this.SAMPLE_SIZE) {
          this.fpsHistory.shift();
        }
        
        console.log(`📊 FPS atual: ${fps}`);
        
        this.frameCount = 0;
        this.lastTime = currentTime;
      }
      
      requestAnimationFrame(trackFrame);
    };
    
    requestAnimationFrame(trackFrame);
  }
  
  // 🔍 Verifica performance
  checkPerformance() {
    if (this.fpsHistory.length < 5) return; // Precisa de pelo menos 5 amostras
    
    const avgFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
    
    console.log(`📊 FPS médio: ${avgFPS.toFixed(1)}`);
    
    // Performance baixa detectada
    if (avgFPS < this.FPS_THRESHOLD && !this.fallbackActivated) {
      console.warn(`⚠️ Performance baixa detectada! FPS médio: ${avgFPS.toFixed(1)}`);
      this.activateFallback();
    }
  }
  
  // 🛡️ Ativa fallback
  activateFallback() {
    if (this.fallbackActivated) return;
    
    this.fallbackActivated = true;
    console.log('🛡️ Ativando fallback para melhorar performance...');
    
    // 1. Remove shaders complexos
    this.disableComplexShaders();
    
    // 2. Reduz qualidade visual
    this.reduceVisualQuality();
    
    // 3. Aplica shaders ultra-leves
    this.applyUltraLightShaders();
    
    // 4. Mostra notificação ao usuário
    this.showPerformanceNotification();
  }
  
  // 🎨 Remove shaders complexos
  disableComplexShaders() {
    const sky = document.querySelector('a-sky');
    if (sky) {
      // Remove shader e volta para cor sólida
      sky.removeAttribute('material');
      sky.setAttribute('color', '#1a1a2e');
      console.log('🎨 Shaders complexos desabilitados');
    }
  }
  
  // 🔧 Reduz qualidade visual
  reduceVisualQuality() {
    const scene = document.querySelector('a-scene');
    if (scene) {
      scene.setAttribute('renderer', {
        antialias: false,
        highRefreshRate: false,
        physicallyCorrectLights: false,
        foveationEnabled: true,
        precision: 'lowp'
      });
      console.log('🔧 Qualidade visual reduzida');
    }
  }
  
  // 🚀 Aplica shaders ultra-leves
  applyUltraLightShaders() {
    // Registra shader de emergência ultra-simples
    AFRAME.registerShader('emergency-shader', {
      schema: {
        color: { type: 'color', default: '#1a1a2e' }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        uniform vec3 color;
        void main() {
          gl_FragColor = vec4(color, 1.0);
        }
      `
    });
    
    // Aplica ao sky
    const sky = document.querySelector('a-sky');
    if (sky) {
      sky.setAttribute('material', 'shader: emergency-shader; color: #1a1a2e');
      console.log('🚀 Shader de emergência aplicado');
    }
  }
  
  // 💬 Mostra notificação
  showPerformanceNotification() {
    const notification = document.createElement('div');
    notification.style.cssText = `
      position: fixed;
      top: 10px;
      right: 10px;
      background: rgba(255, 152, 0, 0.9);
      color: white;
      padding: 15px;
      border-radius: 8px;
      font-family: Arial, sans-serif;
      font-size: 14px;
      z-index: 10000;
      max-width: 300px;
      box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    
    notification.innerHTML = `
      <strong>⚡ Performance Otimizada</strong><br>
      Efeitos visuais reduzidos para melhor experiência no seu dispositivo.
    `;
    
    document.body.appendChild(notification);
    
    // Remove após 5 segundos
    setTimeout(() => {
      if (notification.parentNode) {
        notification.parentNode.removeChild(notification);
      }
    }, 5000);
  }
  
  // 🛑 Para monitoramento
  stopMonitoring() {
    this.isMonitoring = false;
    console.log('🛑 Monitoramento de performance parado');
  }
}

// 🚀 Instância global
window.performanceMonitor = new PerformanceMonitor();

// 🔄 Auto-inicialização
document.addEventListener('DOMContentLoaded', () => {
  // Aguarda A-Frame carregar completamente
  setTimeout(() => {
    window.performanceMonitor.startMonitoring();
  }, 2000);
});

// 🎯 Integração com sistema existente
if (typeof aplicarShaderAoSky !== 'undefined') {
  const originalAplicarShader = aplicarShaderAoSky;
  
  aplicarShaderAoSky = function(nomeShader, idMundo) {
    // Se fallback está ativo, não aplica shaders complexos
    if (window.performanceMonitor.fallbackActivated) {
      console.log('🛡️ Fallback ativo - shader complexo ignorado:', nomeShader);
      return;
    }
    
    // Aplica shader normalmente
    return originalAplicarShader(nomeShader, idMundo);
  };
}