from typing import Any

from pydantic import Field

from interfaces import base_web_schema


class ApiResponse(base_web_schema.BaseWebSchema, base_web_schema.ConfigMixin):
    """
    Схема данных для ответа API
    """

    data: Any = Field(description="Ответ на запрос")
    status: int = Field(description="Статус запроса")


class ApiSuccessMessage(base_web_schema.BaseWebSchema):
    message: str = Field(description="Сообщение об успешности запроса")
