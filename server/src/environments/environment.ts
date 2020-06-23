import { environment as environmentProd } from './environment.prod';

const environmentDev = {
  clientPort: 4200,
  serverPort: 3002,
  production: false,
  online: false,
  log: true
};

let environmentSwitch;
if (process.env.heroku) {
  environmentSwitch = environmentProd;
} else {
  environmentSwitch = environmentDev;
}

environmentSwitch = environmentProd;
export const environment = environmentSwitch;