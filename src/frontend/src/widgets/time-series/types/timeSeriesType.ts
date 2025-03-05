export enum TimeSeriesType {
  binaryTS = 'Бинарные признаки ГДИС',
  usefulDataTS = 'Полезные данные ГДИС',
}

export interface ITimeSeriesStore {
  analyzeDataEndpoint: string,
  timeSeriesType: TimeSeriesType,
  timeSeries: TimeSeriesDot[] | null,
  parseLoading: boolean,
  analyzeProperties: AnalyzeProperties | {},
  parseFile: (file: File) => any,
  setTimeSeries: (parsedTimeSeries: TimeSeriesDot[]) => any,
  setAnalyzeProperties: (newProperties: AnalyzeProperties | {}) => any
}

export enum PressureFeature {
  DValue = 'Производная давления',
  BadQuality = 'Некачественные данные',
  WellboreStorage = 'Влияние ствола скважины',
  RadialFlow = 'Радиальный режим течения',
  LinearFlow = 'Линейный режим течения',
  BilinearFlow = 'Билинейный режим течения',
  SphericalFlow = 'Сферический режим течения',
  ConstantPressureBoundary = 'Граница постоянного давления',
  ImpermeableBoundary = 'Непроницаемые границы'
}

export type TimeSeriesDot = {
  t: number,
  p: number,
}

export type DiagnosticTimeSeriesDot = TimeSeriesDot & {
  dp: number,
  pFeature: PressureFeature
}

export type UsefulDataTimeSeriesDot = TimeSeriesDot & {
  isUseful: boolean
}

export type TimeSeriesInitData = {
  dots: TimeSeriesDot[],
}

export type TimeSeries = TimeSeriesInitData & {
  isSuccess: boolean,
  analyzeProperties: {}
}

export type DiagnosticTimeSeries = TimeSeries & {
  dots: DiagnosticTimeSeriesDot[]
  analyzeProperties: AnalyzeProperties
}

export type UsefulDataTimeSeries = TimeSeries & {
  dots: UsefulDataTimeSeriesDot[]
}

export type AnalyzeProperties = {
  wb: number | null;
  ra: number | null;
  li: number | null;
  bl: number | null;
  sp: number | null;
  pc: number | null;
  ib: number | null;
}
