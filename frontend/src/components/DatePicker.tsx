import * as React from 'react';
import moment from 'moment';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { cn } from '@/utils/classes';
import { isValidDate } from '@/utils/functions';

interface DatePickerProps {
  value: string;
  className?: string;
  includeTime?: boolean;
  onChange: (value: string) => void;
}

export const DatePicker = ({ value, className, includeTime = false, onChange }: DatePickerProps) => {
  const initialDate = isValidDate(value) ? new Date(value) : undefined;
  const initialTime = includeTime && initialDate ? initialDate.getHours() + ':' + initialDate.getMinutes() : '00:00';

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string | undefined>(initialTime);
  const [newDateValue, setNewDateValue] = React.useState<string | undefined>(undefined);

  React.useEffect(() => {
    if (!date) {
      return;
    }

    if (includeTime && !time) {
      return;
    }

    const newTime = moment(time, 'HH:mm');
    const newDate = includeTime
      ? moment(date)
          .set({
            hour: newTime.hour(),
            minute: newTime.minute()
          })
          .toISOString()
      : moment(date).toISOString();

    onChange(newDate);
    setNewDateValue(newDate);
  }, [date, onChange, time, includeTime]);

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
  };

  const getContent = () => {
    if (!date || !newDateValue) {
      return includeTime ? 'Pick a time and date' : 'Pick a date';
    }

    const format = includeTime && time ? 'MMM D YYYY hh:mm A' : 'MMM D YYYY';
    return moment(newDateValue).format(format);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal text-foreground border-border bg-input hover:bg-accent hover:text-accent-foreground hover:border-border file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring',
            className
          )}
        >
          <Icon name="CalendarBlank" className="mr-2 h-4 w-4" />
          {getContent()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto py-2">
        <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
        {includeTime && <Input value={time} onChange={onChangeTime} type="time" />}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
