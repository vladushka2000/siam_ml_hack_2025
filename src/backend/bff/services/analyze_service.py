import asyncio
import json
import logging
import uuid

from dependency_injector.wiring import Provide, inject

from config import rabbitmq_config
from interfaces import base_message_broker
from models.dto import broker_message_dto, diagnostic_time_series_dto
from tools.di_containers import rabbitmq_di_container

config = rabbitmq_config.config
logger = logging.getLogger(__name__)


class AnalyzeService:
    """
    Сервис для анализа временного ряда
    """

    @inject
    async def analyze_binary(
        self,
        time_series: diagnostic_time_series_dto.DiagnosticTimeSeries,
        session_id: uuid.UUID,
        producer: base_message_broker.BaseProducer = Provide[rabbitmq_di_container.ProducerContainer.producer]
    ) -> None:
        """
        Начать анализ временного ряда для бинарной классификации
        :param time_series: временной ряд
        :param session_id: идентификатор сессии
        :param producer: продюсер сообщений для анализа
        """

        analyze_message = broker_message_dto.BrokerMessageDTO(
            id=session_id,
            body=time_series.model_dump()
        )

        await producer.produce(config.exchange, config.routing_key, analyze_message)

        logger.info(f"Сообщение {analyze_message.id} отправлено в очередь")

    @inject
    async def analyze_useful_data(
        self,
        time_series: diagnostic_time_series_dto.UsefulDataTimeSeries,
        session_id: uuid.UUID,
        producer: base_message_broker.BaseProducer = Provide[rabbitmq_di_container.ProducerContainer.producer]
    ) -> None:
        """
        Начать анализ временного ряда для поиска полезной информации
        :param time_series: временной ряд
        :param session_id: идентификатор сессии
        :param producer: продюсер сообщений для анализа
        """

        analyze_message = broker_message_dto.BrokerMessageDTO(
            id=session_id,
            body=time_series.model_dump()
        )

        await producer.produce(config.exchange, config.routing_key, analyze_message)

        logger.info(f"Сообщение {analyze_message.id} отправлено в очередь")

    @inject
    async def subscribe_to_rabbitmq(
        self,
        session_id: uuid.UUID,
        consumer: base_message_broker.BaseConsumer = Provide[
            rabbitmq_di_container.ConsumerContainer.consumer
        ]
    ) -> str:
        """
        Подписаться на канал RabbitMQ
        :param session_id: идентификатор канала
        :param consumer: консюмер RabbitMQ
        :return: информация об анализе временного ряда
        """

        while True:
            try:
                message = await consumer.retrieve(f"session_id: {session_id}")

                if message:
                    await consumer.disconnect()

                    yield f"data: {json.dumps(message.body)}\n\n"
            except Exception as e:
                await asyncio.sleep(5)

                yield "data: {}\n\n"
