import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whereabouts.app',
  appName: 'Whereabouts',
  webDir: '.next',
  server: {
    url: 'http://192.168.1.20:3000',
    cleartext: true,
  },
  android: {
    allowMixedContent: true,
  },
};

export default config;
