import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.findme.app',
  appName: 'FindMe',
  webDir: 'native',
  server: {
    url: 'https://whereabouts-navy.vercel.app',
  },
  plugins: {
    DeepLinks: {
      schemes: ['findme'],
    },
  },
};

export default config;
