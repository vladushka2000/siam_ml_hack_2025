import { observer } from 'mobx-react-lite';
import { Theme } from '@consta/uikit/Theme';
import { Loader } from '@consta/uikit/Loader';
import { Layout } from '@consta/uikit/Layout';

import "./styles/layout.css";
import { themeTogglerStore } from "../../../shared/theme-toggler/stores/themeTogglerStore";
import { Toolbar } from '../../../widgets/toolbar/ui/toolbar';
import { TimeSeriesZone } from './timeSeriesUI/timeSeriesZone';
import { timeSeriesStore } from '../../../widgets/time-series/store/timeSeriesStore';
import { FileDrop } from './fileDrop';

export const App = observer(() => {
  return (
    <Theme preset={themeTogglerStore.getTheme()}>
      <Layout direction='column' className='main-layout'>
        <Toolbar />
        <Layout className='content-layout'>
          { timeSeriesStore.timeSeries ?
            <TimeSeriesZone /> :
            !timeSeriesStore.parseLoading ? <FileDrop /> : <Loader type='dots' size='m' />
          }
        </Layout>
      </Layout>
    </Theme>
  );
});
