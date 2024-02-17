import { ControllerRenderProps, FieldPath, FieldValues } from 'react-hook-form';
import Checkbox from '@/components/Checkbox';
import Input from '@/components/Input';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectGroup, SelectItem } from '@/components/Select';
import Slider from '@/components/Slider';
import { Textarea } from '@/components/TextArea';
import { QuestionConfigItem } from '@/model/evaluations';

const BuilderQuestion = <TFieldValues extends FieldValues, TName extends FieldPath<TFieldValues>>(
  question: QuestionConfigItem,
  field: ControllerRenderProps<FieldValues, TName>,
  disabled: boolean = false
) => {
  switch (question.questionType) {
    case 'text_short':
      return <Input type="text" {...field} />;
    case 'text_long':
      return <Textarea {...field} />;
    case 'multiple_choice_dropdown':
      return (
        <Select onValueChange={field.onChange} disabled={disabled}>
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
        <RadioGroup className="space-y-1" onValueChange={field.onChange} {...field} disabled={disabled}>
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
                    disabled={disabled}
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
          <Slider className="w-full" min={1} max={5} step={1} onValueChange={field.onChange} disabled={disabled} />
          <div className="flex justify-between px-1 mt-1">
            {[...Array(5)].map((_, index) => (
              <span key={index}>{index + 1}</span>
            ))}
          </div>
        </div>
      );
    case 'radio_buttons':
      return (
        <RadioGroup onValueChange={field.onChange} {...field} disabled={disabled} defaultValue="1">
          <div className="flex justify-between px-2">
            {[...Array(5)].map((_, index) => (
              <div key={index} className="flex flex-col items-center gap-2">
                <span key={index}>{index + 1}</span>
                <RadioGroupItem value={String(index + 1)} id={String(index + 1)} />
              </div>
            ))}
          </div>
        </RadioGroup>
      );
  }
};

export default BuilderQuestion;
