
import { observer } from 'mobx-react-lite';
import { useRef, useState } from 'react';
import { Button } from '@consta/uikit/Button';
import { Layout } from '@consta/uikit/Layout';
import { Text } from '@consta/uikit/Text';
import { Tooltip } from '@consta/uikit/Tooltip';

import "../styles/layout.css";
import { timeSeriesStore } from '../../../../widgets/time-series/store/timeSeriesStore';
import { mainPageStore } from '../../stores/mainPageStore';

export const TimeSeriesControl = observer(() => {
  const anchorRef = useRef<HTMLButtonElement>(null);
  const [isTooltipVisible, setIsTooltipVisible] = useState<boolean>(false);

  return (
    <Layout direction='row' className='time-series-control'>
      <Button
        label='Новый анализ'
        type='button'
        onClick={() => {
          mainPageStore.makeNewAnalyze();
        }}
        ref={anchorRef}
      />
      <Button
        label='Результаты анализа'
        type='button'
        onClick={() => {setIsTooltipVisible(!isTooltipVisible)}}
        ref={anchorRef}
      />
      <Tooltip
        isOpen={isTooltipVisible}
        direction='upCenter'
        spareDirection='downStartLeft'
        anchorRef={anchorRef}
        size='m'
      >
        <Text view='primary' lineHeight='m' size='s'>
          {
            Object.keys(timeSeriesStore.analyzeProperties).map((key) => {
              const typedKey = key as keyof typeof timeSeriesStore.analyzeProperties;
              return (
                <Text>
                  Параметр {key}: {
                    timeSeriesStore.analyzeProperties[typedKey] ?
                    timeSeriesStore.analyzeProperties[typedKey] :
                    '-'
                  }
                </Text>
              )
            })
          }
        </Text>
      </Tooltip>
    </Layout>
  )
});
