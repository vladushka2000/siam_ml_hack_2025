import { observer } from 'mobx-react-lite';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/Layout';

import "../styles/layout.css";
import { timeSeriesStore } from '../../../../widgets/time-series/store/timeSeriesStore';
import { TimeSeries } from '../../../../widgets/time-series/ui/timeSeries';
import { useSSE } from '../../../../shared/api/sse/hooks/useSSE';
import { mainPageStore } from '../../stores/mainPageStore';
import { TimeSeriesControl } from './timeSeriesControl';

export const TimeSeriesZone = observer(() => {
  const { messages, lastMessage } = useSSE(`/well-test/sse/${mainPageStore.sessionId}`);

  if (!timeSeriesStore.analyzeFinished && lastMessage?.isSuccess) {
    timeSeriesStore.analyzeFinished = true;
    timeSeriesStore.analyzeLoading = false;
    timeSeriesStore.setTimeSeries(lastMessage.dots);

    const analyzeProperties = {
      wb: lastMessage.wb,
      ra: lastMessage.ra,
      li: lastMessage.li,
      bl: lastMessage.bl,
      sp: lastMessage.sp,
      pc: lastMessage.pc,
      ib: lastMessage.ib
    };
    timeSeriesStore.setAnalyzeProperties(analyzeProperties);
  }

  return (
    <>
      {
        timeSeriesStore.timeSeries ?
          <Layout direction='column' className='time-series-zone'>
            <Layout direction='column' className='time-series'>
              <TimeSeries dots={timeSeriesStore.timeSeries} />
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
                    timeSeriesStore.analyzeTimeSeries(mainPageStore.sessionId)
                  }}
                  loading={timeSeriesStore.analyzeLoading}
                  disabled={timeSeriesStore.analyzeLoading}
                />
              }
            </Layout>
          </Layout>
        :
        null
      }
    </>
  )
})
