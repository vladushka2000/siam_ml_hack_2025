from pydantic import Field, field_validator

from interfaces import base_dto
from tools import enums


class DiagnosticTimeSeriesDot(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO одной точки временного ряда для бинарной классификации
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
    DTO временного ряда для бинарной классификации
    """

    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")
    time_series_type: enums.TimeSeriesType = Field(description="Тип временного ряда")


class AnalyzePropertiesDTO(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO результатов свойств после анализа для бинарной классификации
    """

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


class DiagnosticResultDTO(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO результатов анализа для бинарной классификации
    """

    is_success: bool = Field(
        description="Флаг об успешности расчета",
        alias="isSuccess"
    )
    dots: list[DiagnosticTimeSeriesDot] = Field(description="Точки временного ряда")
    analyze_properties: AnalyzePropertiesDTO = Field(
        description="Результаты по свойствам после анализа",
        alias="analyzeProperties"
    )


class UsefulDataTimeSeriesDotDTO(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO одной точки временного ряда для нахождения полезных данных
    """

    t: float = Field(description="Время замера")
    p: float = Field(description="Давление")
    is_useful: bool = Field(description="Полезность точки", alias="isUseful")

    @field_validator("t", "p")
    @classmethod
    def round(cls, value: float) -> float:
        return round(value, 2)


class UsefulDataTimeSeriesDTO(base_dto.BaseDTO):
    """
    DTO временного ряда для нахождения полезных данных
    """

    dots: list[UsefulDataTimeSeriesDotDTO] = Field(description="Точки временного ряда")
    time_series_type: enums.TimeSeriesType = Field(description="Тип временного ряда")

class UsefulDataResultDTO(base_dto.BaseDTO, base_dto.ConfigMixin):
    """
    DTO результатов анализа для нахождения полезных данных
    """

    is_success: bool = Field(
        description="Флаг об успешности расчета",
        alias="isSuccess"
    )
    dots: list[UsefulDataTimeSeriesDotDTO] = Field(description="Точки временного ряда")
    analyze_properties: dict = Field(
        description="Результаты по свойствам после анализа",
        alias="analyzeProperties",
        default_factory=lambda: dict
    )
