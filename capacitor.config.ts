import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'myadmin.client.vue',
  appName: 'myadmin-client-vue',
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  }
};

export default config;
