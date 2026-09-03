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
    <section className="text-pycon-dark-blue bg-white/50 rounded-[40px] p-10">
      <div className="flex flex-col w-full gap-4">
        <p className="font-inter font-bold uppercase text-pycon-dark-blue/40 text-sm">Community</p>
        <FormItem name="communityInvolvement">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2 bg-pycon-dirty-white p-6 rounded-[38.13px]">
              <Label htmlFor="communityInvolvement-yes" aria-required>
                Are you a member of any local tech community?
                <span className="text-pycon-orange">&nbsp;*</span>
              </Label>
              <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem pyconStyles id="communityInvolvement-yes" checked={!!field.value} value={'true'} />
                  <Label htmlFor="communityInvolvement-yes">Yes</Label>
                  <RadioGroupItem pyconStyles id="communityInvolvement-no" checked={!field.value} value="" />
                  <Label htmlFor="communityInvolvement-no">No</Label>
                </div>
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="futureVolunteer">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow md:basis-1/2 bg-pycon-dirty-white p-6 rounded-[38.13px]">
              <Label htmlFor="futureVolunteer-yes">
                Would you like to volunteer in the future?<span className="text-pycon-orange">&nbsp;*</span>
              </Label>
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
      
      <div className="flex flex-col w-full mt-10 gap-4">
        <p className="font-inter font-bold uppercase text-pycon-dark-blue/40 text-sm">Preferences <span className="lowercase font-light">(optional)</span></p>
        <FormItem name="dietaryRestrictions">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel optional optionalClass="sr-only" className="text-pycon-orange uppercase" >
                Dietary Restrictions
              </FormLabel>
              <Input pyconStyles placeholder="e.g. vegetarian, nut allergy..." type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="accessibilityNeeds">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel optional optionalClass="sr-only" className="text-pycon-orange uppercase">
                Accessibility Needs
              </FormLabel>
              <Input pyconStyles placeholder="e.g. wheelchair access, sign language..." type="text" {...field} />
              <FormError />
            </div>
          )}
        </FormItem>
      </div>
    </section>
  );
};

export default MiscellaneousStep;
