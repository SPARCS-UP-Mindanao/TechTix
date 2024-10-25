import csv
import re
from enum import Enum
from http import HTTPStatus
from typing import Optional, Tuple

import ulid
from model.preregistrations.preregistration import PreRegistrationIn
from pydantic import BaseModel, EmailStr, Field, ValidationError, validator
from repository.preregistrations_repository import PreRegistrationsRepository
from utils.logger import logger


class CareerStatus(str, Enum):
    STUDENT = 'Student'
    WORKING_STUDENT = 'Working Student'
    WORKING_PROFESSIONAL = 'Working Professional'
    ENTREPRENEUR = 'Entrepreneur'


class DeveloperStatus(str, Enum):
    DEVELOPER = 'Developer'
    NON_DEVELOPER = 'Non-developer'


class LevelOfExperience(str, Enum):
    BEGINNER = 'Beginner'
    INTERMEDIATE = 'Intermediate'
    ADVANCED = 'Advanced'


class DevFestColumns:
    TIMESTAMP = 'Timestamp'
    EMAIL = 'Username'
    NAME = 'Name'
    PHONE_NUMBER = 'Phone number'
    CAREER_STATUS = 'Which of the options best describe you?'
    DEVELOPER_STATUS = 'Are you a'
    JOB_TITLE = 'Job title'
    LEVEL_OF_EXPERIENCE = 'Level of expertise'
    COMPANY_AFFILIATION = 'Company or affiliation'
    GENDER = 'Gender'
    WHY_INTERESTED_IN_DEVFEST = 'Why are you interested in joining DevFest Davao 2024?'
    HOW_DID_YOU_LEARN_ABOUT_DEVFEST = 'How did you learn about the event?'
    INTEREST_IN_JOINING_AI_WORKSHOP = 'Are you interested in joining an AI/ML (Machine Learning) hands-on workshop?'
    PREFERRED_SOCIAL_MEDIA = (
        'When it comes to joining a group chat community, which social media platform/s would you prefer?'
    )
    PROCESSING_OF_PERSONAL_DATA = 'I hereby consent to the processing of the personal data that I have provided and declare my agreement with the data protection regulations in the data privacy statement.'


class DevFestPreRegistrationSchema(BaseModel):
    timestamp: str = Field(title=DevFestColumns.TIMESTAMP)
    email: EmailStr = Field(None, title=DevFestColumns.EMAIL)
    name: str = Field(None, title=DevFestColumns.NAME)
    phone_number: str = Field(
        None,
        title=DevFestColumns.PHONE_NUMBER,
        regex=r'^(09)\d{9}$',  # Philippine mobile number
    )
    career_status: Optional[CareerStatus] = Field(None, title=DevFestColumns.CAREER_STATUS)
    developer_status: Optional[DeveloperStatus] = Field(None, title=DevFestColumns.DEVELOPER_STATUS)
    job_title: Optional[str] = Field(None, title=DevFestColumns.JOB_TITLE)
    level_of_experience: Optional[LevelOfExperience] = Field(None, title=DevFestColumns.LEVEL_OF_EXPERIENCE)
    company_affiliation: Optional[str] = Field(None, title=DevFestColumns.COMPANY_AFFILIATION)
    gender: Optional[str] = Field(None, title=DevFestColumns.GENDER)
    why_interested_in_devfest: Optional[str] = Field(None, title=DevFestColumns.WHY_INTERESTED_IN_DEVFEST)
    how_did_you_learn_about_devfest: Optional[str] = Field(None, title=DevFestColumns.HOW_DID_YOU_LEARN_ABOUT_DEVFEST)
    interest_in_joining_ai_workshop: Optional[bool] = Field(None, title=DevFestColumns.INTEREST_IN_JOINING_AI_WORKSHOP)
    preferred_social_media: Optional[str] = Field(None, title=DevFestColumns.PREFERRED_SOCIAL_MEDIA)
    processing_of_personal_data: Optional[str] = Field(None, title=DevFestColumns.PROCESSING_OF_PERSONAL_DATA)

    # Pre-process phone number to remove non-numeric characters
    @validator('phone_number', pre=True)
    def strip_and_clean_phone_number(cls, value):
        if value is None or value == '':
            return None

        value = re.sub(r'\D', '', value)

        return value


