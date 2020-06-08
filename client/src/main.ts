import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';
import { environment } from './environments/environment';

import * as utils from './app/utils';
utils.log(`${window.location.protocol}://${window.location.host}`);

if (environment.production) {
  environment.serverAdress = `${window.location.protocol}://${window.location.host}`;
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule)
  .catch(err => console.error(err));
