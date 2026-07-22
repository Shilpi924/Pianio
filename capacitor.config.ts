import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.shilpi924.pianio',
  appName: 'Pianio',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
