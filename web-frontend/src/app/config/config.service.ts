import { Injectable } from '@angular/core';
import { InConfiguration } from '../core/models/config.interface';

@Injectable({
  providedIn: 'root',
})
export class ConfigService {
  public configData!: InConfiguration;

  constructor() {
    this.setConfigData();
  }

  setConfigData() {
    this.configData = {
      layout: {
        rtl: false, // options:  true & false
        variant: 'light', // options:  light & dark
        theme_color: 'white', // options:  white, black, purple, blue, cyan, green, orange, gold-purple
        logo_bg_color: 'white', // options:  white, black, purple, blue, cyan, green, orange, gold-purple
        sidebar: {
          collapsed: false, // options:  true & false
          backgroundColor: 'light', // options:  light & dark
        },
      },
    };
  }

  getConfig(): InConfiguration {
    return this.configData;
  }

  setTheme(themeColor: string) {
    this.configData.layout.theme_color = themeColor;
  }
}
