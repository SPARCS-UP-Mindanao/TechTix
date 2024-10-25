from pydantic import BaseModel, validator, EmailStr, Field, ValidationError
import csv
import re
from enum import Enum
from typing import Optional
import ulid
from http import HTTPStatus

from repository.preregistrations_repository import PreRegistrationsRepository
from model.preregistrations.preregistration import PreRegistrationIn


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


class DevFestPreRegistrationSchema(BaseModel):
    timestamp: str = Field(title="Timestamp")
    email: EmailStr = Field(None, title="Email")
    name: str = Field(None, title="Name")
    phone_number: str = Field(
        None, title="Phone Number", regex=r"^(09)\d{9}$"  # Philippine mobile number
    )
    career_status: Optional[CareerStatus] = Field(None, title="Career Status")
    developer_status: Optional[DeveloperStatus] = Field(None, title="Developer Status")
    job_title: Optional[str] = Field(None, title="Job Title")
    level_of_experience: Optional[LevelOfExperience] = Field(
        None, title="Level of Experience"
    )
    company_affiliation: Optional[str] = Field(None, title="Company Affiliation")
    gender: Optional[str] = Field(None, title="Gender")
    why_interested_in_devfest: Optional[str] = Field(
        None, title="Why interested in DevFest"
    )
    how_did_you_learn_about_devfest: Optional[str] = Field(
        None, title="How did you learn about DevFest?"
    )
    interest_in_joining_ai_workshop: Optional[bool] = Field(
        None, title="Interest in joining AI Workshop"
    )
    preferred_social_media: Optional[str] = Field(
        None, title="Preferred Social Media Platform"
    )
    processing_of_personal_data: Optional[str] = Field(
        None, title="Processing of Personal Data"
    )

    @validator("phone_number", pre=True)
    def strip_and_clean_phone_number(cls, value):
        if value is None or value == "":
            return None

        value = re.sub(
            r"\D", "", value
        )  # Strip leading/trailing spaces and remove unwanted characters (non-numeric)
        return value


# TODO: Refactoring
def import_pre_registration_from_csv(
    csv_file_path: str = "example.csv", eventId: str = "testevent"
):
    with open(csv_file_path, mode="r") as csv_file:
        csv_reader = csv.reader(csv_file)
        headers = next(csv_reader)

        for line in csv_reader:
            # Create a dictionary mapping the headers to the corresponding values from the line
            pre_registration_data = {
                "timestamp": line[headers.index("Timestamp")],
                "email": line[headers.index("Username")],
                "name": line[headers.index("Name")],
                "phone_number": line[
                    headers.index("Phone number")
                ].strip(),  # Clean whitespace
                "career_status": line[
                    headers.index("Which of the options best describe you?")
                ],
                "developer_status": line[headers.index("Are you a")],
                "job_title": line[headers.index("Job title")],
                "level_of_experience": line[headers.index("Level of expertise")],
                "company_affiliation": line[headers.index("Company or affiliation")],
                "gender": line[headers.index("Gender")],
                "why_interested_in_devfest": line[
                    headers.index(
                        "Why are you interested in joining DevFest Davao 2024?"
                    )
                ],
                "how_did_you_learn_about_devfest": line[
                    headers.index("How did you learn about the event?")
                ],
                "interest_in_joining_ai_workshop": bool(
                    line[
                        headers.index(
                            "Are you interested in joining an AI/ML (Machine Learning) hands-on workshop?"
                        )
                    ]
                ),
                "preferred_social_media": line[
                    headers.index(
                        "When it comes to joining a group chat community, which social media platform/s would you prefer?"
                    )
                ],
                "processing_of_personal_data": line[
                    headers.index(
                        'I hereby consent to the processing of the personal data that I have provided and declare my agreement with the data protection regulations in the data privacy statement. \n2024/10/22 7:08:14 PM GMT+8"'
                    )
                ],
            }

            try:
                pre_registration_csv_data = DevFestPreRegistrationSchema(
                    **pre_registration_data
                )
                name_parts = pre_registration_csv_data.name.split()

                # TODO: Add eventId
                preregistration_in = PreRegistrationIn(
                    email=pre_registration_csv_data.email,
                    firstName=" ".join(
                        name_parts[:-2]
                        + [("".join(name_parts[-2]) if len(name_parts[-2]) > 2 else "")]
                        if len(name_parts) > 2
                        else [name_parts[0]]
                    ).strip(),
                    lastName=(name_parts[-1] if len(name_parts) > 1 else "N/A"),
                    contactNumber=pre_registration_csv_data.phone_number,
                    careerStatus=pre_registration_csv_data.career_status,
                    yearsOfExperience=pre_registration_csv_data.level_of_experience,
                    organization=pre_registration_csv_data.company_affiliation,
                    title=pre_registration_csv_data.job_title,
                    eventId=eventId,
                )

                preregistrations_repository = PreRegistrationsRepository()
                preregistration_id = ulid.ulid()
                print("Preregistration ID: ", preregistration_id)

                (
                    status,
                    preregistration,
                    message,
                ) = preregistrations_repository.store_preregistration(
                    preregistration_in=preregistration_in,
                    preregistration_id=preregistration_id,
                )

                # Placeholder, change to return
                if status != HTTPStatus.OK:
                    print(f"Error storing preregistration: {message}")
                    continue

            except ValidationError as e:
                print(f"Validation error for row: {line}\n{e.json()}")


import_pre_registration_from_csv()
