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

export type DiagnosticTimeSeriesDot = {
  t: number,
  p: number,
  dp: number,
  pFeature: PressureFeature
}

export type DiagnosticTimeSeries = {
  dots: DiagnosticTimeSeriesDot[]
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
