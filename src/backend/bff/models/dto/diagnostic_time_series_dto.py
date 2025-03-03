from pydantic import Field

from interfaces import base_dto
from tools import enums


class DiagnosticTimeSeriesDot(base_dto.BaseDTO):
    """
    DTO одной точки временного ряда
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    dp: float = Field(description="Производная давления")
    p_feature: enums.PressureFeature = Field(
        description="Признак точки давления",
        default=enums.PressureFeature.d_value
    )


class DiagnosticTimeSeries(base_dto.BaseDTO):
    """
    DTO временного ряда
    """

    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")
