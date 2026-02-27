import argparse
import os
from enum import Enum

import boto3
from botocore.exceptions import ClientError


class Environments(str, Enum):
    DEV = 'dev'
    PROD = 'prod'
    LOCAL = 'local'
    TEST = 'test'


class ConfigAssembler:
    """
    Assembles the TechTix (Backend) config file
    """

    def __init__(self, aws_region='ap-southeast-1', environment=Environments.DEV.value):
        self.__input_environment = environment
        self.__project_name = 'sparcs-events'

        # Determine the deployment stage, defaulting to 'dev' for None or 'local' environments
        if not self.__input_environment or self.__input_environment == Environments.LOCAL.value:
            self.__stage = Environments.DEV.value
        else:
            self.__stage = self.__input_environment

        self.__region = 'ap-southeast-1' if aws_region is None else aws_region
        self.__ssm_client = boto3.client('ssm', region_name=self.__region)
        self.__secrets_client = boto3.client('secretsmanager', region_name=self.__region)
        self.__base_dir = os.getcwd()

    def __get_parameter(self, key, decrypt=False) -> str:
        """
        Retrieves parameter values from SSM

        :param key: key of parameter value to be retrieved
        :param decrypt: flag if value is decrypted
        :return: parameter value string
        """
        kwargs = {'Name': key, 'WithDecryption': decrypt}
        value = ''
        try:
            resp = self.__ssm_client.get_parameter(**kwargs)
        except ClientError as e:
            print(f'Error: {e.response["Error"]["Code"]} - {key}')
        else:
            value = resp['Parameter']['Value']
        return value

    def __get_secret(self, secret_arn) -> str:
        """
        Retrieves secret value from AWS Secrets Manager

        :param secret_arn: ARN of the secret to retrieve
        :return: secret value string
        """
        try:
            resp = self.__secrets_client.get_secret_value(SecretId=secret_arn)
            return resp['SecretString']
        except ClientError as e:
            print(f'Error retrieving secret: {e.response["Error"]["Code"]} - {secret_arn}')
            return ''

    @staticmethod
    def escape_env_value(value: str) -> str:
        return value.replace('$', '$$')

    @staticmethod
    def write_config(file_handle, key, value) -> None:
        """
        Writes specified config key-value in the config file

        :param file_handle: File pointer
        :param key: key of config
        :param value: value of config
        :return: None
        """
        entry = f'{key}={ConfigAssembler.escape_env_value(str(value))}\n'
        file_handle.write(entry)

    def construct_config_file(self) -> None:
        """
        Constructs the config file for Helix

        :return: None
        """
        
        region = 'ap-southeast-1'
        stage = self.__stage
        events_table = f"{stage}-sparcs-events"

        entities_table = self.__get_parameter(f"/{stage}-sparcs-events-entities")
        registrations_table = self.__get_parameter(f"/{stage}-sparcs-events-registrations")
        preregistrations_table = self.__get_parameter(f"/{stage}-sparcs-events-preregistrations")
        evaluations_table = self.__get_parameter(f"/{stage}-sparcs-events-evaluations")
        email_queue = self.__get_parameter(f"/sparcs-events-email-queue-url-{stage}")
        certificate_queue = self.__get_parameter(f"/sparcs-events-certificate-queue-url-{stage}")
        s3_bucket = self.__get_parameter(f"/{stage}-sparcs-events-file-bucket")
        
        userpool_id = self.__get_parameter(f"/techtix/cognito-user-pool-id-{stage}")
        userpool_client_id = self.__get_parameter(f"/techtix/cognito-user-pool-client-id-{stage}")

        if self.__input_environment == Environments.LOCAL.value or stage == Environments.LOCAL.value:
            frontend_url = 'http://localhost:5173'
        else:
            frontend_url = self.__get_parameter(f"/techtix/frontend-url-{stage}")

        # Determine if this is a local environment
        is_local = (
            self.__input_environment == Environments.LOCAL.value
            or self.__input_environment == Environments.TEST.value
        )

        config_file = f'{self.__base_dir}/.env'

        with open(config_file, 'w', encoding='utf-8') as file_handle:
            self.write_config(file_handle, 'REGION', region)
            self.write_config(file_handle, 'FRONTEND_URL', frontend_url)
            self.write_config(file_handle, 'ENTITIES_TABLE', entities_table)
            self.write_config(file_handle, 'REGISTRATIONS_TABLE', registrations_table)
            self.write_config(file_handle, 'PREREGISTRATIONS_TABLE', preregistrations_table)
            self.write_config(file_handle, 'EVALUATIONS_TABLE', evaluations_table)
            self.write_config(file_handle, 'EVENTS_TABLE', events_table)
            self.write_config(file_handle, 'EMAIL_QUEUE', email_queue)
            self.write_config(file_handle, 'CERTIFICATE_QUEUE', certificate_queue)
            self.write_config(file_handle, 'S3_BUCKET', s3_bucket)
            self.write_config(file_handle, 'USER_POOL_ID', userpool_id)
            self.write_config(file_handle, 'USER_POOL_CLIENT_ID', userpool_client_id)
            self.write_config(file_handle, 'STAGE', stage)

        print(f'Configuration file created successfully at: {config_file}')


if __name__ == '__main__':
    print(Environments)
    parser = argparse.ArgumentParser(description='TechTix (Backend) Configuration Assembler')
    parser.add_argument('-r', '--region', help='AWS Region (default: ap-southeast-1)')
    parser.add_argument('-s', '--stage', help='Environment Name (default: dev)')
    args = parser.parse_args()

    print('Arguments:', args)
    region = args.region
    input_stage = args.stage

    config_assembler = ConfigAssembler(region, input_stage)
    config_assembler.construct_config_file()