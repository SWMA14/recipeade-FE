import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeade.svelte',
  appName: '레시피에이드',
  webDir: '.svelte-kit/cloudflare',
  server: {
    androidScheme: 'https',
    // url: "http://192.168.0.13:5173/",
    // cleartext: true
    // url: "https://recipeade-demo.pages.dev/",
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