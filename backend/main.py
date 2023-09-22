import lambdawarmer
import os
from fastapi import FastAPI, APIRouter
from fastapi.responses import HTMLResponse
from mangum import Mangum

STAGE = os.environ.get('STAGE')
root_path = '/' if not STAGE else f'/{STAGE}'

app = FastAPI(
    root_path=root_path,
    title="PWA Serverless Demo",
    contact={
        "name": "Arnel Jan Sarmiento",
        "email": "rneljan@gmail.com",
    },
)
mangum_handler = Mangum(app, lifespan='off')

router = APIRouter(
    prefix="/user",
    tags=["User"],
    redirect_slashes=True,
)


@app.get("/", include_in_schema=False)
def welcome():
    html_content = """
    <html>
        <head>
            <title>Welcome to my Demo</title>
        </head>
        <body>
            <h1>Welcome to my Demo</h1>
        </body>
    </html>
    """
    return HTMLResponse(content=html_content, status_code=200)


@router.get(
    "/{name}",
    status_code=200,
    response_model=dict,
    summary="Hello API",
)
def hello_api(name: str = 'World'):
    return {"hello": name}


app.include_router(router)


@lambdawarmer.warmer
def handler(event, context):
    return mangum_handler(event, context)
