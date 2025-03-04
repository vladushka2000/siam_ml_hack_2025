import { makeAutoObservable, runInAction } from 'mobx'

import { AnalyzeProperties, DiagnosticTimeSeries, DiagnosticTimeSeriesDot } from '../types/timeSeriesType';
import { roundToDecimal } from '../../../shared/utils/decimalRounder';
import { post } from '../../../shared/api/api';
import { PressureFeature } from '../types/timeSeriesType';
import { createSSEClient } from '../../../shared/api/sse';
import { snackBarStore } from '../../../shared/snack-bar/stores/snackBarStore';


export class TimeSeriesStore {
  constructor() {
    makeAutoObservable(this);
  }

  timeSeries: DiagnosticTimeSeriesDot[] | null = null;
  analyzeProperties: AnalyzeProperties = {
    wb: null,
    ra: null,
    li: null,
    bl: null,
    sp: null,
    pc: null,
    ib: null
  };

  parseLoading: boolean = false;
  analyzeLoading: boolean = false;
  analyzeFinished: boolean = false;
  error: string | null = null;
  
  parseTimeSeriesFile = (file: File) => {
    this.parseLoading = true;

    setTimeout(() => {
      runInAction(() => {      
        const reader = new FileReader();

        reader.onload = (e: ProgressEvent<FileReader>) => {
          try {
            const content = e.target?.result as string;
        
            if (content.length === 0) {
              throw new Error('Файл пуст');
            }
        
            const rows = content.split('\n');
            const initData = rows.map((row) => {
              const rowWithoutNewLineChar = row.replace('\r', '');
              const values = rowWithoutNewLineChar.split('\t');

              if (values.length < 3) {
                throw new Error('Неверный формат файла');
              };
        
              return {
                t: roundToDecimal(parseFloat(values[0]), 2),
                p: roundToDecimal(parseFloat(values[1]), 2),
                dp: roundToDecimal(parseFloat(values[2]), 2),
                pFeature: PressureFeature.DValue,
              };
            });
        
            this.setTimeSeries(initData);
          } catch (error) {
            snackBarStore.addItem({
              key: 0,
              message: 'Произошла ошибка при обработке файла',
              status: 'alert',
            });
          } finally {
            this.parseLoading = false;
          }
        };
        reader.readAsText(file);
      });
    }, 1000); // Задержка для плавности работы с приложением
  }

  setTimeSeries = (parsedTimeSeries: DiagnosticTimeSeriesDot[] | null) => {
    this.timeSeries = parsedTimeSeries
  }

  setAnalyzeProperties = (newProperties: AnalyzeProperties) => {
    this.analyzeProperties = newProperties
  }

  sendToAnalyzeTimeSeries = async (sessionId: string) => {
    this.analyzeLoading = true;

    const payload: DiagnosticTimeSeries = {
      dots: this.timeSeries as DiagnosticTimeSeriesDot[]
    };

    try {
      await post(`/well-test/analyze/${sessionId}`, payload);
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
      const analyzeMessage = await this.getLastAnalyzeMessage(sessionId);

      if (!analyzeMessage.isSuccess) {
        throw Error;
      }

      this.setTimeSeries(analyzeMessage.dots);
      const analyzeProperties = {
        wb: analyzeMessage.wb,
        ra: analyzeMessage.ra,
        li: analyzeMessage.li,
        bl: analyzeMessage.bl,
        sp: analyzeMessage.sp,
        pc: analyzeMessage.pc,
        ib: analyzeMessage.ib
      };
      timeSeriesStore.setAnalyzeProperties(analyzeProperties);
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

  getLastAnalyzeMessage = async (sessionId: string) => {
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

export const timeSeriesStore = new TimeSeriesStore()
