import { observer } from 'mobx-react-lite';
import { ThemeToggler } from '@consta/uikit/ThemeToggler';

import { themeTogglerStore } from "../stores/themeTogglerStore";
import { items, ThemeType } from "../types/themeType";

export const ThemeSetter = observer(() => {
  return (
    <ThemeToggler
      items={items}
      value={themeTogglerStore.currentTheme}
      getItemKey={(item: ThemeType) => item}
      getItemLabel={(item: ThemeType) => item}
      getItemIcon={(item: ThemeType) => themeTogglerStore.getItemIcon(item)}
      onChange={(item) => themeTogglerStore.setTheme(item)}
    />
  );
});
