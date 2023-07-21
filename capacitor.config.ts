import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.recipeade.svelte',
  appName: 'recipeade',
  webDir: '.svelte-kit/cloudflare',
  server: {
    androidScheme: 'https'
  }
};

export default config;