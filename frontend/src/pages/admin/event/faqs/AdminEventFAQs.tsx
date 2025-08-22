import { FC } from 'react';
import { FormProvider, useFormState } from 'react-hook-form';
import AlertModal from '@/components/AlertModal';
import BlockNavigateModal from '@/components/BlockNavigateModal/BlockNavigateModal';
import Button from '@/components/Button';
import { FormError, FormItem, FormLabel } from '@/components/Form';
import Switch from '@/components/Switch';
import { Textarea } from '@/components/TextArea';
import { getFAQs } from '@/api/events';
import { EventFAQs } from '@/model/events';
import useAdminEvent from '@/hooks/useAdminEvent';
import { useApiQuery } from '@/hooks/useApi';
import { useFAQsForm } from '@/hooks/useFAQsForm';

const AdminFAQs = () => {
  const {
    event: { eventId }
  } = useAdminEvent();
  const { data: response, isFetching } = useApiQuery(getFAQs(eventId));

  if (isFetching) {
    // TODO: Add skeleton
    return <div>Loading...</div>;
  }

  if (!response || (response.status !== 200 && response.status !== 404)) {
    return <div>FAQs not found</div>;
  }

  return (
    <section>
      <div className="flex flex-col gap-3 items-center justify-center w-full">
        <h2>FAQs</h2>
        <p className="text-muted-foreground">Manage the FAQs that will be shown on event registrations.</p>

        <div className="flex md:flex-row flex-col gap-2"></div>
        <FAQsForm eventFAQs={response.data} />
      </div>
    </section>
  );
};

interface FAQsFormProps {
  eventFAQs: EventFAQs;
}

const FAQsForm: FC<FAQsFormProps> = ({ eventFAQs }) => {
  const { form, faqs, addFAQ, removeFAQ, moveFAQ, submit } = useFAQsForm(eventFAQs);
  const { isSubmitting, isDirty } = useFormState(form);

  const onAddFAQ = () => addFAQ({ question: '', answer: '' });
  const onMoveQuestionUp = (index: number) => moveFAQ(index, index - 1);
  const onMoveQuestionDown = (index: number) => moveFAQ(index, index + 1);
  const onRemoveFAQ = (index: number) => removeFAQ(index);
  const onSubmit = async () => await submit();
  const onDiscardChanges = () => form.reset();

  const disableMoveUp = (index: number) => index === 0 || isSubmitting;
  const disableMoveDown = (index: number) => index === faqs.length - 1 || isSubmitting;

  return (
    <FormProvider {...form}>
      <BlockNavigateModal condition={isDirty} />
      <main className="w-full flex flex-col space-y-6">
        <FormItem name="isActive">
          {({ field: { value, onChange } }) => (
            <div className="flex space-x-2">
              <FormLabel>Enable FAQs</FormLabel>
              <Switch checked={value} onCheckedChange={onChange} />
            </div>
          )}
        </FormItem>

        <ol className="list-outside list-decimal space-y-6">
          {faqs.map((faq, index) => {
            return (
              <li key={faq.id} className="space-y-2">
                <div className="space-y-2 w-full">
                  <FormItem name={`faqs.${index}.question`}>
                    {({ field: { value, onChange } }) => (
                      <div>
                        <FormLabel>Question</FormLabel>
                        <Textarea disabled={isSubmitting} value={value} onChange={onChange} />
                        <FormError />
                      </div>
                    )}
                  </FormItem>

                  <FormItem name={`faqs.${index}.answer`}>
                    {({ field: { value, onChange } }) => (
                      <div>
                        <FormLabel>Answer</FormLabel>
                        <Textarea disabled={isSubmitting} value={value} onChange={onChange} />
                        <FormError />
                      </div>
                    )}
                  </FormItem>
                </div>

                <div className="flex items-center">
                  <div className="mr-auto">
                    <Button title="Move FAQ Up" variant="ghost" icon="ChevronUp" disabled={disableMoveUp(index)} onClick={() => onMoveQuestionUp(index)} />
                    <Button
                      title="Move FAQ Down"
                      variant="ghost"
                      icon="ChevronDown"
                      disabled={disableMoveDown(index)}
                      onClick={() => onMoveQuestionDown(index)}
                    />
                  </div>
                  <Button
                    title="Delete FAQ"
                    variant="ghost"
                    icon="Trash"
                    disabled={isSubmitting}
                    className="text-negative"
                    onClick={() => onRemoveFAQ(index)}
                  />
                </div>
              </li>
            );
          })}
        </ol>
        <Button icon="CirclePlus" disabled={isSubmitting} variant="ghost" className="flex self-start" onClick={onAddFAQ}>
          Add FAQ
        </Button>
        <FormItem name="faqs">{() => <FormError />}</FormItem>

        <footer className="flex justify-end space-x-4">
          <AlertModal
            alertModalTitle="Are you sure you want to discard all changes?"
            alertModalDescription="Discarding all changes may result in data loss."
            confirmVariant="negative"
            onCompleteAction={onDiscardChanges}
            trigger={
              <Button icon="X" disabled={isSubmitting || (event && !isDirty)} variant="ghost">
                Discard changes
              </Button>
            }
          />
          <Button loading={isSubmitting} disabled={!isDirty || isSubmitting} icon="Save" type="submit" onClick={onSubmit}>
            Save
          </Button>
        </footer>
      </main>
    </FormProvider>
  );
};

const AdminFAQsPage = () => {
  return <AdminFAQs />;
};

export const Component = AdminFAQsPage;

export default AdminFAQsPage;
