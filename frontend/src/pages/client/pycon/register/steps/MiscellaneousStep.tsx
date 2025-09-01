import { FC } from 'react';
import { Check } from 'lucide-react';
import Button from '@/components/Button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import Label from '@/components/Label';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';

interface Props {
  event: Event;
  updateEventPrice: (newPrice: number) => void;
}

const MiscellaneousStep: FC<Props> = () => {
  return (
    <>
      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="communityInvolvement">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel>Are you a member of any local tech community?</FormLabel>
              <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem pyconStyles id="communityInvolvement-yes" checked={!!field.value} value={'true'} />
                  <Label htmlFor={`communityInvolvement-yes`}>Yes</Label>

                  <RadioGroupItem pyconStyles id="communityInvolvement-no" checked={!field.value} value="" />
                  <Label htmlFor={`communityInvolvement-no`}>No</Label>
                </div>
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="futureVolunteer">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2">
              <FormLabel>Would you like to volunteer in the future?</FormLabel>
              <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem pyconStyles id="futureVolunteer-yes" checked={!!field.value} value={'true'} />
                  <Label htmlFor={`futureVolunteer-yes`}>Yes</Label>

                  <RadioGroupItem pyconStyles id="futureVolunteer-no" checked={!field.value} value="" />
                  <Label htmlFor={`futureVolunteer-no`}>No</Label>
                </div>
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="dietaryRestrictions">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel optional optionalClass="text-pycon-custard-light">
                Dietary Restrictions
              </FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="accessibilityNeeds">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel optional optionalClass="text-pycon-custard-light">
                Accessibility Needs
              </FormLabel>
              <Input pyconStyles type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>
    </>
  );
};

export default MiscellaneousStep;
