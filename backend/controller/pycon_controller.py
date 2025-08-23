from http import HTTPStatus
from typing import List

from aws.cognito_settings import AccessUser, get_current_user
from constants.common_constants import CommonConstants
from fastapi import APIRouter, Body, Depends, Path, Query
from model.common import Message
from model.pycon_registrations.pycon_registration import (
    PyconRegistrationIn,
    PyconRegistrationOut,
    PyconRegistrationPatch,
)
from usecase.registration_usecase import RegistrationUsecase

pycon_router = APIRouter()


@pycon_router.post(
    '/',
    response_model=PyconRegistrationOut,
    responses={
        200: {
            'model': PyconRegistrationOut,
            'description': 'Successful registration',
            'content': {
                'application/json': {
                    'example': {
                        'firstName': 'Juan',
                        'lastName': 'Dela Cruz',
                        'nickname': 'Juan',
                        'pronouns': 'he/him',
                        'email': 'juan.delacruz@email.com',
                        'eventId': 'pycon-davao-2024',
                        'contactNumber': '+639171234567',
                        'organization': 'Tech Company Inc',
                        'jobTitle': 'Software Developer',
                        'facebookLink': 'https://facebook.com/juan.delacruz',
                        'linkedInLink': 'https://linkedin.com/in/juandelacruz',
                        'ticketType': 'coder',
                        'sprintDay': True,
                        'availTShirt': True,
                        'shirtType': 'unisex',
                        'shirtSize': 'L',
                        'communityInvolvement': True,
                        'futureVolunteer': True,
                        'dietaryRestrictions': 'Vegetarian',
                        'accessibilityNeeds': 'None',
                        'discountCode': 'STUDENT20',
                        'validIdObjectKey': 'pycon-2024/ids/juan-delacruz-id.jpg',
                        'imageIdUrl': 'https://s3.amazonaws.com/pycon-bucket/pycon-2024/ids/juan-delacruz-id.jpg',
                    }
                }
            },
        },
        400: {'model': Message, 'description': 'Bad request'},
        409: {'model': Message, 'description': 'Registration with email example@example.com already exists'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Register for PyCon Davao',
    description='Create a new registration entry for PyCon Davao with personal details, ticket preferences, and payment information.',
)
def register_pycon(
    registration_in: PyconRegistrationIn = Body(
        ...,
        examples={
            'complete_registration': {
                'summary': 'Complete registration with T-shirt',
                'description': 'A typical registration with all fields filled including T-shirt order',
                'value': {
                    'firstName': 'Juan',
                    'lastName': 'Dela Cruz',
                    'nickname': 'Juan',
                    'pronouns': 'he/him',
                    'email': 'durianpy.davao+juan.delacruz@gmail.com',
                    'eventId': 'pycon-davao-2024',
                    'contactNumber': '+639171234567',
                    'organization': 'Tech Company Inc',
                    'jobTitle': 'Software Developer',
                    'facebookLink': 'https://facebook.com/juan.delacruz',
                    'linkedInLink': 'https://linkedin.com/in/juandelacruz',
                    'ticketType': 'coder',
                    'sprintDay': True,
                    'availTShirt': True,
                    'shirtType': 'unisex',
                    'shirtSize': 'L',
                    'communityInvolvement': True,
                    'futureVolunteer': True,
                    'dietaryRestrictions': 'Vegetarian',
                    'accessibilityNeeds': 'None',
                    'discountCode': 'STUDENT20',
                    'validIdObjectKey': 'pycon-2024/ids/juan-delacruz-id.jpg',
                    'amountPaid': 1200.00,
                    'transactionId': 'TXN-20240101-001',
                },
            },
            'basic_registration': {
                'summary': 'Basic registration without T-shirt',
                'description': 'Registration with minimal optional fields',
                'value': {
                    'firstName': 'Maria',
                    'lastName': 'Santos',
                    'nickname': 'Maria',
                    'pronouns': 'she/her',
                    'email': 'maria.santos@email.com',
                    'eventId': 'pycon-davao-2024',
                    'contactNumber': '+639181234567',
                    'organization': 'Startup Co',
                    'jobTitle': 'Data Scientist',
                    'facebookLink': 'https://facebook.com/maria.santos',
                    'ticketType': 'kasosyo',
                    'sprintDay': False,
                    'availTShirt': False,
                    'communityInvolvement': True,
                    'futureVolunteer': False,
                    'validIdObjectKey': 'pycon-2024/ids/maria-santos-id.jpg',
                },
            },
        },
    ),
):
    """
    Create a new registration entry for PyCon Davao.

    This endpoint handles registration for PyCon Davao, capturing attendee information,
    ticket preferences, dietary restrictions, accessibility needs, and payment details.
    """
    registrations_uc = RegistrationUsecase()
    return registrations_uc.create_pycon_registration(registration_in)


@pycon_router.get(
    '',
    response_model=List[PyconRegistrationOut],
    responses={
        404: {'model': Message, 'description': 'Registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get registrations',
)
@pycon_router.get(
    '/',
    response_model=List[PyconRegistrationOut],
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_registrations(
    event_id: str = Query(None, title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Get a list of registration entries.
    """
    registrations_uc = RegistrationUsecase()
    return registrations_uc.get_registrations(event_id=event_id)


@pycon_router.get(
    '/{entryId}',
    response_model=PyconRegistrationOut,
    responses={
        404: {'model': Message, 'description': 'Registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Get registration',
)
@pycon_router.get(
    '/{entryId}/',
    response_model=PyconRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def get_registration(
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
):
    """
    Get a specific registration entry by its ID.
    """
    registrations_uc = RegistrationUsecase()
    return registrations_uc.get_registration(event_id=event_id, registration_id=entry_id)


@pycon_router.put(
    '/{entryId}',
    response_model=PyconRegistrationOut,
    responses={
        400: {'model': Message, 'description': 'Bad request'},
        404: {'model': Message, 'description': 'Registration not found'},
        500: {'model': Message, 'description': 'Internal server error'},
    },
    summary='Update registration',
)
@pycon_router.put(
    '/{entryId}/',
    response_model=PyconRegistrationOut,
    response_model_exclude_none=True,
    response_model_exclude_unset=True,
    include_in_schema=False,
)
def update_registration(
    registration: PyconRegistrationPatch,
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Update an existing registration entry.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.update_registration(
        event_id=event_id, registration_id=entry_id, registration_in=registration
    )


@pycon_router.delete(
    '/{entryId}',
    status_code=HTTPStatus.NO_CONTENT,
    responses={
        204: {'description': 'Registration deletion success', 'content': None},
    },
    summary='Delete registration',
)
@pycon_router.delete(
    '{entryId}/',
    status_code=HTTPStatus.NO_CONTENT,
    include_in_schema=False,
)
def delete_registration(
    entry_id: str = Path(..., title='Registration Id', alias=CommonConstants.ENTRY_ID),
    event_id: str = Query(..., title='Event Id', alias=CommonConstants.EVENT_ID),
    current_user: AccessUser = Depends(get_current_user),
):
    """
    Delete a specific registration entry by its ID.
    """
    _ = current_user
    registrations_uc = RegistrationUsecase()
    return registrations_uc.delete_registration(registration_id=entry_id, event_id=event_id)
