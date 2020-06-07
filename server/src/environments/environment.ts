import { environment as environmentProd } from './environment.prod';

const environmentDev = {
  clientPort: 4200,
  serverPort: 3002,
  production: true,
  online: false,
  log: true
};

let environmentSwitch;
if (process.env.heroku) {
  environmentSwitch = environmentProd;
}

export const environment = environmentSwitch;