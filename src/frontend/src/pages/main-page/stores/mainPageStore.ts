import { makeAutoObservable, runInAction } from 'mobx'

import { timeSeriesStore } from '../../../widgets/time-series/store/timeSeriesStore';
import { ITimeSeriesStore } from '../../../widgets/time-series/types/timeSeriesType';


export class MainPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  sessionId: string = crypto.randomUUID();

  generateNewSessionId = () => {
    this.sessionId = crypto.randomUUID();
  }

  changeTimeSeriesStore = (newStore: ITimeSeriesStore) => {
    timeSeriesStore.currentTimeSeriesStore = newStore;
    this.makeNewAnalyze();
  }

  makeNewAnalyze = () => {
    timeSeriesStore.analyzeFinished = false;
    timeSeriesStore.currentTimeSeriesStore.setTimeSeries([]);
    timeSeriesStore.currentTimeSeriesStore.setAnalyzeProperties({});
    this.generateNewSessionId();

    timeSeriesStore.currentTimeSeriesStore.parseLoading = true;
    setTimeout(() => {
      runInAction(() => {
        timeSeriesStore.currentTimeSeriesStore.parseLoading = false;
      });
    }, 500); // Задержка для плавности работы с приложением
  }
}

export const mainPageStore = new MainPageStore()
