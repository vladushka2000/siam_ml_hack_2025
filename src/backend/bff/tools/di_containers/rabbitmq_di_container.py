from brokers.rabbitmq import connection_proxy, consumer, producer, routing_configurator
from dependency_injector import containers, providers


class ConsumerContainer(containers.DeclarativeContainer):
    """
    DI-контейнер с провадйерами для консюмера
    """

    wiring_config = containers.WiringConfiguration(modules=["services.analyze_service"])
    connection = providers.Singleton(connection_proxy.AsyncRMQConnectionProxy)
    consumer = providers.Factory(consumer.RabbitMQConsumer, connection)


class ProducerContainer(containers.DeclarativeContainer):
    """
    DI-контейнер с провадйерами для продюсера
    """

    wiring_config = containers.WiringConfiguration(modules=["services.analyze_service"])
    connection = providers.Singleton(connection_proxy.AsyncRMQConnectionProxy)
    route_builder = providers.Factory(routing_configurator.RoutingBuilder)
    route_configurator = providers.Factory(routing_configurator.RoutingConfigurator, route_builder)
    producer = providers.Singleton(producer.RabbitMQProducer, connection, route_configurator)
