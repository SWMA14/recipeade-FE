import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeade.svelte',
  appName: '레시피에이드',
  webDir: '.svelte-kit/cloudflare',
  server: {
    androidScheme: 'https'
  }
};

export default config;