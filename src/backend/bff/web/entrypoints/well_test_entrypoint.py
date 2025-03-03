import uuid

from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Body, Path
from starlette.responses import StreamingResponse

from config import app_config
from tools.di_containers import service_container
from web.schemas import diagnostic_time_series_schema
from web.schemas.api_response import ApiResponse, ApiSuccessMessage

router = APIRouter(prefix="/well-test", tags=["well-test"])

app_config = app_config.app_config

@router.post("/analyze/{session_id}")
@inject
async def analyze(
    session_id: uuid.UUID,
    time_series: diagnostic_time_series_schema.DiagnosticTimeSeries = Body(alias="timeSeries"),
    service = Provide[
        service_container.ServiceContainer.analyze_service
    ]
) -> ApiResponse:
    """
    Начать анализ временного ряда
    :param session_id: идентификатор сессии
    :param time_series: временной ряд
    :param service: объект сервиса
    """

    await service.analyze(time_series, session_id)

    return ApiResponse(
        data=ApiSuccessMessage(
            message="Временной ряд отправлен на анализ"
        ),
        status=200
    )


@router.get("/sse/{session_id}")
@inject
async def sse_endpoint(
    session_id: uuid.UUID,
    service = Provide[
        service_container.ServiceContainer.analyze_service
    ]
) -> StreamingResponse:
    """
    Установить соединение SSE
    :param session_id: идентификатор сессии
    :param service: объект сервиса
    :return: данные анализа временного ряда
    """

    return StreamingResponse(service.subscribe_to_rabbitmq(session_id), media_type="text/event-stream")
