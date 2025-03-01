import { makeAutoObservable, runInAction } from 'mobx'

import { AnalyzeProperties, DiagnosticTimeSeries, DiagnosticTimeSeriesDot } from '../types/timeSeriesType';
import { roundToDecimal } from '../../../shared/utils/decimalRounder';
import { post } from '../../../shared/api/sse/api';
import { PressureFeature } from '../types/timeSeriesType';


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

  analyzeTimeSeries = async (session_id: string) => {
    this.analyzeLoading = true;

    const payload: DiagnosticTimeSeries = {
      dots: this.timeSeries as DiagnosticTimeSeriesDot[]
    };

    const response = await post(`/well-test/analyze/${session_id}`, payload);

    if (response.status !== 200) {
      throw new Error('Произошла ошибка при анализе');
    }

    const result = await response.data;
  }
}

export const timeSeriesStore = new TimeSeriesStore()
