import enum


class PressureFeature(enum.Enum):
    d_value = "Производная давления"
    bad_quality = "Некачественные данные"
    wellbore_storage = "Влияние ствола скважины"
    radial_flow = "Радиальный режим течения"
    linear_flow = "Линейный режим течения"
    bilinear_flow = "Билинейный режим течения"
    spherical_flow = "Сферический режим течения"
    constant_pressure_boundary = "Граница постоянного давления"
    impermeable_boundary = "Непроницаемые границы"
