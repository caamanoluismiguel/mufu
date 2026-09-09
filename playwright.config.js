import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'tests/browser',fullyParallel:false,workers:1,timeout:45000,
  use:{baseURL:'http://127.0.0.1:4177',browserName:'chromium',trace:'retain-on-failure',reducedMotion:'reduce'},
  reporter:[['list']],
  webServer:{command:'npm run preview',url:'http://127.0.0.1:4177',reuseExistingServer:true},
});