def separate_first_and_last_name(name: str) -> Tuple[str, str]:
    name_parts = name.split()

    if len(name_parts) > 2:
        first_name = ' '.join(name_parts[:-2] + [name_parts[-2] if len(name_parts[-2]) > 2 else '']).strip()
    else:
        first_name = name_parts[0]

    last_name = name_parts[-1] if len(name_parts) > 1 else 'N/A'

    return first_name, last_name


# TODO: Refactoring
def import_pre_registration_from_csv(csv_file_path: str = 'input.csv', eventId: str = None) -> None:
    with open(csv_file_path, mode='r') as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)

        for line in csv_reader:
            # Dictionary mapping of CSV columns to DevFestPreRegistrationSchema fields
            pre_registration_data = {
                'timestamp': line[headers.index(DevFestColumns.TIMESTAMP)],
                'email': line[headers.index(DevFestColumns.EMAIL)],
                'name': line[headers.index(DevFestColumns.NAME)],
                'phone_number': line[headers.index(DevFestColumns.PHONE_NUMBER)].strip(),
                'career_status': line[headers.index(DevFestColumns.CAREER_STATUS)],
                'developer_status': line[headers.index(DevFestColumns.DEVELOPER_STATUS)],
                'job_title': line[headers.index(DevFestColumns.JOB_TITLE)],
                'level_of_experience': line[headers.index(DevFestColumns.LEVEL_OF_EXPERIENCE)],
                'company_affiliation': line[headers.index(DevFestColumns.COMPANY_AFFILIATION)],
                'gender': line[headers.index(DevFestColumns.GENDER)],
                'why_interested_in_devfest': line[headers.index(DevFestColumns.WHY_INTERESTED_IN_DEVFEST)],
                'how_did_you_learn_about_devfest': line[headers.index(DevFestColumns.HOW_DID_YOU_LEARN_ABOUT_DEVFEST)],
                'interest_in_joining_ai_workshop': bool(
                    line[headers.index(DevFestColumns.INTEREST_IN_JOINING_AI_WORKSHOP)]
                ),
                'preferred_social_media': line[headers.index(DevFestColumns.PREFERRED_SOCIAL_MEDIA)],
                'processing_of_personal_data': line[headers.index(DevFestColumns.PROCESSING_OF_PERSONAL_DATA)],
            }

            try:
                pre_registration_csv_data = DevFestPreRegistrationSchema(**pre_registration_data)

                first_name, last_name = separate_first_and_last_name(pre_registration_csv_data.name)

                preregistration_in = PreRegistrationIn(
                    email=pre_registration_csv_data.email,
                    firstName=first_name,
                    lastName=last_name,
                    contactNumber=pre_registration_csv_data.phone_number,
                    careerStatus=pre_registration_csv_data.career_status,
                    yearsOfExperience=pre_registration_csv_data.level_of_experience,
                    organization=pre_registration_csv_data.company_affiliation,
                    title=pre_registration_csv_data.job_title,
                    eventId=eventId,
                )

                preregistrations_repository = PreRegistrationsRepository()
                preregistration_id = ulid.ulid()

                (
                    status,
                    preregistration,
                    message,
                ) = preregistrations_repository.store_preregistration(
                    preregistration_in=preregistration_in,
                    preregistration_id=preregistration_id,
                )

                if status != HTTPStatus.OK:
                    logger.error(f'Error storing preregistration: {message}')
                    continue

                else:
                    logger.info(f'Successfully stored preregistration: {preregistration}')

            except ValidationError as e:
                logger.error(f'Validation error for row: {line}\n{e.errors()}')
            # continue
