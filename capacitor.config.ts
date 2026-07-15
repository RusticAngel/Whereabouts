import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whereabouts.app',
  appName: 'Whereabouts',
  webDir: '.next',
  server: {
    url: 'https://whereabouts-navy.vercel.app',
  },
};

export default config;
