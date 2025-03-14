import aio_pika

from config import rabbitmq_config
from interfaces import (
    base_message_broker,
    base_proxy,
    base_rabbitmq_routing_configurator as routing_configurator
)
from models.dto import broker_message_dto

config = rabbitmq_config.config


class RabbitMQProducer(base_message_broker.BaseProducer):
    def __init__(
        self,
        connection_proxy: base_proxy.ConnectionProxy,
        routing_configurator_: routing_configurator.BaseRoutingConfigurator,
        model_type: type[broker_message_dto.BrokerMessageDTO] = broker_message_dto.BrokerMessageDTO,
    ) -> None:
        """
        Инициализировать переменные
        :param connection_proxy: прокси-объект соединения
        :param routing_configurator_: конфигуратор маршрутизации сообщений
        :param model_type: тип сообщения
        """

        self._connection_proxy = connection_proxy
        self._routing_configurator = routing_configurator_
        self._model_type = model_type
        self._channel: aio_pika.abc.AbstractRobustChannel | None = None

    async def produce(
        self, exchange_name: str, routing_key: str, message: broker_message_dto.BrokerMessageDTO
    ) -> None:
        """
        Отправить сообщение в обменник
        :param exchange_name: название обменника
        :param routing_key: ключ маршрутизации
        :param message: сообщение
        """

        if not isinstance(message, self._model_type):
            raise ValueError("Несоответствие типа сообщения; сообщение не отправлено")

        connection = await self._connection_proxy.connect(self)

        if self._channel is None:
            self._channel = await connection.channel()

        await self._routing_configurator.configure_routes(self._channel)
        await self._routing_configurator.add_session_queue(self._channel, message.id)

        message = aio_pika.Message(message.model_dump_json(by_alias=True).encode("utf-8"))
        exchange = await self._channel.get_exchange(exchange_name)

        await exchange.publish(message, routing_key)

    async def disconnect(self) -> any:
        """
        Разорвать соединение с брокером
        """

        if self._channel:
            await self._channel.close()

        await self._connection_proxy.disconnect(self)
