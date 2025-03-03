import json
import logging

from dependency_injector.wiring import inject, Provide

from config import rabbitmq_config
from interfaces import base_message_broker
from models.dto.broker_message_dto import BrokerMessageDTO
from models.dto.time_series_dto import TimeSeriesDTO
from tools.di_containers import service_container

config = rabbitmq_config.config
logger = logging.getLogger(__name__)


@inject
async def consume(
    consumer: base_message_broker.BaseConsumer,
    producer: base_message_broker.BaseProducer,
    service = Provide[service_container.ServiceContainer.analyze_service]
) -> None:
    """
    Слушать события в брокере
    :param consumer: консюмер команд на расчет
    :param producer: продюсер событий о конце расчета
    :param service: сервис расчета
    """

    logger.info("Прослушивание очереди сообщений")

    try:
        message = await consumer.retrieve(config.queue)
        logger.info("Сообщение получено")

        data = BrokerMessageDTO(
            id=message.id,
            body=message.body,
            date=message.date
        )

        time_series = TimeSeriesDTO(**data.body)

        return_message = await service.analyze(time_series, data.id)

        await producer.produce(config.exchange, f"session_id_key: {data.id}", return_message)
    except Exception as e:
        logger.error(f"Произошла ошибка: {str(e)}")
