import { makeAutoObservable } from 'mobx';
import { IconSun } from '@consta/icons/IconSun';
import { IconMoon } from '@consta/icons/IconMoon';
import { presetGpnDark, presetGpnDefault } from '@consta/uikit/Theme';

import { ThemeType } from "../types/themeType";

export class ThemeTogglerStore {
  currentTheme: ThemeType = "Default"

  constructor() {
    makeAutoObservable(this);
  }

  setTheme = (theme: ThemeType) => {
    this.currentTheme = theme;
  }

  getItemIcon = (item: ThemeType) => {
    if (item === "Default") {
      return IconSun;
    }
    
    return IconMoon;
  };

  getTheme = () => {
    if (this.currentTheme === "Default") {
      return presetGpnDefault;
    }
    
    return presetGpnDark;
  };
}

export const themeTogglerStore = new ThemeTogglerStore();
