import { makeAutoObservable, runInAction } from 'mobx'

import { ITimeSeriesStore, TimeSeries, TimeSeriesDot, TimeSeriesInitData } from '../types/timeSeriesType';
import { post } from '../../../shared/api/api';
import { createSSEClient } from '../../../shared/api/sse';
import { diagntosicTimeSeriesStore } from './diagnosticTimeSeries';
import { snackBarStore } from '../../../shared/snack-bar/stores/snackBarStore';


export class TimeSeriesStore {
  constructor(timeSeriesStore: ITimeSeriesStore) {
    makeAutoObservable(this);
    
    this.currentTimeSeriesStore = timeSeriesStore;
  }

  currentTimeSeriesStore: ITimeSeriesStore;

  analyzeLoading: boolean = false;
  analyzeFinished: boolean = false;

  parseFile = (file: File) => {
    this.currentTimeSeriesStore.parseFile(file);
  }

  sendToAnalyzeTimeSeries = async (sessionId: string) => {
    this.analyzeLoading = true;

    const payload: TimeSeriesInitData = {
      dots: this.currentTimeSeriesStore.timeSeries as TimeSeriesDot[]
    };

    try {
      await post(`${this.currentTimeSeriesStore.analyzeDataEndpoint}/${sessionId}`, payload);
    } catch {
      runInAction(() => {
        snackBarStore.addItem({
          'key': 0,
          'message': 'Произошла ошибка при отправке сообщения на анализ',
          'status': 'alert'
        });
      });

      this.analyzeLoading = false;

      return;
    }

    try {
      const analyzeMessage: TimeSeries = await this._getLastAnalyzeMessage(sessionId);

      if (!analyzeMessage.isSuccess) {
        throw Error;
      }

      this.currentTimeSeriesStore.setTimeSeries(analyzeMessage.dots);
      this.currentTimeSeriesStore.setAnalyzeProperties(analyzeMessage.analyzeProperties);

      this.analyzeFinished = true;

      runInAction(() => {
        snackBarStore.addItem({
          'key': 0,
          'message': 'Анализ завершен',
          'status': 'success'
        });
      });
    } catch (error) {
      runInAction(() => {
        snackBarStore.addItem({
          'key': 0,
          'message': 'Произошла ошибка при анализе',
          'status': 'alert'
        });
      });
    } finally {
      this.analyzeLoading = false;
    }
  }

  _getLastAnalyzeMessage = async (sessionId: string) => {
    const sseClient = createSSEClient();
    
    sseClient.on('error', () => {
      runInAction(() => {
        snackBarStore.addItem({
          'key': 0,
          'message': 'Произошла ошибка при доступе к серверу. Повторите попытку',
          'status': 'alert'
        });
      });
    });

    sseClient.connect(`/well-test/sse/${sessionId}`);

    try {
      while (true) {
        const message = await sseClient.waitForMessage();
        const parsedMessage = JSON.parse(message);

        if (parsedMessage) {
          return parsedMessage;
        }
      }
    } catch (error) {
      runInAction(() => {
        snackBarStore.addItem({
          'key': 0,
          'message': 'Произошла ошибка при получении данных. Повторите попытку',
          'status': 'alert'
        });
      });

      return;
    } finally {
      sseClient.disconnect();
    }
  }
}

export const timeSeriesStore = new TimeSeriesStore(diagntosicTimeSeriesStore)
