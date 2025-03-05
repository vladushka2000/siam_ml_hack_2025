import { flow, makeAutoObservable } from 'mobx'

import { AnalyzeProperties, ITimeSeriesStore, TimeSeriesDot, TimeSeriesType } from '../types/timeSeriesType';
import { roundToDecimal } from '../../../shared/utils/decimalRounder';
import { snackBarStore } from '../../../shared/snack-bar/stores/snackBarStore';


export class UsefulTimeSeriesStore implements ITimeSeriesStore {
  constructor() {
    makeAutoObservable(this);
  }

  timeSeriesType: TimeSeriesType = TimeSeriesType.usefulDataTS;
  analyzeDataEndpoint: string = '/well-test/analyzeUsefulData';
  timeSeries: TimeSeriesDot[] = [];
  analyzeProperties: AnalyzeProperties | {} = {};

  parseLoading: boolean = false;
  
  parseFile = flow(function* (this: UsefulTimeSeriesStore, file: File) {
    this.parseLoading = true;

    yield new Promise((resolve) => setTimeout(resolve, 1000)); // Задержка для плавности работы с приложением

    const reader = new FileReader();

    try {
      const content: string = yield new Promise((resolve, reject) => {
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.onerror = () => reject(new Error('Ошибка чтения файла'));
        reader.readAsText(file);
      });

      if (content.length === 0) {

        throw new Error('Файл пуст');
      }

      const rows = content.split('\n');
      const initData = rows.map((row) => {
        const rowWithoutNewLineChar = row.replace('\r', '');
        const values = rowWithoutNewLineChar.split('\t');

        if (values.length !== 2) {
          return;
        }

        return {
          t: roundToDecimal(parseFloat(values[0]), 2),
          p: roundToDecimal(parseFloat(values[1]), 2),
          isUseful: false,
        };
      });

      const initDataFiltered = initData.filter((element): element is { t: number; p: number; isUseful: boolean } => {
        return element !== undefined;
      });

      if (initDataFiltered.length === 0) {
        throw new Error('Неверный формат файла');
      }

      this.setTimeSeries(initDataFiltered);
    } catch (error) {
      snackBarStore.addItem({
        key: 0,
        message: 'Произошла ошибка при обработке файла',
        status: 'alert',
      });
    } finally {
      this.parseLoading = false;
    }
  });

  setTimeSeries = (parsedTimeSeries: TimeSeriesDot[]) => {
    this.timeSeries = parsedTimeSeries
  }

  setAnalyzeProperties = (newProperties: AnalyzeProperties | {}) => {
    this.analyzeProperties = newProperties
  }
}

export const usefulTimeSeriesStore = new UsefulTimeSeriesStore()
