import { environment as environmentProd } from './environment.prod';

const environmentDev = {
  clientPort: 4200,
  serverPort: 3002,
  production: true,
  log: true
};

export const environment = environmentDev;