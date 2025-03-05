import datetime
import json
import logging
from pathlib import Path
import uuid

from ai_model import ai_model
from config import rabbitmq_config
from models.dto import broker_message_dto
from models.dto import time_series_dto

config = rabbitmq_config.config
logger = logging.getLogger(__name__)


class AnalyzeService:
    """
    Сервис для анализа временного ряда
    """

    async def analyze_binary(
        self,
        time_series: time_series_dto.TimeSeriesDTO,
        session_id: uuid.UUID
    ) -> broker_message_dto.BrokerMessageDTO:
        """
        Выполнить анализ временного ряда для бинарной классификации
        :param time_series: временной ряд
        :param session_id: идентификатор сессии
        :return: сообщение об успешности анализа
        """

        analyze_data = time_series_dto.DiagnosticResultDTO(
            is_success=False,
            dots=[],
            analyze_properties=time_series_dto.AnalyzePropertiesDTO()
        )

        try:
            if ai_model.binary_model is None:
                with open(Path("tests/test-data-binary.txt"), "r", encoding="utf-8") as file:
                    file_content = file.read()
                    analyze_data = time_series_dto.DiagnosticResultDTO(
                        is_success=True,
                        analyze_properties=time_series_dto.AnalyzePropertiesDTO(),
                        **json.loads(file_content)
                    )
            else:
                ...


        except Exception as e:
            logger.error(f"Произошла ошибка во время анализа: {e}")

        return broker_message_dto.BrokerMessageDTO(
            id=session_id,
            body=analyze_data.model_dump(by_alias=True),
            date=datetime.datetime.now()
        )

    async def analyze_useful_data(
        self,
        time_series: time_series_dto.TimeSeriesDTO,
        session_id: uuid.UUID
    ) -> broker_message_dto.BrokerMessageDTO:
        """
        Выполнить анализ временного ряда для нахождения полезных данных
        :param time_series: временной ряд
        :param session_id: идентификатор сессии
        :return: сообщение об успешности анализа
        """

        analyze_data = time_series_dto.UsefulDataResultDTO(
            is_success=False,
            dots=[],
            analyze_properties={}
        )

        try:
            if ai_model.useful_data_model is None:
                with open(Path("tests/test-data-useful-data.txt"), "r", encoding="utf-8") as file:
                    file_content = file.read()
                    analyze_data = time_series_dto.UsefulDataResultDTO(
                        is_success=True,
                        analyze_properties={},
                        **json.loads(file_content)
                    )
            else:
                ...


        except Exception as e:
            logger.error(f"Произошла ошибка во время анализа: {e}")

        return broker_message_dto.BrokerMessageDTO(
            id=session_id,
            body=analyze_data.model_dump(by_alias=True),
            date=datetime.datetime.now()
        )
