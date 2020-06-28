import { environment as environmentProd } from './environment.prod';

const environmentDev = {
  clientPort: 4200,
  serverPort: 3002,
  production: false,
  online: false,
  log: true
};

let environmentSwitch;
if (process.env.heroku || process.env.PROD) {
  environmentSwitch = environmentProd;
} else {
  environmentSwitch = environmentDev;
}

export const environment = environmentSwitch;