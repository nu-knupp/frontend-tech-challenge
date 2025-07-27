import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Configurações condicionais baseadas no ambiente
  ...(process.env.NODE_ENV === 'production' && {
    output: 'standalone',
    trailingSlash: true,
    skipTrailingSlashRedirect: true,
  }),
  
  
  // webpack: (config, { isServer }) => {
  //   // Configurações específicas para single-spa apenas em produção
  //   if (process.env.NODE_ENV === 'production' && !isServer) {
  //     config.externals = config.externals || [];
  //     config.externals.push({
  //       'react': 'React',
  //       'react-dom': 'ReactDOM',
  //       'single-spa': 'singleSpa'
  //     });

  //     config.output = {
  //       ...config.output,
  //       library: {
  //         name: '@murilo-nascimento/frontend-tech-challenge',
  //         type: 'system'
  //       }
  //     };
  //   }

  //   return config;
  // },

  // Desabilitar otimização de imagem para export estático
  images: {
    unoptimized: true,
  },

  // Headers CORS para single-spa
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'Access-Control-Allow-Origin',
            value: '*',
          },
          {
            key: 'Access-Control-Allow-Methods',
            value: 'GET, POST, PUT, DELETE, OPTIONS',
          },
          {
            key: 'Access-Control-Allow-Headers',
            value: 'Content-Type, Authorization',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
