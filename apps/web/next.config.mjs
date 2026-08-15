import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@itvara/ui',
    '@itvara/utils',
    '@itvara/types',
    'react-native',
    'react-native-web',
    'expo-router',
    'lucide-react-native',
    'react-native-svg',
    'nativewind',
    'react-native-css-interop'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      '@react-native/assets-registry/registry.js': 'react-native-web/dist/modules/AssetRegistry/index.js',
      'expo-haptics$': path.resolve(__dirname, 'mock-haptics.js')
    };
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ];
    return config;
  },
};

export default nextConfig;
