import { FC, useState } from 'react';
import { FormProvider, useFormState, useWatch, useFieldArray } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import BlockNavigateModal from '@/components/BlockNavigateModal/BlockNavigateModal';
import Button from '@/components/Button';
import DatePicker from '@/components/DatePicker';
import Checkbox from '@/components/Checkbox';
import FileUpload from '@/components/FileUpload';
import { FormItem, FormLabel, FormError, FormItemContainer, FormItemSpacer } from '@/components/Form';
import Input from '@/components/Input';
import RichTextEditor from '@/components/RichContent/RichTextEditor';
import { Select, SelectContent, SelectGroup, SelectLabel, SelectItem, SelectValue, SelectTrigger } from '@/components/Select';
import Separator from '@/components/Separator';
import Switch from '@/components/Switch';
import { EVENT_STATUSES, EVENT_UPLOAD_TYPE, Event } from '@/model/events';
import { useAdminEventForm } from '@/hooks/useAdminEventForm';

interface Props {
  event?: Event;
}

const AdminEventForm: FC<Props> = ({ event }) => {
  const { form, submit, cancel } = useAdminEventForm(event);
  const { control, register, watch } = form;
  const { fields, append, remove } = useFieldArray({
    control,
    name: "ticketTypes"
  });
  const paidEvent = useWatch({ name: 'paidEvent', control });
  const isLimitedSlot = useWatch({ name: 'isLimitedSlot', control });
  const { isSubmitting, isDirty} = useFormState({ control });

  const hasMultipleTicketTypes = watch('hasMultipleTicketTypes');

  const [showIsPaidAlert, setShowIsPaidAlert] = useState(false);
  const isPaidAndHasRegistrants = event ? event.paidEvent && !!event.registrationCount : false;
  const isPreviouslyPaid = !paidEvent && isPaidAndHasRegistrants;

  const onSubmit = async () => {
    await submit();
    isPreviouslyPaid && setShowIsPaidAlert(false);
  };

  return (
    <FormProvider {...form}>
      <BlockNavigateModal condition={isDirty} />
      <main className="w-full flex flex-wrap gap-y-2">
        <FormItem name="name">
          {({ field: { value, onChange } }) => (
            <FormItemContainer>
              <FormLabel>Event Name</FormLabel>
              <Input type="text" value={value} onChange={onChange} />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <FormItem name="description">
          {({ field: { value, onChange } }) => (
            <FormItemContainer>
              <FormLabel>Description</FormLabel>
              <RichTextEditor content={value} setContent={onChange} placeholder="Describe your event" />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <FormItem name="email">
          {({ field }) => (
            <FormItemContainer halfSpace>
              <FormLabel>Email</FormLabel>
              <Input type="email" {...field} />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <FormItem name="venue">
          {({ field }) => (
            <FormItemContainer halfSpace>
              <FormLabel>Venue</FormLabel>
              <Input type="text" {...field} />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <Separator className="my-4" />

        <FormItem name="paidEvent">
          {({ field: { value, onChange } }) => (
            <FormItemContainer halfSpace>
              <div className="flex flex-row gap-2">
                <FormLabel>Is this a paid event?</FormLabel>
                <Switch id="isPaidEvent" checked={value} onCheckedChange={onChange} disabled={isSubmitting} />
              </div>
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        {paidEvent && (
          <FormItem name="price">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Price</FormLabel>
                <Input type="number" {...field} disabled={isSubmitting} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>
        )}

        <Separator className="my-4" />

        <FormItem name="isLimitedSlot">
          {({ field }) => (
            <FormItemContainer halfSpace>
              <div className="flex flex-row gap-2">
                <FormLabel>Are slots limited?</FormLabel>
                <Switch id="isLimitedSlot" checked={field.value} onCheckedChange={field.onChange} />
              </div>
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        {isLimitedSlot && (
          <FormItem name="maximumSlots">
            {({ field }) => (
              <FormItemContainer halfSpace>
                <FormLabel>Maximum Slots</FormLabel>
                <Input type="number" {...field} />
                <FormError />
              </FormItemContainer>
            )}
          </FormItem>
        )}

        <Separator className="my-4" />

        <FormItem name="isApprovalFlow">
          {({ field }) => (
            <FormItemContainer>
              <div className="flex flex-row gap-2">
                <FormLabel>Will this event follow a pre-registration flow?</FormLabel>
                <Switch id="isApprovalFlow" checked={field.value} onCheckedChange={field.onChange} disabled={isSubmitting} />
              </div>
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <Separator className="my-4" />

        {event && (
          <FormItem name="status">
            {({ field: { value, onChange } }) => (
              <>
                <FormItemContainer halfSpace>
                  <FormLabel>Status</FormLabel>
                  <Select value={value} onValueChange={onChange} disabled={isSubmitting}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select an event status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        <SelectLabel>Event Status</SelectLabel>
                        {EVENT_STATUSES.map((item) => (
                          <SelectItem key={item.value} value={item.value} disabled={item.value === 'preregistration' && !event?.isApprovalFlow}>
                            {item.label}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                  <FormError />
                </FormItemContainer>
                <FormItemSpacer />
              </>
            )}
          </FormItem>
        )}

        <FormItem name="startDate">
          {({ field: { value, onChange } }) => (
            <FormItemContainer halfSpace>
              <FormLabel>Event Start Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <FormItem name="endDate">
          {({ field: { value, onChange } }) => (
            <FormItemContainer halfSpace>
              <FormLabel>Event End Date</FormLabel>
              <DatePicker value={value} onChange={onChange} includeTime />
              <FormError />
            </FormItemContainer>
          )}
        </FormItem>

        <Separator className="my-4" />

        {event && (
          <>
            <FormItem name="hasMultipleTicketTypes">
              {({ field: { value, onChange } }) => (
                <FormItemContainer>
                  <div className="flex items-center space-x-2">
                    <Checkbox id="hasMultipleTicketTypes" checked={value} onCheckedChange={onChange} />
                    <FormLabel htmlFor="hasMultipleTicketTypes">Has Multiple Ticket Types</FormLabel>
                  </div>
                  <FormError />
                </FormItemContainer>
              )}
            </FormItem>

            {hasMultipleTicketTypes && (
              <FormItem name="ticketTypes">
                {() => (
                  <FormItemContainer>
                    <FormLabel>Ticket Types</FormLabel>
                    {fields.map((item, index) => (
                      <div key={item.id} className="space-y-2">
                        <FormLabel htmlFor={`ticketTypes.${index}.name`}>Name</FormLabel>
                        <Input {...register(`ticketTypes.${index}.name`)} id={`ticketTypes.${index}.name`} placeholder="Name" />

                        <FormLabel htmlFor={`ticketTypes.${index}.description`}>Description</FormLabel>
                        <Input {...register(`ticketTypes.${index}.description`)} id={`ticketTypes.${index}.description`} placeholder="Description" />

                        <FormLabel htmlFor={`ticketTypes.${index}.tier`}>Tier</FormLabel>
                        <Input {...register(`ticketTypes.${index}.tier`)} id={`ticketTypes.${index}.tier`} placeholder="Tier" />

                        <FormLabel htmlFor={`ticketTypes.${index}.price`}>Price</FormLabel>
                        <Input {...register(`ticketTypes.${index}.price`)} id={`ticketTypes.${index}.price`} type="number" step="0.01" placeholder="Price" />

                        <FormLabel htmlFor={`ticketTypes.${index}.maximumQuantity`}>Maximum Quantity</FormLabel>
                        <Input {...register(`ticketTypes.${index}.maximumQuantity`)} id={`ticketTypes.${index}.maximumQuantity`} type="number" placeholder="Maximum Quantity" />

                        <FormLabel htmlFor={`ticketTypes.${index}.konfhubId`}>Konfhub ID</FormLabel>
                        <Input {...register(`ticketTypes.${index}.konfhubId`)} id={`ticketTypes.${index}.konfhubId`} placeholder="Konfhub ID" />

                        <Button type="button" onClick={() => remove(index)}>Remove</Button>
                      </div>
                    ))}
                    <Button type="button" onClick={() => append({ name: '', description: '', tier: '', price: 0, maximumQuantity: 0, konfhubId: '' })}>
                      Add Ticket Type
                    </Button>
                  </FormItemContainer>
                )}
              </FormItem>
            )}

            <FormItem name="konfhubId">
              {({ field }) => (
                <FormItemContainer>
                  <FormLabel>Konfhub Event ID</FormLabel>
                  <Input {...field} placeholder="Konfhub ID" />
                  <FormError />
                </FormItemContainer>
              )}
            </FormItem>
          </>
        )}

        <Separator className="my-4" />

        {event && (
          <>
            <FormItem name="bannerLink">
              {({ field: { name, value, onChange } }) => (
                <FormItemContainer halfSpace>
                  <FormLabel>Event Banner</FormLabel>
                  <FileUpload name={name} eventId={event.eventId} uploadType={EVENT_UPLOAD_TYPE.BANNER} value={value} onChange={onChange} />
                  <FormError />
                </FormItemContainer>
              )}
            </FormItem>

            <FormItem name="logoLink">
              {({ field: { name, value, onChange } }) => (
                <FormItemContainer halfSpace>
                  <FormLabel>Event Logo</FormLabel>
                  <FileUpload name={name} eventId={event.eventId} uploadType={EVENT_UPLOAD_TYPE.LOGO} value={value} onChange={onChange} />
                  <FormError />
                </FormItemContainer>
              )}
            </FormItem>

            <FormItem name="certificateTemplate">
              {({ field: { name, value, onChange } }) => (
                <FormItemContainer halfSpace>
                  <FormLabel>Event Certificate Template</FormLabel>
                  <FileUpload name={name} eventId={event.eventId} uploadType={EVENT_UPLOAD_TYPE.CERTIFICATE_TEMPLATE} value={value} onChange={onChange} />
                  <FormError />
                </FormItemContainer>
              )}
            </FormItem>
            <Separator className="my-4" />
          </>
        )}

        <div className="w-full flex justify-end space-x-2">
          {event ? (
            <AlertModal
              alertModalTitle="Are you sure you want to discard all changes?"
              alertModalDescription="Discarding all changes may result in data loss."
              confirmVariant="negative"
              onCompleteAction={cancel}
              trigger={
                <Button icon="X" disabled={isSubmitting || (event && !isDirty)} variant="ghost">
                  Discard changes
                </Button>
              }
            />
          ) : (
            <Button icon="X" disabled={isSubmitting || (event && !isDirty)} variant="ghost" onClick={cancel}>
              Cancel
            </Button>
          )}

          <Button
            icon="Save"
            disabled={!isDirty}
            loading={isSubmitting}
            onClick={isPreviouslyPaid ? () => setShowIsPaidAlert(true) : onSubmit}
            type="submit"
            variant="primaryGradient"
          >
            {event ? 'Save' : 'Create'}
          </Button>

          <AlertModal
            alertModalTitle="Are you sure you want to continue?"
            alertModalDescription="There are already registrants who have paid for the event. Are you sure you want to make this event free?"
            visible={showIsPaidAlert}
            confirmVariant="negative"
            isLoading={isSubmitting}
            onCompleteAction={onSubmit}
            onCancelAction={() => setShowIsPaidAlert(false)}
          />
        </div>
      </main>
    </FormProvider>
  );
};

export default AdminEventForm;
