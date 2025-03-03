import fastapi
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from config import app_config, uvicorn_config
from tools.di_containers import rabbitmq_di_container, service_container
from web.middlewares import logger_middleware
from web.tools import router_registrator

app_config = app_config.app_config

rabbitmq_consumer_di = rabbitmq_di_container.ConsumerContainer()
rabbitmq_producer_di = rabbitmq_di_container.ProducerContainer()
service_di = service_container.ServiceContainer()


def create_app() -> fastapi.FastAPI:
    """
    Инициализировать приложение FastAPI
    """

    fastapi_app = fastapi.FastAPI(
        title=app_config.project_name,
        version=app_config.app_version,
        debug=True if app_config.okd_stage == "DEV" else False,
        default_response_class=fastapi.responses.JSONResponse,
    )

    return fastapi_app


app = create_app()
router_registrator.register_routers(app)

origins = ["*"]

app.add_middleware(logger_middleware.LogRequestInfoMiddleware)
app.add_middleware(logger_middleware.SetRequestContextMiddleware)

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run("main:app", **uvicorn_config.uvicorn_config)
