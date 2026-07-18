import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.findme.app',
  appName: 'FindMe',
  webDir: '.next',
  server: {
    url: 'https://whereabouts-navy.vercel.app',
  },
};

export default config;
