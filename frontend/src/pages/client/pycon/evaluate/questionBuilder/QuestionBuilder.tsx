import { FormError, FormItem, FormLabel } from '@/components/Form';
import { QuestionConfigItem } from '@/model/pycon/evaluations';
import QuestionTypeSwitch from './QuestionTypeSwitch';

interface QuestionBuilderProps {
  questions: QuestionConfigItem[];
}

const QuestionBuilder = ({ questions }: QuestionBuilderProps) => {
  return (
    <>
      {questions.map((question, index) => (
        <FormItem key={index} name={question.name}>
          {({ field }) => (
            <div className="flex flex-col gap-2">
              <FormLabel className="mb-1 text-pycon-custard">{question.question} *</FormLabel>
              {QuestionTypeSwitch(question, field)}
              <FormError />
            </div>
          )}
        </FormItem>
      ))}
    </>
  );
};

export default QuestionBuilder;
