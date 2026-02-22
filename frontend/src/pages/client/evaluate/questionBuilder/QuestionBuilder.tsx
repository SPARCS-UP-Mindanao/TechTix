import { FormError, FormItem, FormLabel } from '@/components/Form';
import { QuestionConfigItem } from '@/model/evaluations';
import QuestionTypeSwitch from '@/pages/client/evaluate/questionBuilder/QuestionTypeSwitch';

interface QuestionBuilderProps {
  questions: QuestionConfigItem[];
}

const QuestionBuilder = ({ questions }: QuestionBuilderProps) => {
  return (
    <>
      {questions.map((question, index) => (
        <FormItem key={index} name={question.name}>
          {({ field }) => (
            <div className="flex flex-col gap-1">
              <FormLabel className="mb-3">{question.question}</FormLabel>
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
