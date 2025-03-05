import { observer } from 'mobx-react-lite';
import { Text } from '@consta/uikit/Text';
import { Layout } from '@consta/uikit/Layout';
import { Switch } from '@consta/uikit/Switch';

import "./styles/tool-bar.css";
import { ThemeSetter } from '../../../shared/theme-toggler/ui/themeToggler';
import { mainPageStore } from '../../../pages/main-page/stores/mainPageStore';
import { diagntosicTimeSeriesStore } from '../../time-series/store/diagnosticTimeSeries';
import { usefulTimeSeriesStore } from '../../time-series/store/usefulDataTimeSeries';
import { useState } from 'react';
import { timeSeriesStore } from '../../time-series/store/timeSeriesStore';

export const Toolbar = observer(() => {
  const [switchState, setSwitch] = useState<boolean>(true);

  const stores = [
    usefulTimeSeriesStore,
    diagntosicTimeSeriesStore
  ]

  return (
    <Layout direction="row" className="tool-bar">
      <Layout direction="row" className="tool-bar-name">
        <Switch
          checked={switchState}
          size='m'
          onChange={() => {
            setSwitch(!switchState);
            mainPageStore.changeTimeSeriesStore(stores[Number(!switchState)])}
          }
          disabled={
            timeSeriesStore.analyzeLoading ||
            timeSeriesStore.currentTimeSeriesStore.parseLoading ? true : false}
        />
        <Text
          view="primary"
          size="2xl"
          weight="bold"
          align="left"
          lineHeight="m"
          className="capitalize-text"
        >
          {timeSeriesStore.currentTimeSeriesStore.timeSeriesType
        }</Text>
      </Layout>
      <ThemeSetter />
    </Layout>
  );
});
