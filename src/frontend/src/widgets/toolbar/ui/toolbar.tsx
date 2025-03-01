import { observer } from 'mobx-react-lite';
import { Text } from '@consta/uikit/Text';
import { Layout } from '@consta/uikit/Layout';

import "./styles/tool-bar.css";
import { ThemeSetter } from '../../../shared/theme-toggler/ui/themeToggler';

export const Toolbar = observer(() => {
  return (
    <Layout direction="row" className="tool-bar">
      <Text view="primary" size="3xl" weight="bold" align="left" lineHeight="m" className="capitalize-text">📈 WellTester</Text>
      <ThemeSetter />
    </Layout>
  );
});
