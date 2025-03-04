import { observer } from 'mobx-react-lite';
import { DualAxes } from '@consta/charts/DualAxes';

import "./styles/time-series.css";
import { DiagnosticTimeSeriesDot } from '../types/timeSeriesType';

type TimeSeriesProps = {
    dots: DiagnosticTimeSeriesDot[] | null;
}

export const TimeSeries = observer((props: TimeSeriesProps) => {
  return (
    <>
      {
        props.dots ?
        <DualAxes
          data={[props.dots, props.dots]}
          xField='t'
          yField={['p', 'dp']}
          geometryOptions={[
            {
              geometry: 'line',
              smooth: true,
              lineStyle: {
                lineWidth: 1.2,
                opacity: 0.5,
              },
              point: {
                shape: 'circle',
                size: 2,
              }
            },
            {
              geometry: 'line',
              smooth: true,
              seriesField: 'pFeature',
              lineStyle: ( data ) => {
                const width = data.pFeature === 'Некачественные данные' ? 0 : 2

                return {
                  lineWidth: width,
                  opacity: 1
                }
              },
              point: {
                shape: 'circle',
                size: 5
              }
            }
          ]}
          meta={{
            t: {alias: 'Время'},
            p: {alias: 'Давление'},
            dp: {alias: 'Производная давления'}
          }}
          slider={{
            start: 0,
            end: 1,
          }}
          className='time-series'
        /> :
        null
      }
    </>
  );
});
