import React, { useState } from 'react';
import { FormProvider, useFormState } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import { FormError, FormItem, FormItemContainer, FormLabel } from '@/components/Form';
import Input from '@/components/Input';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Event } from '@/model/events';
import { PreRegistration } from '@/model/preregistrations';
import { Registration } from '@/model/registrations';
import { formatMoney } from '@/utils/functions';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useEditRegistrationForm } from './useEditRegistrationForm';

interface Props {
  registrationInfo: Registration | PreRegistration;
}

const RegistrationModal: React.FC<Props> = ({ registrationInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const { paidEvent, eventId, status } = useAdminEvent();

  const { form, onUpdate, onDelete, onApprove, onReject } = useEditRegistrationForm(eventId, registrationInfo);
  const { isSubmitting, isDirty } = useFormState({ control: form.control });

  const onCancel = () => {
    setAllowEdit(false);
    form.reset();
  };

  const toggleEdit = () => (allowEdit ? onCancel() : setAllowEdit(true));

  return (
    <Modal
      modalTitle="Registration Info"
      visible={showModal}
      onOpenChange={setShowModal}
      trigger={<Button variant="ghost" size="icon" icon="MoreHorizontal" />}
      className="md:max-w-[80%]"
      modalFooter={
        <Button onClick={() => setShowModal(false)} variant="ghost">
          Close
        </Button>
      }
    >
      <div className="flex space-x-4 w-full">
        <p className="text-muted-foreground mr-auto">Review the user's information</p>

        <div className="space-x-4">
          <Button icon={allowEdit ? 'X' : 'Pen'} variant="default" onClick={toggleEdit} />
          <Button icon="Trash" variant="negative" onClick={() => setShowDeleteModal(true)} />
        </div>
      </div>
      <main className="w-full flex flex-wrap gap-y-2">
        <FormProvider {...form}>
          <FormItem name="email">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Email</FormLabel>
                <Input disabled {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="contactNumber">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Contact Number </FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="firstName">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>First name </FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="lastName">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Last Name </FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="careerStatus">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Professional status</FormLabel>
                <Select disabled={!allowEdit} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Student">Student</SelectItem>
                    <SelectItem value="Professional">Professional</SelectItem>
                  </SelectContent>
                </Select>
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="yearsOfExperience">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Years of Experience</FormLabel>
                <Select disabled={!allowEdit} onValueChange={field.onChange} value={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Years of Experience" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="0">0</SelectItem>
                    <SelectItem value="1-3">1-3</SelectItem>
                    <SelectItem value="3-5">3-5</SelectItem>
                    <SelectItem value="5-10">5-10</SelectItem>
                    <SelectItem value="10 and above">10 and above</SelectItem>
                  </SelectContent>
                </Select>
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="organization">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Affiliation</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="title">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Position</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>
        </FormProvider>

        {paidEvent && registrationInfo.type === 'registration' && (
          <>
            <FormItemContainer halfSpace>
              <Label>Discount Code: </Label>
              <Input disabled value={registrationInfo.discountCode ? registrationInfo.discountCode : 'None'} />
            </FormItemContainer>

            <FormItemContainer halfSpace>
              <Label>Amount paid:</Label>
              <Input disabled value={registrationInfo.amountPaid ? formatMoney(registrationInfo.amountPaid, 'PHP') : 'None'} />
            </FormItemContainer>
          </>
        )}

        {registrationInfo.ticketTypeId && (
          <FormItemContainer halfSpace>
            <Label>Ticket Type:</Label>
            <Input disabled value={registrationInfo.ticketTypeId} />
          </FormItemContainer>
        )}

        {registrationInfo.shirtSize && (
          <FormItemContainer halfSpace>
            <Label>Shirt Size:</Label>
            <Input disabled value={registrationInfo.shirtSize} />
          </FormItemContainer>
        )}

        {registrationInfo.cityOfResidence && (
          <FormItemContainer halfSpace>
            <Label>City of Residence:</Label>
            <Input disabled value={registrationInfo.cityOfResidence} />
          </FormItemContainer>
        )}

        {registrationInfo.industry && (
          <FormItemContainer halfSpace>
            <Label>Industry:</Label>
            <Input disabled value={registrationInfo.industry} />
          </FormItemContainer>
        )}

        {registrationInfo.levelOfAWSUsage && (
          <FormItemContainer halfSpace>
            <Label>Level of AWS Usage:</Label>
            <Input disabled value={registrationInfo.levelOfAWSUsage} />
          </FormItemContainer>
        )}

        {registrationInfo.awsUsecase && (
          <FormItemContainer halfSpace>
            <Label>AWS Use Case:</Label>
            <Input disabled value={registrationInfo.awsUsecase} />
          </FormItemContainer>
        )}

        {registrationInfo.awsCommunityDayInLineWith && (
          <FormItemContainer halfSpace>
            <Label>AWS Community Day In Line With:</Label>
            <Input disabled value={registrationInfo.awsCommunityDayInLineWith} />
          </FormItemContainer>
        )}

        {registrationInfo.foodRestrictions && (
          <FormItemContainer halfSpace>
            <Label>Food Restrictions:</Label>
            <Input disabled value={registrationInfo.foodRestrictions} />
          </FormItemContainer>
        )}

        <div className="w-full flex mt-4 md:mt-8 justify-center space-x-4">
          {allowEdit && (
            <>
              <Button icon="X" variant="ghost" disabled={isSubmitting} onClick={onCancel}>
                Cancel
              </Button>
              <Button type="submit" icon="Save" loading={isSubmitting} disabled={!isDirty} onClick={onUpdate}>
                Save
              </Button>
            </>
          )}

          {registrationInfo.type === 'preregistration' && !allowEdit && (
            <>
              <Button icon="X" variant="negative" disabled={status != 'preregistration'} loading={isSubmitting} onClick={onReject}>
                Reject
              </Button>
              <Button icon="Check" variant="positive" disabled={status != 'preregistration'} loading={isSubmitting} onClick={onApprove}>
                Accept
              </Button>
            </>
          )}
        </div>
      </main>

      <AlertModal
        alertModalTitle="Are you sure you want to delete this registration?"
        alertModalDescription="Deleting this registration is irreversible. This action cannot be undone."
        visible={showDeleteModal}
        isLoading={isSubmitting}
        confirmVariant="negative"
        onOpenChange={setShowDeleteModal}
        onCompleteAction={onDelete}
      />
    </Modal>
  );
};

export default RegistrationModal;
