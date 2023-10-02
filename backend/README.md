</p>
<h1>SPARCS Events API</h1>
<p>A serverless REST API implemented with Clean Architecture and Domain Driven Design</p>

## Architecture

This project follows the [clean architecture style](http://blog.thedigitalcatonline.com/blog/2016/11/14/clean-architectures-in-python-a-step-by-step-example/) and structured the codebase accordingly.

![cleanArchitecture image](https://cdn-images-1.medium.com/max/1600/1*B7LkQDyDqLN3rRSrNYkETA.jpeg)

_Image credit to [Thang Chung under MIT terms](https://github.com/thangchung/blog-core)_

Most important rule:
> Source code dependencies can only point inward. Nothing in an inner circle can know anything about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in the inner circle. That includes functions and classes. variables, or any other named software entity.


## Setup Local
## Run:
1. Make sure you have Python 3.8 installed
2.
```shell
pip install pipenv==2023.5.19 --user
```
3.
```shell
pipenv install
```
4.
```shell
pipenv shell
```

## Run Local

```

uvicorn main:app --reload --log-level debug --env-file .env

```


## Deploy to AWS Lambda

### Install serverless framework

```
npm install -g serverless
```

### Install serverless plugins

```
npm install
```

### Deploy it

```
serverless deploy --stage 'dev' --aws-profile 'default'
```

### Resources
- https://fastapi.tiangolo.com/
- https://www.serverless.com/framework/docs
- https://react.dev/reference/react
- https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html
