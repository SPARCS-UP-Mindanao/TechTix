import { FormError, FormItem, FormLabel } from '@/components/Form';
import BuilderQuestion from '@/components/QuestionBuilder';
import { QuestionConfigItem } from '@/model/evaluations';

interface QuestionBuilderProps {
  questions: QuestionConfigItem[];
}

// const schemaCreator = (questions: QuestionConfigItem[]): z.ZodObject<any> => {
//   const schema = questions.reduce(
//     (acc, question) => {
//       if (question.questionType === 'multiple_answers') {
//         acc[question.name] = z.array(z.string());
//       } else {
//         acc[question.name] = z.string();
//       }
//       return acc;
//     },
//     {} as Record<string, z.ZodTypeAny>
//   );

//   return z.object(schema);
// };

const QuestionBuilder = ({ questions }: QuestionBuilderProps) => {
  // const FormSchema = schemaCreator(questions);

  // const getDefaultValues = (questions: QuestionConfigItem[]) => {
  //   const defaultValues = questions.reduce(
  //     (acc, question) => {
  //       if (question.questionType === 'multiple_answers') {
  //         acc[question.name] = [];
  //       } else {
  //         acc[question.name] = '';
  //       }
  //       return acc;
  //     },
  //     {} as Record<string, string | string[]>
  //   );
  //   return defaultValues;
  // };

  // const form = useForm<z.infer<typeof FormSchema>>({
  //   mode: 'onChange',
  //   defaultValues: getDefaultValues(questions)
  // });

  // console.log(form.watch());

  return (
    <div className="flex flex-col space-y-6 w-full">
      {questions.map((question, index) => (
        <FormItem key={index} name={question.name}>
          {({ field }) => (
            <div className="">
              <FormLabel className="mb-3">{question.question}</FormLabel>
              {BuilderQuestion(question, field)}
              <FormError />
            </div>
          )}
        </FormItem>
      ))}
    </div>
  );
};

export default QuestionBuilder;
