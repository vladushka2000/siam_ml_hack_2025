from pydantic import Field, field_validator

from interfaces import base_dto
from tools import enums


class DiagnosticTimeSeriesDot(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO одной точки временного ряда
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    dp: float = Field(description="Производная давления")
    p_feature: enums.PressureFeature = Field(
        description="Признак точки давления",
        default=enums.PressureFeature.d_value,
        alias="pFeature"
    )

    @field_validator("t", "p", "dp")
    @classmethod
    def round(cls, value: float) -> float:
        return round(value, 2)


class TimeSeriesDTO(base_dto.BaseDTO):
    """
    DTO временного ряда
    """

    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")


class ResultDTO(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO результатов анализа
    """

    is_success: bool = Field(
        description="Флаг об успешности расчета",
        alias="isSuccess"
    )
    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")
    wb: float | None = Field(description="Физический коэффициент влияния ствола скважины", default=None)
    ra: float | None = Field(description="Коэффициент для радиального режима", default=None)
    li: float | None = Field(description="Коэффициент для линейного режима", default=None)
    bl: float | None = Field(description="Коэффициент для билинейного режима", default=None)
    sp: float | None = Field(description="Коэффициент для сферического режима", default=None)
    pc: float | None = Field(
        description="Время начала проявления эффекта для границы постоянного давления",
        default=None
    )
    ib: float | None = Field(
        description="Время начала проявления эффекта для непроницаемой границы",
        default=None
    )

    @field_validator("wb", "ra", "li", "bl", "sp", "pc", "ib")
    @classmethod
    def round(cls, value: float) -> float:
        return round(value, 2)
