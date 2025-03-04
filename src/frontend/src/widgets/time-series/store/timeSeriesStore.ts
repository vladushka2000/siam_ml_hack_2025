import { makeAutoObservable, runInAction } from 'mobx'

import { AnalyzeProperties, DiagnosticTimeSeries, DiagnosticTimeSeriesDot } from '../types/timeSeriesType';
import { roundToDecimal } from '../../../shared/utils/decimalRounder';
import { post } from '../../../shared/api/api';
import { PressureFeature } from '../types/timeSeriesType';
import { createSSEClient } from '../../../shared/api/sse';


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
    this.parseLoading = true

    setTimeout(() => {
      runInAction(() => {
        const reader = new FileReader();
        reader.onload = (e: ProgressEvent<FileReader>) => {
          const content = e.target?.result as string;
          const rows = content.split('\n');
          const initData = rows.map((row) => {
            const rowWithoutNewLineChar = row.replace('\r', '');
            const values = rowWithoutNewLineChar.split('\t')

            return {
              t: roundToDecimal(parseFloat(values[0]), 2),
              p: roundToDecimal(parseFloat(values[1]), 2),
              dp: roundToDecimal(parseFloat(values[2]), 2),
              pFeature: PressureFeature.DValue
            }
          });
          this.setTimeSeries(initData)
        };
        reader.readAsText(file);
        this.parseLoading = false;
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

    const response = await post(`/well-test/analyze/${sessionId}`, payload);

    if (response.status !== 200) {
      throw new Error('Произошла ошибка при анализе');
    }
    const analyzeMessage = await this.getLastAnalyzeMessage(sessionId);
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
    this.analyzeLoading = false;
  }

  getLastAnalyzeMessage = async (sessionId: string) => {
    const sseClient = createSSEClient();
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
      console.error('Error while waiting for SSE message:', error);
      throw error;
    } finally {
      sseClient.disconnect();
    }
  }
}

export const timeSeriesStore = new TimeSeriesStore()
