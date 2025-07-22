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
   - Ensure Python 3.11 is installed

2. **Install uv**
   ```shell
   # Follow installation guide: https://docs.astral.sh/uv/getting-started/installation/
   ```

3. **Create virtual environment**
   ```shell
   uv venv
   ```

4. **Install dependencies**
   ```shell
   uv sync
   ```

5. **Activate environment**
   ```shell
   # Windows
   .venv\Scripts\activate
   
   # Linux/Mac
   source .venv/bin/activate
   ```

6. **Add environment variables**
   - Place the provided `.env` file in the `backend` directory

## Run Locally

1. **Activate Virtual Environment:**
   ```shell
   source .venv/bin/activate
   ```

2. **Start Local Server:**
   ```shell
   uvicorn main:app --reload --log-level debug --env-file .env
   ```

## Setup AWS CLI
1. **Download and Install AWS CLI:**
   - [AWS CLI Installation Guide](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
2. **Configure SSO Login:**
   ```shell
   aws configure sso --profile <profile-name>
   ```
   - Enter SSO Session Name (could be same as `<profile-name>`)
   - Enter SSO Start URL: `https://durianpy-root.awsapps.com/start/#`
   - Enter SSO region: `ap-southeast-1`
   - Enter Default client Region: `ap-southeast-1`
   - Leave blank for `SSO registration scopes` and `CLI default output format`
3. **Verify login:**
   ```shell
   aws sts get-caller-identity --profile <profile-name>
   ```
4. **SSO Login:**
   ```shell
   aws sso login --profile <profile-name>
   ```

## Setup Serverless Framework
1. **Prerequisites:**
   - Node.js 14 or later
2. **Install Serverless Framework:**
   ```shell
   npm install --save-dev serverless@3
   ```
3. **Install dependencies:**
   ```shell
   npm install
   ```
4. **Install plugins:**
   ```shell
   sls plugin install -n serverless-python-requirements serverless-better-credentials
   ```

## Deploy to AWS
1. **Setup Docker (Non-Linux users only):**
   - [Docker Installation Guide](https://docs.docker.com/engine/install)
   - Ensure Docker is running
2. **Activate virtual environment:**
   ```shell
   # Linux/Mac
   source .venv/bin/activate
   
   # Windows
   .venv\Scripts\activate
   ```
3. **Deploy:**
   ```shell
   AWS_SDK_LOAD_CONFIG=1 sls deploy --stage dev --aws-profile <profile-name> --verbose
   ```

## Docstrings
1. There are many Python docstring formats, but reStructuredText (reST) is recommended by the PEP 287.
2. Read more here. [reStructuredText (reST)](http://daouzli.com/blog/docstring.html#restructuredtext)
3. Code Sample
   ```python
   def add_numbers(a, b):
       """
       Adds two numbers together.

       :param a: The first number to add.
       :type a: int or float

       :param b: The second number to add.
       :type b: int or float

       :return: The sum of `a` and `b`.
       :rtype: int or float
       """

       return a + b
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
