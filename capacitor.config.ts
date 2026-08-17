import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.rusticangel.findme',
  appName: 'FindMe',
  webDir: 'native',
  server: {
    url: 'https://whereabouts-navy.vercel.app',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 0,
      launchAutoHide: false,
      backgroundColor: '#000000',
      androidScaleType: 'CENTER_CROP',
      showSpinner: false,
    },
    DeepLinks: {
      schemes: ['findme'],
    },
  },
};

export default config;
