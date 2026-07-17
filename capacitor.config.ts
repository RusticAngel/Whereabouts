import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.trace.app',
  appName: 'Trace',
  webDir: '.next',
  server: {
    url: 'https://whereabouts-navy.vercel.app',
  },
};

export default config;
