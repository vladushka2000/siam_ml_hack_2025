from pydantic import Field

from interfaces import base_dto
from tools import enums


class DiagnosticTimeSeriesDot(base_dto.BaseDTO):
    """
    DTO одной точки временного ряда для бинарной классификации
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    dp: float = Field(description="Производная давления")
    p_feature: enums.PressureFeature = Field(
        description="Признак точки давления",
        default=enums.PressureFeature.d_value
    )


class UsefulDataTimeSeriesDot(base_dto.BaseDTO):
    """
    DTO одной точки временного ряда для нахождения полезных данных
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    is_useful: bool = Field(description="Полезность точки", default=False, alias="isUseful")


class DiagnosticTimeSeries(base_dto.BaseDTO):
    """
    DTO временного ряда для бинарной классификации
    """

    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")
    time_series_type: enums.TimeSeriesType = Field(
        description="Тип временного ряда",
        default=enums.TimeSeriesType.binary_ts.value
    )


class UsefulDataTimeSeries(base_dto.BaseDTO):
    """
    DTO временного ряда для нахождения полезных данных
    """

    dots: list[UsefulDataTimeSeriesDot] = Field(description="Точки временного ряда")
    time_series_type: enums.TimeSeriesType = Field(
        description="Тип временного ряда",
        default=enums.TimeSeriesType.useful_data_ts.value
    )
