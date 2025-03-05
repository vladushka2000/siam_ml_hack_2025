from pydantic import Field

from interfaces import base_web_schema
from tools import enums


class DiagnosticTimeSeriesDot(base_web_schema.BaseWebSchema, base_web_schema.ConfigMixin):
    """
    Схема данных для одной точки временного ряда
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    dp: float = Field(description="Производная давления")
    p_feature: enums.PressureFeature = Field(
        description="Признак точки давления",
        default=enums.PressureFeature.d_value,
        alias="pFeature"
    )


class DiagnosticTimeSeries(base_web_schema.BaseWebSchema):
    """
    Схема данных для временного ряда
    """

    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")


class UsefulDataTimeSeriesDot(base_web_schema.BaseWebSchema, base_web_schema.ConfigMixin):
    """
    DTO одной точки временного ряда для нахождения полезных данных
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    is_useful: bool = Field(description="Полезность точки", default=False, alias="isUseful")


class UsefulDataTimeSeries(base_web_schema.BaseWebSchema):
    """
    DTO временного ряда для нахождения полезных данных
    """

    dots: list[UsefulDataTimeSeriesDot] = Field(description="Точки временного ряда")
