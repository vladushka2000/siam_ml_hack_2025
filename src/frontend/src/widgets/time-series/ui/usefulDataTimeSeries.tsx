import { observer } from 'mobx-react-lite';
import { DualAxes } from '@consta/charts/DualAxes';

import "./styles/time-series.css";
import { UsefulDataTimeSeriesDot } from '../types/timeSeriesType';

type TimeSeriesProps = {
    dots: UsefulDataTimeSeriesDot[];
    analyzedFinished: boolean;
}

export const UsefulDataTimeSeries = observer((props: TimeSeriesProps) => {
  return (
    <DualAxes
      data={[props.dots, props.dots]}
      xField='t'
      yField={['p', 'p']}
      geometryOptions={[
        {
          geometry: 'line',
          smooth: true,
          lineStyle: {
            lineWidth: props.analyzedFinished ? 0 : 1.2,
            opacity: props.analyzedFinished ? 0 : 0.5,
          },
          point: {
            shape: 'circle',
            size: props.analyzedFinished ? 0 : 2,
          }
        },
        {
          geometry: 'line',
          seriesField: 'isUseful',
          lineStyle: {
            lineWidth: props.analyzedFinished ? 1.2 : 0,
            opacity: props.analyzedFinished ? 0.5 : 0,
          },
          point: {
            shape: 'circle',
            size: props.analyzedFinished ? 4 : 0,
          }
        }
      ]}
      meta={{
        t: {alias: 'Время'},
        p: {alias: 'Давление'},
        isUseful: {alias: 'Полезность'}
      }}
      slider={{
        start: 0,
        end: 1,
      }}
      className='time-series'
    />
  );
});
