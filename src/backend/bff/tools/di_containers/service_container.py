from dependency_injector import containers, providers

from services import analyze_service


class ServiceContainer(containers.DeclarativeContainer):
    """
    DI-контейнер с провайдерами для работы с сервисами
    """

    wiring_config = containers.WiringConfiguration(modules=["web.entrypoints.well_test_entrypoint"])

    analyze_service = providers.Factory(analyze_service.AnalyzeService)
