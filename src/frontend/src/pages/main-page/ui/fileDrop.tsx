import { observer } from 'mobx-react-lite';

import { DragNDropField } from '@consta/uikit/DragNDropField';
import { timeSeriesStore } from '../../../widgets/time-series/store/timeSeriesStore';

export const FileDrop = observer(() => {
  const onDropFile = (files: File[]): void => {
    timeSeriesStore.parseTimeSeriesFile(files[0])
  }

  return (
    <DragNDropField
      className='drop-file'
      multiple={false}
      onDropFiles={onDropFile}
      maxSize={1 * 1024 * 1024}
    />
  );
});
