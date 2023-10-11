import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeade.svelte',
  appName: '레시피에이드',
  webDir: '.svelte-kit/cloudflare',
  server: {
    androidScheme: 'https',
    // url: "http://172.16.100.158:5173/",
    // cleartext: true
  },
  plugins: {
    GoogleAuth: {
      scopes: ["profile", "email"],
      clientId: "627309130382-9109aakabgpnjm91n43inhnhbtja28fp.apps.googleusercontent.com",
      forceCodeForRefreshToken: true
    }
  }
};

export default config;