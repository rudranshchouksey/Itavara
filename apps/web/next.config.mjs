/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@itvara/ui',
    'react-native',
    'expo-av',
    'expo-router',
    'expo-haptics',
    'expo-asset',
    'lucide-react-native',
    'react-native-svg',
    'nativewind',
    'react-native-css-interop',
    '@react-native/assets-registry'
  ],
  webpack: (config) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
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
