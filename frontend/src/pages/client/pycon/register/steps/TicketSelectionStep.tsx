import { FC } from 'react';
import { Check, Star } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from '@/components/Button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Label from '@/components/Label';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Event } from '@/model/events';
import { cn } from '@/utils/classes';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

interface Props {
  event: Event;
  updateEventPrice: (newPrice: number) => void;
}

const shirtSizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'] as const;

const TicketSelectionStep = ({ event, updateEventPrice }: Props) => {
  const shirtSizeLink = import.meta.env.VITE_COMMDAY_SHIRT_SIZE_LINK;

  const { control } = useFormContext<RegisterFormValues>();
  const [availTShirt] = useWatch({ control, name: ['availTShirt'] });

  return (
    <>
      <FormItem name="ticketType">
        {({ field }) => (
          <div className="flex flex-col gap-4">
            <FormLabel className="font-nunito">Ticket Type</FormLabel>
            <div className="grid gap-2 max-w-2xl">
              {event.ticketTypes
                ?.sort((a, b) => parseInt(a.tier) - parseInt(b.tier))
                .map((ticketType) => {
                  if (ticketType.id === 'coder') {
                    return (
                      <TicketType
                        key={ticketType.id}
                        value={field.value}
                        ticketType={ticketType}
                        subtitle="Regular"
                        benefits={['Full access', 'Snacks', 'Lunch', 'Kit']}
                        updateEventPrice={updateEventPrice}
                        onChange={field.onChange}
                      />
                    );
                  } else if (ticketType.id === 'kasosyo') {
                    return (
                      <TicketType
                        key={ticketType.id}
                        star
                        value={field.value}
                        ticketType={ticketType}
                        subtitle="Patron"
                        backgroundClass="bg-pycon-red"
                        benefits={['Full access', 'Snacks', 'Lunch', 'Kit', `Speaker's night`]}
                        updateEventPrice={updateEventPrice}
                        onChange={field.onChange}
                      />
                    );
                  }
                })}
            </div>
            <FormError />
          </div>
        )}
      </FormItem>

      <div className="flex flex-col md:flex-row w-full gap-4">
        <FormItem name="availTShirt">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel>Will you avail a shirt?</FormLabel>
              <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem pyconStyles id="availTShirt-yes" checked={!!field.value} value="true" />
                  <Label htmlFor={`availTShirt-yes`}>Yes</Label>

                  <RadioGroupItem pyconStyles id="availTShirt-no" checked={!field.value} value="" />
                  <Label htmlFor={`availTShirt-no`}>No</Label>
                </div>
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>

        <FormItem name="sprintDay">
          {({ field }) => (
            <div className="flex flex-col gap-1 grow basis-1/2">
              <FormLabel>Will you join sprint day? (You will have to pay additional PHP200)</FormLabel>
              <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3 mt-auto">
                <div className="flex items-center space-x-2">
                  <RadioGroupItem pyconStyles id="sprintDay-yes" checked={!!field.value} value="true" />
                  <Label htmlFor={`sprintDay-yes`}>Yes</Label>

                  <RadioGroupItem pyconStyles id="sprintDay-no" checked={!field.value} value="" />
                  <Label htmlFor={`sprintDay-no`}>No</Label>
                </div>
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>
      </div>

      {availTShirt && (
        <div className="flex flex-col md:flex-row w-full gap-4">
          <FormItem name="shirtType">
            {({ field }) => (
              <div className="flex flex-col gap-1 grow md:basis-1/2">
                <FormLabel>Shirt Type</FormLabel>
                <p className="text-pycon-custard-light text-sm">
                  To check shirt type, please refer to the{' '}
                  <a href={shirtSizeLink} className="text-pycon-orange underline" target="_blank">
                    link here
                  </a>
                  .
                </p>

                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 py-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem pyconStyles value="unisex" id={`shirtType-unisex`} />
                    <Label htmlFor={`shirtType-unisex`}>Unisex</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem pyconStyles value="female" id={`shirtType-`} />
                    <Label htmlFor={`shirtType-female`}>Female</Label>
                  </div>
                </RadioGroup>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="shirtSize">
            {({ field }) => (
              <div className="flex flex-col gap-1 grow md:basis-1/2">
                <FormLabel>Shirt Size (For Pro and VIP Tickets Only)</FormLabel>
                <p className="text-pycon-custard-light text-sm">
                  To check shirt size, please refer to the{' '}
                  <a href={shirtSizeLink} className="text-pycon-orange underline" target="_blank">
                    link here
                  </a>
                  .
                </p>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 py-3">
                  {shirtSizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem pyconStyles value={size} id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <FormError />
              </div>
            )}
          </FormItem>
        </div>
      )}
    </>
  );
};

interface TicketTypeProps {
  ticketType: NonNullable<Event['ticketTypes']>[number];
  benefits: string[];
  value: string;
  star?: boolean;
  subtitle: 'Regular' | 'Patron';
  backgroundClass?: string;
  onChange: (value: string) => void;
  updateEventPrice: (newPrice: number) => void;
}

const TicketType: FC<TicketTypeProps> = ({ ticketType, benefits, subtitle, value, backgroundClass, star, updateEventPrice, onChange }) => {
  return (
    <div
      key={ticketType.name}
      className={cn(
        'bg-pycon-orange font-nunito! cursor-pointer transition-[filter] text-pycon-dirty-white rounded-2xl  hover:brightness-110',
        backgroundClass
      )}
      onClick={() => {
        onChange(ticketType.id);
        updateEventPrice(ticketType.price);
      }}
    >
      <CardHeader>
        <CardTitle className={cn('flex flex-wrap font-black font-nunito text-2xl items-center gap-x-4')}>
          {star && <Star fill="currentColor" />}
          {ticketType.name.toUpperCase()}
          <span className={cn('font-medium text-base')}>{`( ${subtitle} )`}</span>
        </CardTitle>
        <div className={cn('text-pycon-custard-light font-nunito font-bold text-xl')}>{formatMoney(ticketType.price, 'PHP')}</div>

        {ticketType.originalPrice && ticketType.price < ticketType.originalPrice && (
          <CardDescription>
            <span className="line-through text-gray-500 font-semibold">{formatMoney(ticketType.originalPrice, 'PHP')}</span>
            <span className="ml-2 text-green-400 font-semibold">{formatPercentage(1 - ticketType.price / ticketType.originalPrice)} off</span>
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 font-semibold">
        {benefits.map((benefit) => (
          <span key={benefit} className="inline-flex gap-x-2">
            <Check className="text-pycon-white" /> {benefit}
          </span>
        ))}
      </CardContent>

      <CardFooter className="flex justify-between items-center">
        <Button
          className={cn('cursor-pointer bg-pycon-violet-dark hover:bg-pycon-violet-light')}
          onClick={() => {
            onChange(ticketType.id);
            updateEventPrice(ticketType.price);
          }}
          disabled={ticketType.maximumQuantity <= (ticketType.currentSales ?? 0)}
        >
          {value === ticketType.id ? <Check className="mr-2 h-4 w-4" /> : null}
          {value === ticketType.id ? 'Selected' : 'Select'}
        </Button>
      </CardFooter>
    </div>
  );
};

export default TicketSelectionStep;

// <CardHeader>
//   <CardTitle className={cn('grid font-black font-nunito text-2xl items-center gap-x-4', 'grid-cols-[auto_auto_auto_1fr]')}>
//     {/* <div className="inline-flex gap-x-2 items-center">
//     </div> */}
//     <Star fill="currentColor" className={cn(!star && 'opacity-0')} />
//     {ticketType.name.toUpperCase()}
//     <span className={cn('font-medium text-base row-start-2 sm:row-start-1', 'col-start-2 sm:col-start-3')}>{`( ${subtitle} )`}</span>

//     <div
//       className={cn(
//         'text-pycon-custard-light font-nunito font-bold text-xl  col-span-2 sm:col-span-1',
//         'row-start-3 sm:row-start-1 ms-0 sm:col-start-3 sm:ms-auto',
//         'col-start-2 sm:col-start-4 ms-0 sm:ms-auto'
//       )}
//     >
//       {formatMoney(ticketType.price, 'PHP')}
//     </div>
//   </CardTitle>
//   {ticketType.originalPrice && ticketType.price < ticketType.originalPrice && (
//     <CardDescription>
//       <span className="line-through text-gray-500 font-semibold">{formatMoney(ticketType.originalPrice, 'PHP')}</span>
//       <span className="ml-2 text-green-400 font-semibold">{formatPercentage(1 - ticketType.price / ticketType.originalPrice)} off</span>
//     </CardDescription>
//   )}
// </CardHeader>
