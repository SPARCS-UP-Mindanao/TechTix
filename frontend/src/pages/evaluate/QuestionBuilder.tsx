import { ControllerRenderProps, FieldPath, FieldValues, FormProvider, useForm } from 'react-hook-form';
import { z } from 'zod';
import Checkbox from '@/components/Checkbox';
import { FormItem, FormLabel } from '@/components/Form';
import Input from '@/components/Input';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/Select';
import Slider from '@/components/Slider';
import { Textarea } from '@/components/TextArea';

const questionTypes = [
  'text_short',
  'text_long',
  'multiple_choice_dropdown',
  'multiple_choice',
  'multiple_choice_dropdown',
  'multiple_answers',
  'slider'
] as const;

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
        return <Input className="rounded-xl" type="text" {...field} />;
      case 'text_long':
        return <Textarea className="rounded-lg bg-neutral-700 text-neutral-300" {...field} />;
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
          <RadioGroup className="space-y-1" onValueChange={field.onChange} {...field}>
            {question.options &&
              Array.isArray(question.options) &&
              question?.options.map((option, index) => {
                return (
                  <label key={index} htmlFor={option}>
                    <RadioGroupItem value={option} id={option} />
                    <span className="ml-1">{option}</span>
                  </label>
                );
              })}
          </RadioGroup>
        );
      case 'multiple_answers':
        return (
          <div className="flex flex-col space-y-2">
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
                    <span className="ml-1">{option}</span>
                  </label>
                );
              })}
          </div>
        );
      case 'slider':
        return (
          <div className="w-full">
            <Slider className="w-full" min={1} max={5} step={1} onValueChange={field.onChange} />
            <div className="flex justify-between px-1 mt-1">
              {[...Array(5)].map((_, index) => (
                <span key={index}>{index + 1}</span>
              ))}
            </div>
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col space-y-6">
      <FormProvider {...form}>
        {questions.map((question, index) => (
          <FormItem key={index} name={question.name}>
            {({ field }) => (
              <div className="">
                <FormLabel className="mb-3">{question.question}</FormLabel>
                {BuilderQuestion(question, field)}
              </div>
            )}
          </FormItem>
        ))}
      </FormProvider>
    </div>
  );
};

export default QuestionBuilder;
