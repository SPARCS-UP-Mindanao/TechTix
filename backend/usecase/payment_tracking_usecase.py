from datetime import datetime, timezone

import ulid
from model.email.email import EmailIn, EmailType
from model.payments.payments import PaymentTrackingBody, TransactionStatus
from model.pycon_registrations.pycon_registration import PyconRegistrationOut
from model.registrations.registration import Registration
from repository.payment_tracking_repository import PaymentTrackingRepository
from repository.registrations_repository import RegistrationsRepository
from usecase.email_usecase import EmailUsecase
from utils import logger


class PaymentTrackingUsecase:
    def __init__(self):
        self.payment_tracking_repository = PaymentTrackingRepository()
        self.registration_repository = RegistrationsRepository()
        self.email_usecase = EmailUsecase()

    def process_payment_event(self, payment_tracking_body: PaymentTrackingBody):
        registration_details = payment_tracking_body.registration_details
        status = payment_tracking_body.status
        registration_data = registration_details.registrationData

        self._send_email_notification(registration_data, status, registration_details.eventId)

        if status == TransactionStatus.SUCCESS:
            try:
                self.payment_tracking_repository.update_payment_transaction(
                    event_id=registration_details.eventId, entry_id=registration_details.entryId, status=status
                )
                self._create_and_save_registration(registration_details, registration_data, status)
                logger.info(f'Successfully processed and saved registration for {registration_data.email}')
            except Exception as e:
                logger.error(f'Failed to process successful payment for entryId {registration_details.entryId}: {e}')
                raise

    def _create_and_save_registration(self, registration_details, registration_data, status):
        registration_id = str(ulid.ulid())
        current_date = datetime.now(timezone.utc).isoformat()

        registration_item_data = {
            'hashKey': registration_data.eventId or registration_id,
            'rangeKey': registration_details.entryId,
            'registrationId': registration_id,
            'createDate': current_date,
            'updateDate': current_date,
            'email': registration_data.email,
            'firstName': registration_data.firstName,
            'lastName': registration_data.lastName,
            'nickname': registration_data.nickname,
            'pronouns': registration_data.pronouns,
            'contactNumber': registration_data.contactNumber,
            'organization': registration_data.organization,
            'jobTitle': registration_data.jobTitle,
            'ticketType': registration_data.ticketType.value,
            'sprintDay': registration_data.sprintDay,
            'availTShirt': registration_data.availTShirt,
            'shirtType': registration_data.shirtType.value if registration_data.shirtType else None,
            'shirtSize': registration_data.shirtSize.value if registration_data.shirtSize else None,
            'communityInvolvement': registration_data.communityInvolvement,
            'futureVolunteer': registration_data.futureVolunteer,
            'dietaryRestrictions': registration_data.dietaryRestrictions,
            'accessibilityNeeds': registration_data.accessibilityNeeds,
            'discountCode': registration_data.discountCode,
            'validIdObjectKey': registration_data.validIdObjectKey,
            'amountPaid': registration_details.amountPaid,
            'transactionId': registration_details.transactionId,
            'paymentId': registration_details.paymentId,
            'referenceNumber': registration_details.referenceNumber,
            'gcashPayment': registration_details.gcashPayment,
            'registrationEmailSent': True,
            'confirmationEmailSent': True,
            'eventId': registration_details.eventId,
            'entryStatus': status.value,
        }

        self.registration_repository.store_registration(Registration(**registration_item_data))

    def _send_email_notification(self, registration_data: PyconRegistrationOut, status: str, event_id: str):
        if status == TransactionStatus.SUCCESS:
            subject = 'Registration Successful'
            body = [
                'Thank you for registering for PyCon Davao 2025! We are excited to have you join us for this amazing event.',
                'Your payment has been successfully processed. Below are your registration details:',
            ]
        else:
            subject = 'Payment Unsuccessful'
            body = ['Your payment was not successful. Please try again later.']

        email_in = EmailIn(
            to=[registration_data.email],
            subject=subject,
            salutation=f'Hi {registration_data.firstName},',
            body=body,
            regards=['Best,'],
            emailType=EmailType.REGISTRATION_EMAIL,
            eventId=event_id,
            isDurianPy=True,
        )
        self.email_usecase.email_repo.send_email(email_in)


# class PaymentTrackingUsecase:
# 	def __init__(self):
# 		self.payment_tracking_repository = PaymentTrackingRepository()
# 		self.email_usecase = EmailUsecase()
# 		self.sqs_client = boto3.client('sqs')
# 		self.payment_queue_url = os.environ.get('PAYMENT_QUEUE')

# 	def process_payment_event(self, payment_tracking_body: PaymentTrackingBody, receipt_handle):
# 		try:
# 			registration_details = payment_tracking_body.registration_details
# 			payment_entry_id = registration_details.entryId
# 			status = payment_tracking_body.status
# 			registration_data = registration_details.registrationData

# 			if status == TransactionStatus.SUCCESS:
# 				self._store_associated_registration_detail(registration_data)
# 			self._send_email_notification(registration_data, status)
# 		except Exception as e:
# 			logger.error(f"Error processing payment event: {e}")
# 		finally:
# 			self.sqs_client.delete_message(
# 				QueueUrl=self.payment_queue_url,
# 				ReceiptHandle=receipt_handle
# 			)

# 	def _store_associated_registration_detail(self, registration_data: PyconRegistrationOut):
# 		...

# 	def _send_email_notification(self, registration_data: PyconRegistrationOut, status: str):
# 		if status == TransactionStatus.SUCCESS:
# 			subject = 'Registration Successful'
# 			body = [
#                 'Thank you for registering for PyCon Davao 2025! We are excited to have you join us for this amazing event.',
#                 'Your payment has been successfully processed. Below are your registration details:',
#             ]
# 		else:
# 			subject = 'Payment Unsuccessful'
# 			body = ['Your payment was not successful. Please try again later.']

# 			email_in = EmailIn(
#             to=[registration_data.email],
#             subject=subject,
#             salutation=f'Hi {registration_data.firstName},',
#             body=body,
#             regards=['Best,'],
#             emailType=EmailType.REGISTRATION_EMAIL,
#             eventId=registration_data.eventId,
#             isDurianPy=True,
#         )
# 		self.email_usecase.email_repo.send_email(email_in)
