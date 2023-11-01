import { FormProvider, useForm } from 'react-hook-form';
import * as z from 'zod';
import Button from '@/components/Button';
import Checkbox from '@/components/Checkbox';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Select, SelectValue, SelectTrigger, SelectContent, SelectGroup, SelectItem } from '@/components/Select';
import { Textarea } from '@/components/TextArea';
import { zodResolver } from '@hookform/resolvers/zod';

interface question_config_item {
  questionType: string;
  question: string;
  options: string[];
  name: string;
}

const question_config = [
  {
    name: 'question1',
    questionType: 'text_short',
    question: 'Lorem ipsum dolor sit amet?',
    options: []
  },
  {
    name: 'question2',
    questionType: 'text_long',
    question: 'Lorem ipsum dolor sit amet?',
    options: []
  },
  {
    name: 'question3',
    questionType: 'multiple_choice_dropdown',
    question: 'Multiple choice question - Single Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  },
  {
    name: 'question4',
    questionType: 'multiple_choice',
    question: 'Multiple choice question - Single Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  },
  {
    name: 'question5',
    questionType: 'multiple_answers',
    question: 'Multiple choice question - Multiple Answer',
    options: ['Choice 1', 'Choice 2', 'Choice 3', 'Choice 4']
  }
];

interface QuestionBuilderProps {
  question_config: question_config_item;
  question_type: string;
}

const QuestionBuilder = ({ question_config, question_type }: QuestionBuilderProps) => {
  const FormItemOptionField = (field: { onChange: () => void; onBlur: () => void; value: string }) => {
    const optionName = question_config.name;
    console.log(field);

    switch (question_type) {
      case 'text_short':
        return <Input name={optionName} type="text" {...field} />;
      case 'text_long':
        return <Textarea name={optionName} {...field} />;
      case 'multiple_choice_dropdown':
        return (
          <Select name={optionName}>
            <SelectTrigger>
              <SelectValue placeholder="Drop down Choices" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {question_config.options.map((option, index) => {
                  return (
                    <SelectItem key={index} value={option}>
                      {option}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
        );
      case 'multiple_choice':
        return (
          <RadioGroup name={optionName} {...field}>
            {question_config.options.map((option, index) => {
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
            {question_config.options.map((option, index) => {
              return (
                <label key={index} htmlFor={option}>
                  <Checkbox
                    name={question_config.name}
                    id={option}
                    value={option}
                    checked={field.value?.includes(option)}
                    onCheckedChange={(checked) => {
                      const updatedValue = checked ? [...field.value, option] : field.value?.filter((value) => value !== option);
                      field.onChange(updatedValue);
                    }}
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
    <>
      <FormItem name={question_config.name}>
        {({ field }) => (
          <div className="flex flex-col items-start mb-5 space-y-2">
            <FormLabel className="text-white">{question_config.question}</FormLabel>
            {FormItemOptionField(field)}
            <FormError />
          </div>
        )}
      </FormItem>
    </>
  );
};

const QuestionFormSchema = z.object({});

const EvaluationForm = () => {
  const form = useForm();

  const submit = form.handleSubmit((data) => {
    console.log(data);
  });

  return (
    <>
      <FormProvider {...form}>
        {question_config.map((question: question_config_item, index) => {
          return <QuestionBuilder key={index} question_config={question} question_type={question.questionType} />;
        })}
        <Button onClick={submit}>Submit</Button>
      </FormProvider>
    </>
  );
};

const EvaluationQuestions = () => {
  return (
    <div className="flex flex-col items-center">
      <p className="font-subjectivity font-bold text-center text-xl leading-6">Evaluation</p>
      <div className="flex items-center relative space-x-6 mt-3">
        <div className="rounded-full w-9 h-9 bg-primary-500 flex items-center justify-center">
          <p className="font-subjectivity font-bold text-white">1</p>
        </div>
        <div className="w-8 border-2 h-0 border-neutral-200 absolute left-2.5 z-[-1]"></div>
        <div className="rounded-full w-9 h-9 bg-neutral-200 flex items-center justify-center">
          <p className="font-subjectivity font-bold text-primary-500">2</p>
        </div>
      </div>
      <EvaluationForm />
    </div>
  );
};

export default EvaluationQuestions;
