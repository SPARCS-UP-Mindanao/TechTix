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
const PersonalInfoStep = ({ event, updateEventPrice }: Props) => {
  const shirtSizeOptions = ['XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'];
  const shirtSizeLink = import.meta.env.VITE_COMMDAY_SHIRT_SIZE_LINK;
  const isAWSUG = event.email === 'hello@awsugdavao.ph';
  const industryOptions = [
    'Agriculture',
    'Automotive',
    'Computer & Electronics',
    'Consumer Goods',
    'Education',
    'Financial Services',
    'Gaming',
    'Government',
    'Healthcare',
    'Hospitality',
    'Life Sciences',
    'Manufacturing',
    'Marketing and Advertising',
    'Media & Entertainment',
    'Mining',
    'Non-profit Organization',
    'Oil & Gas',
    'Power & Utilities',
    'Professional Services',
    'Real Estate & Construction',
    'Retail',
    'Software and Internet',
    'Telecommunications',
    'Transportation & Logistics',
    'Travel',
    'Wholesale & Distribution',
    'Other'
  ];

  const awsUsageOptions = [
    'No experience with AWS',
    'Evaluating/Experimenting with AWS',
    'Run dev/test workloads on AWS',
    'Run multiple production workloads on AWS',
    'Run a single production workload on AWS'
  ];

  const awsUsecaseOptions = [
    'Analytics & BI',
    'Archiving',
    'Backup, Archive & DR',
    'Backup & storage',
    'Batch processing',
    'Big Data, Analytics, & Business Intelligence',
    'Big data & amp; HPC',
    'Business Applications - Microsoft',
    'Business Applications - Oracle',
    'Business Applications - Other',
    'Business Applications - SAP',
    'Content Delivery',
    'Data Center Migration / Hybrid Arch.',
    'Development & Test',
    'Digital Media & Marketing',
    'Disaster Recovery',
    'High Availability',
    'High Performance Computing',
    'Hybrid Architecture',
    'Internet of Things',
    'Web, Mobile, Social Apps',
    'Web & Web Apps',
    'Other'
  ];

  const awsCommunityDayInLineWithOptions = ['Business Interest', 'Personal Interest'];

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
            <Input type="text" placeholder="Enter your position (e.g. Software Engineer)" className="" {...field} />
            <FormError />
          </div>
        )}
      </FormItem>

      {isAWSUG ? (
        <>
          <FormItem name="shirtSize">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>Shirt Size</FormLabel>
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

          <FormItem name="industry">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>Industry</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your industry" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {industryOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="levelOfAWSUsage">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>Level of AWS Usage:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your level of AWS usage" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {awsUsageOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="awsUsecase">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>AWS Use Case</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your AWS use case" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {awsUsecaseOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormError />
              </div>
            )}
          </FormItem>

          <FormItem name="awsCommunityDayInLineWith">
            {({ field }) => (
              <div className="flex flex-col gap-1">
                <FormLabel>I am attending the AWS Community Day in line with my:</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select your reason" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto">
                    {awsCommunityDayInLineWithOptions.map((option) => (
                      <SelectItem key={option} value={option}>
                        {option}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormError />
              </div>
            )}
          </FormItem>
        </>
      ) : null}

      {event.hasMultipleTicketTypes ? (
        <FormItem name="ticketTypeId">
          {({ field }) => (
            <div className="flex flex-col gap-4">
              <FormLabel className="text-xl font-bold">Ticket Type</FormLabel>
              <div className="grid gap-2">
                {event.ticketTypes
                  ?.sort((a, b) => parseInt(a.tier) - parseInt(b.tier))
                  .map((ticketType) => (
                    <div
                      key={ticketType.konfhubId}
                      className={`rounded-sm cursor-pointer hover:bg-accent-secondary hover:text-accent-foreground transition-colors border-2 ${
                        field.value === ticketType.konfhubId ? 'border-primary' : 'border-gray-700'
                      }`}
                      onClick={() => {
                        field.onChange(ticketType.konfhubId);
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
                          variant={field.value === ticketType.konfhubId ? 'primaryGradientNoHover' : 'default'}
                          onClick={() => {
                            field.onChange(ticketType.konfhubId);
                            updateEventPrice(ticketType.price);
                          }}
                          disabled={ticketType.maximumQuantity <= (ticketType.currentSales ?? 0)}
                        >
                          {field.value === ticketType.konfhubId ? <Check className="mr-2 h-4 w-4" /> : null}
                          {field.value === ticketType.konfhubId ? 'Selected' : 'Select'}
                        </Button>
                      </CardFooter>
                    </div>
                  ))}
              </div>
              <FormError />
            </div>
          )}
        </FormItem>
      ) : null}
    </>
  );
};

export default PersonalInfoStep;
