import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as utils from './app/utils';

console.log('protocol : ' + window.location.protocol,
  'host : ' + window.location.host,
  'port : ' + window.location.host.split(':')[1]);

if (environment.production) {
  environment.serverPort = parseInt(window.location.host.split(':')[1], 10);
  environment.serverAdress = window.location.host.split(':')[0];
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
