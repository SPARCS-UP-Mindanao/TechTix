import * as React from 'react';
import { Controller, ControllerFieldState, FieldError, FieldPath, FieldValues, UseFormStateReturn, useFormContext } from 'react-hook-form';
import Label from '@/components/Label';
import { cn } from '@/utils/classes';
import { InfoToolTip } from './Tooltip';
import * as LabelPrimitive from '@radix-ui/react-label';
import { Slot } from '@radix-ui/react-slot';

interface FormItemContextProps {
  id: string;
  formItemId: string;
  formDescriptionId: string;
  formMessageId: string;
  fieldState: {
    invalid: boolean;
    isDirty: boolean;
    isTouched: boolean;
    error?: FieldError | undefined;
  };
}

const FormItemContext = React.createContext<FormItemContextProps>({} as FormItemContextProps);

interface FormItemProps<TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>> {
  name: TName;
  children: (props: {
    field: { onChange: () => void; onBlur: () => void; value: string };
    fieldState: ControllerFieldState;
    formState: UseFormStateReturn<FieldValues>;
  }) => React.ReactElement;
}

export const FormItem = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>({ name, children }: FormItemProps<TFieldValues, TName>) => {
  const { control, getFieldState, formState } = useFormContext();
  const id = React.useId();
  const formItemId = `${id}-form-item`;
  const formDescriptionId = `${id}-form-item-description`;
  const formMessageId = `${id}-form-item-message`;

  const fieldState = getFieldState(name, formState);

  const ariaDescribedby = !fieldState.error ? `${formDescriptionId}` : `${formDescriptionId} ${formMessageId}`;

  return (
    <FormItemContext.Provider
      value={{
        id,
        formItemId,
        formDescriptionId,
        formMessageId,
        fieldState
      }}
    >
      <Slot id={formItemId} aria-describedby={ariaDescribedby} aria-invalid={!!fieldState.error}>
        <Controller name={name} control={control} render={({ field, fieldState, formState }) => children({ field, fieldState, formState })} />
      </Slot>
    </FormItemContext.Provider>
  );
};

const useFormField = () => {
  const fieldContext = React.useContext(FormItemContext);

  if (!fieldContext) {
    throw new Error('useFormField should be used within a FormProvider');
  }

  return fieldContext;
};

interface FormLabelProps extends React.ComponentPropsWithoutRef<typeof LabelPrimitive.Root> {
  toolTipContent?: string;
  optional?: boolean;
}

const FormLabel = React.forwardRef<React.ElementRef<typeof LabelPrimitive.Root>, FormLabelProps>(
  ({ className, children, toolTipContent, optional = false, ...props }, ref) => {
    const {
      fieldState: { error },
      formItemId
    } = useFormField();

    return (
      <Label ref={ref} className={cn(error && 'text-negative', 'flex flex-row items-center gap-x-2', className)} htmlFor={formItemId} {...props}>
        {children}
        {optional && <p className="text-[0.8rem] text-muted-foreground text-gray-400">{`(Optional)`}</p>}
        {toolTipContent && toolTipContent?.length > 0 && <InfoToolTip toolTipContent={toolTipContent} />}
      </Label>
    );
  }
);
FormLabel.displayName = 'FormLabel';

const FormDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, ...props }, ref) => {
  const { formDescriptionId } = useFormField();

  return <p ref={ref} id={formDescriptionId} className={cn('text-[0.8rem] text-muted-foreground', className)} {...props} />;
});
FormDescription.displayName = 'FormDescription';

const FormError = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(({ className, children, ...props }, ref) => {
  const {
    fieldState: { error },
    formMessageId
  } = useFormField();
  const body = error ? String(error?.message) : children;

  if (!body) {
    return <p className="text-[0.8rem] whitespace-pre"> </p>;
  }

  return (
    <p ref={ref} id={formMessageId} className={cn('text-[0.8rem] text-left font-medium text-negative', className)} {...props}>
      {body}
    </p>
  );
});
FormError.displayName = 'FormError';

export { useFormField, FormLabel, FormDescription, FormError };
