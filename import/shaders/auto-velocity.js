/**
 * 🎯 SISTEMA DE APLICAÇÃO AUTOMÁTICA DE VELOCIDADES CALIBRADAS
 * Carrega configurações do JSON e aplica automaticamente
 * Seguindo preferências: carregamento dinâmico + simplicidade
 */

// 📋 Cache de configurações carregadas
let configuracoesVelocidade = null;

// 🔄 Função para carregar configurações de velocidade
async function carregarConfiguracaoVelocidades() {
  try {
    const response = await fetch('config/shader-velocidades.json');
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    configuracoesVelocidade = await response.json();
    console.log('✅ Configurações de velocidade carregadas:', configuracoesVelocidade);
    return configuracoesVelocidade;
    
  } catch (error) {
    console.warn('⚠️ Erro ao carregar configurações de velocidade:', error);
    
    // Fallback com configurações padrão
    configuracoesVelocidade = {
      shaderConfigurations: {},
      configuracaoGeral: { velocidadePadrao: 1.00000 }
    };
    
    return configuracoesVelocidade;
  }
}

// 🎯 Função para obter velocidade calibrada de um shader
function obterVelocidadeCalibranda(nomeShader) {
  if (!configuracoesVelocidade) {
    console.warn('⚠️ Configurações não carregadas, usando velocidade padrão');
    return 1.00000;
  }
  
  const config = configuracoesVelocidade.shaderConfigurations[nomeShader];
  
  if (config && config.velocidade) {
    console.log(`🎯 Velocidade calibrada para ${nomeShader}: ${config.velocidade}`);
    return config.velocidade;
  }
  
  const velocidadePadrao = configuracoesVelocidade.configuracaoGeral?.velocidadePadrao || 1.00000;
  console.log(`📋 Usando velocidade padrão para ${nomeShader}: ${velocidadePadrao}`);
  return velocidadePadrao;
}

// 🚀 Função aprimorada para aplicar shader com velocidade automática
async function aplicarShaderComVelocidadeCalibranta(nomeShader, idMundo, elementoSky = null) {
  try {
    // Garante que configurações estão carregadas
    if (!configuracoesVelocidade) {
      await carregarConfiguracaoVelocidades();
    }
    
    // Obtém velocidade calibrada
    const velocidadeCalibranda = obterVelocidadeCalibranda(nomeShader);
    
    // Aplica shader com velocidade
    const sky = elementoSky || document.querySelector('a-sky');
    if (!sky) {
      console.error('❌ Elemento sky não encontrado');
      return false;
    }
    
    sky.removeAttribute('color');
    sky.setAttribute('material', {
      shader: nomeShader,
      side: 'back',
      timeMultiplier: velocidadeCalibranda
    });
    
    console.log(`✅ Shader ${nomeShader} aplicado ao mundo ${idMundo} com velocidade ${velocidadeCalibranda}`);
    return true;
    
  } catch (error) {
    console.error(`❌ Erro ao aplicar shader ${nomeShader}:`, error);
    return false;
  }
}

// 📝 Função para salvar nova velocidade calibrada
async function salvarVelocidadeCalibranda(nomeShader, novaVelocidade, descricao = '') {
  if (!configuracoesVelocidade) {
    await carregarConfiguracaoVelocidades();
  }
  
  // Atualiza configuração em memória
  if (!configuracoesVelocidade.shaderConfigurations[nomeShader]) {
    configuracoesVelocidade.shaderConfigurations[nomeShader] = {};
  }
  
  configuracoesVelocidade.shaderConfigurations[nomeShader] = {
    velocidade: parseFloat(novaVelocidade.toFixed(5)),
    descricao: descricao || `Velocidade calibrada para ${nomeShader}`,
    calibradoPor: 'testador',
    dataCalibagem: new Date().toISOString().split('T')[0]
  };
  
  console.log(`💾 Configuração atualizada para ${nomeShader}:`, configuracoesVelocidade.shaderConfigurations[nomeShader]);
  
  // NOTA: Em um ambiente real, você enviaria isso para o servidor
  // Por ora, apenas logamos a configuração atualizada
  console.log('📋 Para persistir, copie esta configuração para shader-velocidades.json:');
  console.log(JSON.stringify(configuracoesVelocidade.shaderConfigurations[nomeShader], null, 2));
  
  return true;
}

// 🎨 Função helper para aplicar no mundo específico
async function aplicarShaderCalibrandomundo(idMundo, nomeShader) {
  const script = document.createElement('script');
  const nomeArquivo = nomeShader.replace('-shader', '.js');
  
  script.src = `../shaders/${nomeArquivo}`;
  script.onload = async () => {
    console.log(`✅ ${nomeShader} carregado`);
    await aplicarShaderComVelocidadeCalibranta(nomeShader, idMundo);
  };
  script.onerror = () => {
    console.error(`❌ Erro ao carregar ${nomeShader}`);
    const sky = document.querySelector('a-sky');
    if (sky) sky.setAttribute('color', '#1a1a1a');
  };
  
  document.head.appendChild(script);
}

// 🌍 Expor funções globalmente
window.carregarConfiguracaoVelocidades = carregarConfiguracaoVelocidades;
window.obterVelocidadeCalibranda = obterVelocidadeCalibranda;
window.aplicarShaderComVelocidadeCalibranta = aplicarShaderComVelocidadeCalibranta;
window.salvarVelocidadeCalibranda = salvarVelocidadeCalibranda;
window.aplicarShaderCalibrandomundo = aplicarShaderCalibrandomundo;

// 🚀 Carrega configurações automaticamente quando o script é incluído
document.addEventListener('DOMContentLoaded', carregarConfiguracaoVelocidades);