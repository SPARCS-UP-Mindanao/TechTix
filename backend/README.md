# SPARCS Events API

A serverless REST API implemented with Clean Architecture and Domain Driven Design.

## Architecture

This project follows the [clean architecture style](http://blog.thedigitalcatonline.com/blog/2016/11/14/clean-architectures-in-python-a-step-by-step-example/) and has structured the codebase accordingly.

![cleanArchitecture image](https://cdn-images-1.medium.com/max/1600/1*B7LkQDyDqLN3rRSrNYkETA.jpeg)

_Image credit to [Thang Chung under MIT terms](https://github.com/thangchung/blog-core)_

### Most Important Rule:

> Source code dependencies can only point inward. Nothing in an inner circle can know anything about something in an outer circle. In particular, the name of something declared in an outer circle must not be mentioned by the code in an inner circle. That includes functions and classes, variables, or any other named software entity.

## Setup Local Environment

1. **Pre-requisites:**
   - Ensure Python 3.8 is installed

2. **Install pipenv:**
   ```shell
   pip install pipenv==2023.4.29 --user
   ```

3. **Install Python Dependencies:**
   ```shell
   pipenv install
   ```

4. **Activate Virtual Environment:**
   ```shell
   pipenv shell
   ```

5. **Add Environment Variables:**
    -  Add the `.env` file provided to you in the `backend` directory

## Run Locally

1. **Activate Virtual Environment:**
   ```shell
   pipenv shell
   ```

2. **Start Local Server:**
   ```shell
   uvicorn main:app --reload --log-level debug --env-file .env
   ```

## Setup AWS CLI

1. **Download and Install AWS CLI:**
   - [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

2. **Create AWS Profile:**
   ```shell
   aws configure --profile sparcs
   ```

   - **Input your AWS Access Key ID and AWS Secret Access Key provided to you.**
   - **Input `ap-southeast-1` for the default region name.**
   - **Leave blank for the default output format.**


## Setup Serverless Framework

1. **Pre-requisites:**
   - Ensure `Node 14` or later is installed

2. **Install serverless framework:**
   ```shell
   npm install -g serverless
   ```

3. **Install serverless plugins:**
   ```shell
   npm install
   ```

3. **Install Python Requirements Plugin:**
   ```shell
   sls plugin install -n serverless-python-requirements
   ```

## Deploy to AWS
1. Setup Docker (Only for Non-Linux Users)
   - [Docker Installation Guide](https://docs.docker.com/engine/install)
   - Make sure Docker is Running on your Machine
2.
   ```shell
   pipenv shell
   ```
3.
   ```shell
   serverless deploy --stage 'dev' --aws-profile 'sparcs' --verbose
   ```

## Format Checking
We now use Pre-commit for enforcing code formatting and linting. It runs our formatting libraries before the code is committed. This ensures that the code is always formatted and linted before it is added to the codebase.

To install pre-commit, run the following command:
```shell
pip install pre-commit
```

To manually run pre-commit, run the following command:
```shell
pre-commit run --all-files
```

## Resources

- [FastAPI](https://fastapi.tiangolo.com/)
- [Serverless Framework Documentation](https://www.serverless.com/framework/docs)
- [Clean Coder Blog](https://blog.cleancoder.com/uncle-bob/2012/08/13/the-clean-architecture.html)
