import React, { useState } from 'react';
import { FormProvider, useFormState } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { FormError, FormItem, FormItemContainer, FormLabel } from '@/components/Form';
import ImageViewer from '@/components/ImageViewer';
import Input from '@/components/Input';
import Label from '@/components/Label';
import Modal from '@/components/Modal';
import { Registration } from '@/model/pycon/registrations';
import { formatMoney } from '@/utils/functions';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useEditRegistrationForm } from './useEditRegistrationForm';

interface Props {
  registrationInfo: Registration;
}

const RegistrationModal: React.FC<Props> = ({ registrationInfo }) => {
  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [allowEdit, setAllowEdit] = useState(false);
  const {
    event: { eventId }
  } = useAdminEvent();

  const { form, onUpdate, onDelete } = useEditRegistrationForm(eventId, registrationInfo);
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
      trigger={<Button variant="ghost" size="icon" icon="Ellipsis" />}
      className="md:max-w-[80%] max-h-[90vh] overflow-auto"
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

          <FormItem name="contactNumber">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Contact Number </FormLabel>
                <Input disabled={!allowEdit} {...field} />
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

          <FormItem name="jobTitle">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Title</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="facebookLink">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Facebook link:</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="ticketType">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Ticket Type</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="sprintDay">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Will attend sprint day?</FormLabel>
                <Checkbox disabled={!allowEdit} checked={field.value} onCheckedChange={field.onChange} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          {/* <FormItem name="availTShirt">
            {({ field }) => (
              <>
                <FormItemContainer halfSpace>
                  <FormLabel>Will avail shirt?</FormLabel>
                  <Checkbox disabled={!allowEdit} checked={field.value} onCheckedChange={field.onChange} />
                  <FormError />
                </FormItemContainer>

                {field.value && (
                  <>
                    <FormItem name="shirtType">
                      {({ field }) => (
                        <FormItemContainer halfSpace>
                          <FormLabel>Shirt Type</FormLabel>
                          <Input disabled={!allowEdit} {...field} />
                          <FormError />
                        </FormItemContainer>
                      )}
                    </FormItem>

                    <FormItem name="shirtSize">
                      {({ field }) => (
                        <FormItemContainer halfSpace>
                          <FormLabel>Shirt Size</FormLabel>
                          <Input disabled={!allowEdit} {...field} />
                          <FormError />
                        </FormItemContainer>
                      )}
                    </FormItem>
                  </>
                )}
              </>
            )}
          </FormItem> */}

          <FormItem name="dietaryRestrictions">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Dietary Restrictions</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>

          <FormItem name="accessibilityNeeds">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Accessibility Needs</FormLabel>
                <Input disabled={!allowEdit} {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>
        </FormProvider>

        <FormItemContainer halfSpace>
          <Label>Discount Code: </Label>
          <Input disabled value={registrationInfo.discountCode ? registrationInfo.discountCode : 'None'} />
        </FormItemContainer>

        <FormItemContainer halfSpace>
          <Label>Transaction ID: </Label>
          <Input disabled value={registrationInfo.transactionId} />
        </FormItemContainer>

        <FormItemContainer halfSpace>
          <Label>Amount paid:</Label>
          <Input disabled value={registrationInfo.amountPaid ? formatMoney(registrationInfo.amountPaid, 'PHP') : 'None'} />
        </FormItemContainer>

        <FormItemContainer>
          <Label>Submitted ID:</Label>
          <ImageViewer eventId={eventId} objectKey={registrationInfo.validIdObjectKey} className="max-h-60 w-auto" />
        </FormItemContainer>

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
