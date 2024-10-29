import csv
import re
from enum import Enum
from typing import Optional, Tuple
from datetime import datetime

import pytz
import ulid
from model.preregistrations.preregistrations_constants import AcceptanceStatus
from constants.common_constants import EntryStatus
from model.preregistrations.preregistration import PreRegistrationIn, PreRegistration
from pydantic import BaseModel, EmailStr, Field, validator


class CareerStatus(str, Enum):
    STUDENT = "Student"
    WORKING_STUDENT = "Working Student"
    WORKING_PROFESSIONAL = "Working Professional"
    ENTREPRENEUR = "Entrepreneur"


class DeveloperStatus(str, Enum):
    DEVELOPER = "Developer"
    NON_DEVELOPER = "Non-developer"


class LevelOfExperience(str, Enum):
    BEGINNER = "Beginner"
    INTERMEDIATE = "Intermediate"
    ADVANCED = "Advanced"


class DevFestColumns:
    TIMESTAMP = "Timestamp"
    EMAIL = "Username"
    NAME = "Name"
    PHONE_NUMBER = "Phone number"
    CAREER_STATUS = "Which of the options best describe you?"
    DEVELOPER_STATUS = "Are you a"
    JOB_TITLE = "Job title"
    LEVEL_OF_EXPERIENCE = "Level of expertise"
    COMPANY_AFFILIATION = "Company or affiliation"
    GENDER = "Gender"
    WHY_INTERESTED_IN_DEVFEST = "Why are you interested in joining DevFest Davao 2024?"
    HOW_DID_YOU_LEARN_ABOUT_DEVFEST = "How did you learn about the event?"
    INTEREST_IN_JOINING_AI_WORKSHOP = (
        "Are you interested in joining an AI/ML (Machine Learning) hands-on workshop?"
    )
    PREFERRED_SOCIAL_MEDIA = "When it comes to joining a group chat community, which social media platform/s would you prefer?"
    PROCESSING_OF_PERSONAL_DATA = "I hereby consent to the processing of the personal data that I have provided and declare my agreement with the data protection regulations in the data privacy statement."


class DevFestPreRegistrationSchema(BaseModel):
    timestamp: str = Field(title=DevFestColumns.TIMESTAMP)
    email: EmailStr = Field(None, title=DevFestColumns.EMAIL)
    name: str = Field(None, title=DevFestColumns.NAME)
    phone_number: str = Field(
        None,
        title=DevFestColumns.PHONE_NUMBER,
        regex=r"^(09)\d{9}$",  # Philippine mobile number
    )
    career_status: Optional[CareerStatus] = Field(
        None, title=DevFestColumns.CAREER_STATUS
    )
    developer_status: Optional[DeveloperStatus] = Field(
        None, title=DevFestColumns.DEVELOPER_STATUS
    )
    job_title: Optional[str] = Field(None, title=DevFestColumns.JOB_TITLE)
    level_of_experience: Optional[LevelOfExperience] = Field(
        None, title=DevFestColumns.LEVEL_OF_EXPERIENCE
    )
    company_affiliation: Optional[str] = Field(
        None, title=DevFestColumns.COMPANY_AFFILIATION
    )
    gender: Optional[str] = Field(None, title=DevFestColumns.GENDER)
    why_interested_in_devfest: Optional[str] = Field(
        None, title=DevFestColumns.WHY_INTERESTED_IN_DEVFEST
    )
    how_did_you_learn_about_devfest: Optional[str] = Field(
        None, title=DevFestColumns.HOW_DID_YOU_LEARN_ABOUT_DEVFEST
    )
    interest_in_joining_ai_workshop: Optional[bool] = Field(
        None, title=DevFestColumns.INTEREST_IN_JOINING_AI_WORKSHOP
    )
    preferred_social_media: Optional[str] = Field(
        None, title=DevFestColumns.PREFERRED_SOCIAL_MEDIA
    )
    processing_of_personal_data: Optional[str] = Field(
        None, title=DevFestColumns.PROCESSING_OF_PERSONAL_DATA
    )

    @validator("phone_number", pre=True)
    def strip_and_clean_phone_number(cls, value):
        """Strip and clean phone number to remove non-numeric characters before validation.

        :param value: Phone number string.
        :type value: str

        :return: Cleaned phone number string.
        :rtype: str
        """
        if value is None or value == "":
            return None

        value = re.sub(r"\D", "", value)

        return value


