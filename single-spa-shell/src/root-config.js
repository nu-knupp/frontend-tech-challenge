import { registerApplication, start } from 'single-spa';

// Configuração dos micro-frontends
const microfrontends = [
  {
    name: 'home-mf',
    app: () => createMicrofrontendApp('http://localhost:9001'),
    activeWhen: (location) => location.hash === '#/home' || location.hash === '' || location.hash === '#/',
  },
  {
    name: 'analytics-mf', 
    app: () => createMicrofrontendApp('http://localhost:9002'),
    activeWhen: (location) => location.hash === '#/analytics',
  },
  {
    name: 'transactions-mf',
    app: () => createMicrofrontendApp('http://localhost:9003'),
    activeWhen: (location) => location.hash === '#/transactions',
  }
];

// Função para criar um wrapper de aplicação single-spa para micro-frontends externos
function createMicrofrontendApp(url) {
  return {
    async mount() {
      const container = document.getElementById('microfrontend-container');
      if (container) {
        // Limpar container anterior
        container.innerHTML = '';
        
        // Criar iframe para o micro-frontend
        const iframe = document.createElement('iframe');
        iframe.src = url;
        iframe.style.width = '100%';
        iframe.style.height = '100vh';
        iframe.style.border = 'none';
        iframe.style.display = 'block';
        
        // Adicionar loading state
        const loading = document.createElement('div');
        loading.className = 'loading-state';
        loading.innerHTML = '🔄 Carregando micro-frontend...';
        loading.style.display = 'flex';
        loading.style.alignItems = 'center';
        loading.style.justifyContent = 'center';
        loading.style.height = '200px';
        loading.style.fontSize = '1.2rem';
        loading.style.color = '#667eea';
        
        container.appendChild(loading);
        container.appendChild(iframe);
        
        // Remover loading quando iframe carregar
        iframe.onload = () => {
          loading.style.display = 'none';
          iframe.style.display = 'block';
        };
        
        iframe.onerror = () => {
          loading.innerHTML = '❌ Erro ao carregar micro-frontend';
          loading.style.color = '#ef4444';
        };
      }
      
      return Promise.resolve();
    },
    
    async unmount() {
      const container = document.getElementById('microfrontend-container');
      if (container) {
        container.innerHTML = '';
      }
      return Promise.resolve();
    }
  };
}

// Registrar todos os micro-frontends
microfrontends.forEach(({ name, app, activeWhen }) => {
  registerApplication({
    name,
    app,
    activeWhen
  });
});

// Função para navegar entre micro-frontends
window.navigateToMicrofrontend = function(route) {
  window.location.hash = route;
};

// Função para verificar status dos micro-frontends
window.checkMicrofrontendStatus = async function() {
  const statusIndicators = {
    'home': document.getElementById('status-home'),
    'analytics': document.getElementById('status-analytics'), 
    'transactions': document.getElementById('status-transactions')
  };
  
  const endpoints = {
    'home': 'http://localhost:9001',
    'analytics': 'http://localhost:9002',
    'transactions': 'http://localhost:9003'
  };
  
  for (const [key, url] of Object.entries(endpoints)) {
    const indicator = statusIndicators[key];
    if (indicator) {
      try {
        await fetch(url, { 
          mode: 'no-cors',
          cache: 'no-cache'
        });
        
        indicator.className = 'status-indicator status-online';
        indicator.title = `${key} está online`;
      } catch {
        indicator.className = 'status-indicator status-offline';
        indicator.title = `${key} está offline`;
      }
    }
  }
};

// Inicializar Single-SPA
start();

// Verificar status periodicamente
setInterval(window.checkMicrofrontendStatus, 30000);

// Verificar status inicial após DOM carregar
document.addEventListener('DOMContentLoaded', () => {
  window.checkMicrofrontendStatus();
});
