import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeade.svelte',
  appName: '레시피에이드',
  webDir: '.svelte-kit/cloudflare',
  server: {
    // url: "http://172.16.101.141:5173",
    // cleartext: true,
    androidScheme: 'https'
  }
};

export default config;