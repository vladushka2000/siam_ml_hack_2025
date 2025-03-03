# thirdparty
from dependency_injector import containers, providers

# project
from services import analyze_service


class ServiceContainer(containers.DeclarativeContainer):
    """
    DI-контейнер с провайдерами для работы с сервисами
    """

    wiring_config = containers.WiringConfiguration(modules=["api.broker_api"])

    analyze_service = providers.Factory(analyze_service.AnalyzeService)
