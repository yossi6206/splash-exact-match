import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.673046c80a78495faffb631f3a6dbfaf',
  appName: 'splash-exact-match',
  webDir: 'dist',
  server: {
    url: 'https://673046c8-0a78-495f-affb-631f3a6dbfaf.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: "#5B63D3",
      showSpinner: false
    }
  }
};

export default config;
