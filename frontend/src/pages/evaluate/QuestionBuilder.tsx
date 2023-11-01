import { ControllerRenderProps, FieldPath, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Checkbox from '@/components/Checkbox';
import { FormItem } from '@/components/Form';
import Input from '@/components/Input';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/Select';
import { Textarea } from '@/components/TextArea';

const questionTypes = ['text_short', 'text_long', 'multiple_choice_dropdown', 'multiple_choice', 'multiple_choice_dropdown', 'multiple_answers'] as const;

export interface QuestionConfigItem {
  questionType: (typeof questionTypes)[number];
  name: string;
  question: string;
  options?: string | string[];
}

interface QuestionBuilderProps {
  questions: QuestionConfigItem[];
}

const schemaCreator = (questions: QuestionConfigItem[]): z.ZodObject<any> => {
  const schema = questions.reduce(
    (acc, question) => {
      if (question.questionType === 'multiple_answers') {
        acc[question.name] = z.array(z.string());
      } else {
        acc[question.name] = z.string();
      }
      return acc;
    },
    {} as Record<string, z.ZodTypeAny>
  );

  return z.object(schema);
};

const QuestionBuilder = ({ questions }: QuestionBuilderProps) => {
  const FormSchema = schemaCreator(questions);

  const getDefaultValues = (questions: QuestionConfigItem[]) => {
    const defaultValues = questions.reduce(
      (acc, question) => {
        if (question.questionType === 'multiple_answers') {
          acc[question.name] = [];
        } else {
          acc[question.name] = '';
        }
        return acc;
      },
      {} as Record<string, string | string[]>
    );
    return defaultValues;
  };

  const form = useForm<z.infer<typeof FormSchema>>({
    mode: 'onChange',
    defaultValues: getDefaultValues(questions)
  });

  console.log(form.watch());

  const BuilderQuestion = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
    question: QuestionConfigItem,
    field: ControllerRenderProps<FieldValues, TName>
  ) => {
    switch (question.questionType) {
      case 'text_short':
        return <Input type="text" {...field} />;
      case 'text_long':
        return <Textarea {...field} />;
      case 'multiple_choice_dropdown':
        return (
          <Select onValueChange={field.onChange}>
            <SelectTrigger>
              <SelectValue placeholder="Drop down Choices" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {question.options &&
                  Array.isArray(question.options) &&
                  question?.options.map((option, index) => (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case 'multiple_choice':
        return (
          <RadioGroup onValueChange={field.onChange} {...field}>
            {question.options &&
              Array.isArray(question.options) &&
              question?.options.map((option, index) => {
                return (
                  <label key={index} htmlFor={option}>
                    <RadioGroupItem value={option} id={option} />
                    <span>{option}</span>
                  </label>
                );
              })}
          </RadioGroup>
        );
      case 'multiple_answers':
        return (
          <>
            {question.options &&
              Array.isArray(question.options) &&
              question?.options.map((option, index) => {
                const fieldValue = field.value as unknown as string[];

                return (
                  <label key={index} htmlFor={option}>
                    <Checkbox
                      id={option}
                      value={option}
                      checked={fieldValue.includes(option)}
                      onCheckedChange={(checked) =>
                        checked ? field.onChange([...fieldValue, option]) : field.onChange(fieldValue.filter((item) => item !== option))
                      }
                    />
                    <span>{option}</span>
                  </label>
                );
              })}
          </>
        );
    }
  };

  return (
    <FormProvider {...form}>
      {questions.map((question, index) => (
        <FormItem key={index} name={question.name}>
          {({ field }) => BuilderQuestion(question, field)}
        </FormItem>
      ))}
    </FormProvider>
  );
};

export default QuestionBuilder;
