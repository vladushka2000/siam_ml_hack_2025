import { makeAutoObservable, runInAction } from 'mobx'

import { timeSeriesStore } from '../../../widgets/time-series/store/timeSeriesStore';


export class MainPageStore {
  constructor() {
    makeAutoObservable(this);
  }

  sessionId: string = crypto.randomUUID();

  generateNewSessionId = () => {
    this.sessionId = crypto.randomUUID();
  }

  makeNewAnalyze = () => {
    timeSeriesStore.analyzeFinished = false;
    timeSeriesStore.setTimeSeries(null);
    const analyzeProperties = {
      wb: null,
      ra: null,
      li: null,
      bl: null,
      sp: null,
      pc: null,
      ib: null
    };
    timeSeriesStore.setAnalyzeProperties(analyzeProperties);
    this.generateNewSessionId();

    timeSeriesStore.parseLoading = true;
    setTimeout(() => {
      runInAction(() => {
        timeSeriesStore.parseLoading = false;
      });
    }, 500); // Задержка для плавности работы с приложением
  }
}

export const mainPageStore = new MainPageStore()
