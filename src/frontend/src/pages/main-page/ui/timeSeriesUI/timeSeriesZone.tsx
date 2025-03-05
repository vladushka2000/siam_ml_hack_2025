import { observer } from 'mobx-react-lite';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/Layout';

import "../styles/layout.css";
import { timeSeriesStore } from '../../../../widgets/time-series/store/timeSeriesStore';
import { BinaryTimeSeries } from '../../../../widgets/time-series/ui/binaryTimeSeries';
import { mainPageStore } from '../../stores/mainPageStore';
import { TimeSeriesControl } from './timeSeriesControl';
import { DiagnosticTimeSeriesDot, TimeSeriesType, UsefulDataTimeSeriesDot } from '../../../../widgets/time-series/types/timeSeriesType';
import { UsefulDataTimeSeries } from '../../../../widgets/time-series/ui/usefulDataTimeSeries';

export const TimeSeriesZone = observer(() => {
  return (
    <Layout direction='column' className='time-series-zone'>
      <Layout direction='column' className='time-series'>
        {
          timeSeriesStore.currentTimeSeriesStore.timeSeriesType === TimeSeriesType.binaryTS ?
          <BinaryTimeSeries
            dots={timeSeriesStore.currentTimeSeriesStore.timeSeries as DiagnosticTimeSeriesDot[]}
            analyzedFinished={timeSeriesStore.analyzeFinished}
          /> :
          <UsefulDataTimeSeries
            dots={timeSeriesStore.currentTimeSeriesStore.timeSeries as UsefulDataTimeSeriesDot[]}
            analyzedFinished={timeSeriesStore.analyzeFinished}
          />
        }
      </Layout>
      <Layout direction='column' className='time-series-info-zone'>
        {
          timeSeriesStore.analyzeFinished ?
          <TimeSeriesControl /> :
          <Button
            className='time-series-analyze-button'
            label='Анализ'
            size='m'
            onClick={() => {
              timeSeriesStore.sendToAnalyzeTimeSeries(mainPageStore.sessionId)
            }}
            loading={timeSeriesStore.analyzeLoading}
            disabled={timeSeriesStore.analyzeLoading}
          />
        }
      </Layout>
    </Layout>
  )
})
