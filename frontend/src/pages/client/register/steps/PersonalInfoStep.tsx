import { RadioGroup, RadioGroupItem } from '@/components/RadioGroup';
import Label from '@/components/Label';
import { FormItem, FormLabel, FormError } from '@/components/Form';
import Input from '@/components/Input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/Select';
import { Event } from '@/model/events';


interface Props {
  event: Event;
}
const PersonalInfoStep = ({ event }: Props) => {
  const shirtSizeOptions = ['SM', 'S', 'M', 'L', 'XL'];
  const shirtSizeLink = import.meta.env.VITE_COMMDAY_SHIRT_SIZE_LINK
  const isAWSUG = event.email === 'hello@awsugdavao.ph';

  return (
    <>
      <FormItem name="careerStatus">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Professional Status</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Student">Student</SelectItem>
                <SelectItem value="Professional">Professional</SelectItem>
              </SelectContent>
            </Select>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="yearsOfExperience">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Years of Experience</FormLabel>
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select Years of Experience" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">0</SelectItem>
                <SelectItem value="1-3">1-3</SelectItem>
                <SelectItem value="3-5">3-5</SelectItem>
                <SelectItem value="5-10">5-10</SelectItem>
                <SelectItem value="10 and above">10 and above</SelectItem>
              </SelectContent>
            </Select>
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="organization">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Affiliation</FormLabel>
            <Input type="text" placeholder="Enter affiliation (e.g. SPARCS)" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      <FormItem name="title">
        {({ field }) => (
          <div className="flex flex-col gap-1">
            <FormLabel>Position</FormLabel>
            <Input type="text" placeholder="Enter your position (e.g. Student)" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      {isAWSUG ? (
        <FormItem name="shirtSize">
          {({ field }) => (
            <div className="flex flex-col gap-1">
              <FormLabel>Shirt Size</FormLabel>
              <p className="text-muted-foreground text-sm">
                To check shirt size, please refer to the <a href={shirtSizeLink} className="text-primary underline" target="_blank">link here</a>.
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
      ) : null}

      {event.hasMultipleTicketTypes ? (
        <FormItem name="ticketType">
          {({ field }) => (
            <div className="flex flex-col gap-1">
              <FormLabel>Ticket Type</FormLabel>
              <RadioGroup onValueChange={field.onChange} value={field.value} className="flex flex-col gap-2">
                {event.ticketTypes?.map((ticketType) => (
                  <div key={ticketType.entryId} className="flex items-center space-x-2">
                    <RadioGroupItem value={ticketType.entryId} id={`ticket-${ticketType.entryId}`} className="h-4 w-4 rounded-sm" />
                    <Label htmlFor={`ticket-${ticketType.entryId}`}>{ticketType.name}</Label>
                  </div>
                ))}
              </RadioGroup>
              <FormError />
            </div>
          )}
        </FormItem>
      ) : null}
    </>
  );
};

export default PersonalInfoStep;