def separate_first_and_last_name(name: str) -> Tuple[str, str]:
    """Separate first and last name from a full name string, excluding any middle initials.

    The last name is assumed to be the last word in the full name string, while the first name
    consists of all preceding words before the last name.

    :param name: Full name string.
    :type name: str

    :return: A tuple containing the first name and last name.
    :rtype: Tuple[str, str]

    Examples:
        >>> separate_first_and_last_name("John Doe")
        ('John', 'Doe')

        >>> separate_first_and_last_name("Juan Manuel C. Cruz")
        ('Juan Manuel', 'Cruz')
    """

    name_parts = name.split()

    if len(name_parts) > 2:
        first_name = " ".join(
            name_parts[:-2] + [name_parts[-2] if len(name_parts[-2]) > 2 else ""]
        ).strip()
    else:
        first_name = name_parts[0]

    last_name = name_parts[-1] if len(name_parts) > 1 else "N/A"

    return first_name, last_name


def import_pre_registration_from_csv(
    eventId: str, csv_file_path: str = "input.csv"
) -> None:
    """Import pre-registration data from a CSV file to a PreRegistration table.

    :param eventId: Event ID.
    :type eventId: str

    :param csv_file_path: Path to the CSV file containing pre-registration data.
    :type csv_file_path: str

    :return: None
    :rtype: None
    """

    with open(csv_file_path, mode="r") as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)
        pre_registration_data_rows: list[DevFestPreRegistrationSchema] = []

        for line in csv_reader:
            # Dictionary mapping of CSV columns to DevFestPreRegistrationSchema fields
            pre_registration_data = {
                "timestamp": line[headers.index(DevFestColumns.TIMESTAMP)],
                "email": line[headers.index(DevFestColumns.EMAIL)],
                "name": line[headers.index(DevFestColumns.NAME)],
                "phone_number": line[
                    headers.index(DevFestColumns.PHONE_NUMBER)
                ].strip(),
                "career_status": line[headers.index(DevFestColumns.CAREER_STATUS)],
                "developer_status": line[
                    headers.index(DevFestColumns.DEVELOPER_STATUS)
                ],
                "job_title": line[headers.index(DevFestColumns.JOB_TITLE)],
                "level_of_experience": line[
                    headers.index(DevFestColumns.LEVEL_OF_EXPERIENCE)
                ],
                "company_affiliation": line[
                    headers.index(DevFestColumns.COMPANY_AFFILIATION)
                ],
                "gender": line[headers.index(DevFestColumns.GENDER)],
                "why_interested_in_devfest": line[
                    headers.index(DevFestColumns.WHY_INTERESTED_IN_DEVFEST)
                ],
                "how_did_you_learn_about_devfest": line[
                    headers.index(DevFestColumns.HOW_DID_YOU_LEARN_ABOUT_DEVFEST)
                ],
                "interest_in_joining_ai_workshop": bool(
                    line[headers.index(DevFestColumns.INTEREST_IN_JOINING_AI_WORKSHOP)]
                ),
                "preferred_social_media": line[
                    headers.index(DevFestColumns.PREFERRED_SOCIAL_MEDIA)
                ],
                "processing_of_personal_data": line[
                    headers.index(DevFestColumns.PROCESSING_OF_PERSONAL_DATA)
                ],
            }

            pre_registration_data_rows.append(
                DevFestPreRegistrationSchema(**pre_registration_data)
            )

        with PreRegistration.batch_write() as batch:
            current_date = datetime.now(tz=pytz.timezone("Asia/Manila")).isoformat()
            items = []

            for pre_registration in pre_registration_data_rows:
                pre_registration_id = ulid.ulid()
                first_name, last_name = separate_first_and_last_name(
                    pre_registration.name
                )

                preregistration_in = PreRegistrationIn(
                    email=pre_registration.email,
                    firstName=first_name,
                    lastName=last_name,
                    contactNumber=pre_registration.phone_number,
                    careerStatus=pre_registration.career_status,
                    yearsOfExperience=pre_registration.level_of_experience,
                    organization=pre_registration.company_affiliation,
                    title=pre_registration.job_title,
                    eventId=eventId,
                )

                items.append(
                    PreRegistration(
                        hashKey=eventId,
                        rangeKey=pre_registration_id,
                        createDate=current_date,
                        updateDate=current_date,
                        entryStatus=EntryStatus.ACTIVE.value,
                        preRegistrationId=pre_registration_id,
                        acceptanceStatus=AcceptanceStatus.PENDING.value,
                        **preregistration_in.dict(),
                    )
                )

            for item in items:
                batch.save(item)


if __name__ == "__main__":
    event_id = "testevent"
    csv_file_path = "scripts/input.csv"
    import_pre_registration_from_csv(eventId=event_id, csv_file_path=csv_file_path)
