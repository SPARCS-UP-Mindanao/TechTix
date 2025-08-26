import { Check } from 'lucide-react';
import { useFormContext, useWatch } from 'react-hook-form';
import Button from '@/components/Button';
import { CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/Card';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Label from '@/components/Label';
import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import { Event } from '@/model/events';
import { formatMoney, formatPercentage } from '@/utils/functions';
import { RegisterFormValues } from '../../hooks/useRegisterForm';

interface Props {
  event: Event;
  updateEventPrice: (newPrice: number) => void;
}

const shirtSizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'] as const;

const TicketSelectionStep = ({ event, updateEventPrice }: Props) => {
  const shirtSizeLink = import.meta.env.VITE_COMMDAY_SHIRT_SIZE_LINK;

  const { control } = useFormContext<RegisterFormValues>();
  const [availTShirt] = useWatch({ control, name: ['availTShirt'] });

  return (
    <>
      <FormItem name="ticketType">
        {({ field }) => (
          <div className="flex flex-col gap-4">
            <FormLabel className="text-xl font-bold">Ticket Type</FormLabel>
            <div className="grid gap-2">
              {event.ticketTypes
                ?.sort((a, b) => parseInt(a.tier) - parseInt(b.tier))
                .map((ticketType) => {
                  console.log({ ticketType });

                  if (ticketType.id === 'coder') {
                    return (
                      <div
                        key={ticketType.name}
                        className={`rounded-sm cursor-pointer hover:bg-accent-secondary hover:text-accent-foreground transition-colors border-2 ${
                          field.value === ticketType.id ? 'border-primary' : 'border-gray-700'
                        }`}
                        onClick={() => {
                          field.onChange(ticketType.id);
                          updateEventPrice(ticketType.price);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            {ticketType.name}
                            <span className="text-primary font-bold text-xl">{formatMoney(ticketType.price, 'PHP')}</span>
                          </CardTitle>
                          {ticketType.originalPrice && ticketType.price < ticketType.originalPrice && (
                            <CardDescription>
                              <span className="line-through text-gray-500 font-semibold">{formatMoney(ticketType.originalPrice, 'PHP')}</span>
                              <span className="ml-2 text-green-400 font-semibold">{formatPercentage(1 - ticketType.price / ticketType.originalPrice)} off</span>
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-2">{ticketType.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <Button
                            variant={field.value === ticketType.id ? 'primaryGradientNoHover' : 'default'}
                            onClick={() => {
                              field.onChange(ticketType.id);
                              updateEventPrice(ticketType.price);
                            }}
                            disabled={ticketType.maximumQuantity <= (ticketType.currentSales ?? 0)}
                          >
                            {field.value === ticketType.id ? <Check className="mr-2 h-4 w-4" /> : null}
                            {field.value === ticketType.id ? 'Selected' : 'Select'}
                          </Button>
                        </CardFooter>
                      </div>
                    );
                  } else if (ticketType.id === 'kasosyo') {
                    return (
                      <div
                        key={ticketType.name}
                        className={`rounded-sm cursor-pointer hover:bg-accent-secondary hover:text-accent-foreground transition-colors border-2 ${
                          field.value === ticketType.id ? 'border-primary' : 'border-gray-700'
                        }`}
                        onClick={() => {
                          field.onChange(ticketType.id);
                          updateEventPrice(ticketType.price);
                        }}
                      >
                        <CardHeader>
                          <CardTitle className="flex justify-between items-center">
                            {ticketType.name}
                            <span className="text-primary font-bold text-xl">{formatMoney(ticketType.price, 'PHP')}</span>
                          </CardTitle>
                          {ticketType.originalPrice && ticketType.price < ticketType.originalPrice && (
                            <CardDescription>
                              <span className="line-through text-gray-500 font-semibold">{formatMoney(ticketType.originalPrice, 'PHP')}</span>
                              <span className="ml-2 text-green-400 font-semibold">{formatPercentage(1 - ticketType.price / ticketType.originalPrice)} off</span>
                            </CardDescription>
                          )}
                        </CardHeader>
                        <CardContent>
                          <p className="text-sm mb-2">{ticketType.description}</p>
                        </CardContent>
                        <CardFooter className="flex justify-between items-center">
                          <Button
                            variant={field.value === ticketType.id ? 'primaryGradientNoHover' : 'default'}
                            onClick={() => {
                              field.onChange(ticketType.id);
                              updateEventPrice(ticketType.price);
                            }}
                            disabled={ticketType.maximumQuantity <= (ticketType.currentSales ?? 0)}
                          >
                            {field.value === ticketType.id ? <Check className="mr-2 h-4 w-4" /> : null}
                            {field.value === ticketType.id ? 'Selected' : 'Select'}
                          </Button>
                        </CardFooter>
                      </div>
                    );
                  }
                })}
            </div>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="sprintDay">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Will you join sprint day? (You will have to pay additional PHP200)</FormLabel>
            <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="sprintDay-yes" checked={!!field.value} value={'true'} />
                <Label htmlFor={`sprintDay-yes`}>Yes</Label>

                <RadioGroupItem id="sprintDay-no" checked={!field.value} value="" />
                <Label htmlFor={`sprintDay-no`}>No</Label>
              </div>
            </RadioGroup>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="availTShirt">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Will you avail a shirt?</FormLabel>
            <RadioGroup onValueChange={(value) => field.onChange(Boolean(value))} value={field.value} className="flex flex-wrap gap-4 py-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem id="availTShirt-yes" checked={!!field.value} value={'true'} />
                <Label htmlFor={`availTShirt-yes`}>Yes</Label>

                <RadioGroupItem id="availTShirt-no" checked={!field.value} value="" />
                <Label htmlFor={`availTShirt-no`}>No</Label>
              </div>
            </RadioGroup>
            <FormError />
          </div>
        )}
      </FormItem>

      {availTShirt && (
        <>
          <FormItem name="shirtType">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>Shirt Type</FormLabel>
                <p className="text-muted-foreground text-sm">
                  To check shirt type, please refer to the{' '}
                  <a href={shirtSizeLink} className="text-primary underline" target="_blank">
                    link here
                  </a>
                  .
                </p>

                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 py-3">
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="unisex" id={`shirtType-unisex`} />
                    <Label htmlFor={`shirtType-unisex`}>Unisex</Label>
                  </div>

                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="female" id={`shirtType-`} />
                    <Label htmlFor={`shirtType-female`}>Female</Label>
                  </div>
                </RadioGroup>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="shirtSize">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>Shirt Size (For Pro and VIP Tickets Only)</FormLabel>
                <p className="text-muted-foreground text-sm">
                  To check shirt size, please refer to the{' '}
                  <a href={shirtSizeLink} className="text-primary underline" target="_blank">
                    link here
                  </a>
                  .
                </p>
                <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-wrap gap-4 py-3">
                  {shirtSizeOptions.map((size) => (
                    <div key={size} className="flex items-center space-x-2">
                      <RadioGroupItem value={size} id={`size-${size}`} />
                      <Label htmlFor={`size-${size}`}>{size}</Label>
                    </div>
                  ))}
                </RadioGroup>
                <FormError />
              </div>
            )}
          </FormItem>
        </>
      )}
    </>
  );
};

export default TicketSelectionStep;
