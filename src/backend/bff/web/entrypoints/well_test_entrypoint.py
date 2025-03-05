import uuid

from dependency_injector.wiring import Provide, inject
from fastapi import APIRouter, Body
from starlette.responses import StreamingResponse

from config import app_config
from models.dto import diagnostic_time_series_dto
from tools.di_containers import service_container
from web.schemas import diagnostic_time_series_schema
from web.schemas.api_response import ApiResponse, ApiSuccessMessage

router = APIRouter(prefix="/well-test", tags=["well-test"])

app_config = app_config.app_config

@router.post("/analyzeBinary/{session_id}")
@inject
async def analyze_binary(
    session_id: uuid.UUID,
    time_series: diagnostic_time_series_schema.DiagnosticTimeSeries = Body(alias="timeSeries"),
    service = Provide[
        service_container.ServiceContainer.analyze_service
    ]
) -> ApiResponse:
    """
    Начать анализ временного ряда для бинарной классификации
    :param session_id: идентификатор сессии
    :param time_series: временной ряд
    :param service: объект сервиса
    """

    time_series_to_analyze = diagnostic_time_series_dto.DiagnosticTimeSeries(
        dots=[
            diagnostic_time_series_dto.DiagnosticTimeSeriesDot(
                t=dot.t,
                p=dot.p,
                dp=dot.dp,
                p_feature=dot.p_feature
            ) for dot in time_series.dots
        ]
    )
    await service.analyze_binary(time_series_to_analyze, session_id)

    return ApiResponse(
        data=ApiSuccessMessage(
            message="Временной ряд отправлен на анализ"
        ),
        status=200
    )


@router.post("/analyzeUsefulData/{session_id}")
@inject
async def analyze_useful_data(
    session_id: uuid.UUID,
    time_series: diagnostic_time_series_schema.UsefulDataTimeSeries = Body(alias="timeSeries"),
    service = Provide[
        service_container.ServiceContainer.analyze_service
    ]
) -> ApiResponse:
    """
    Начать анализ временного ряда для поиска полезных данных
    :param session_id: идентификатор сессии
    :param time_series: временной ряд
    :param service: объект сервиса
    """

    time_series_to_analyze = diagnostic_time_series_dto.UsefulDataTimeSeries(
        dots=[
            diagnostic_time_series_dto.UsefulDataTimeSeriesDot(
                t=dot.t,
                p=dot.p,
                is_useful=dot.is_useful
            ) for dot in time_series.dots
        ]
    )
    await service.analyze_useful_data(time_series_to_analyze, session_id)

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
