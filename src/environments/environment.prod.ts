import { NgxLoggerLevel } from 'ngx-logger';

export const environment = {
  appVersion: require('../../package.json').version,
  production: true,
  mapsKey: '',
  footer: '©2021-2022 ThankTheMaker',
  logger: {
    level: NgxLoggerLevel.ERROR,
  },
};
