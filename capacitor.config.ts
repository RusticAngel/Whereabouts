import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rusticangel.findme',
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
