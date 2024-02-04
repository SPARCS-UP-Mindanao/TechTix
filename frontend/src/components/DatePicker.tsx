import * as React from 'react';
import moment from 'moment';
import Button from '@/components/Button';
import Calendar from '@/components/Calendar';
import Icon from '@/components/Icon';
import Input from '@/components/Input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/Popover';
import { cn } from '@/utils/classes';

interface DatePickerProps {
  value: string;
  className?: string;
  includeTime?: boolean;
  onChange: (value: string) => void;
}

export const DatePicker = ({ value, className, includeTime = false, onChange }: DatePickerProps) => {
  const initialDate = value ? new Date(value) : new Date();
  const initialTime = includeTime && value ? moment(value).format('HH:mm') : moment().format('HH:mm');
  const newDateValue = moment(initialDate);

  const [date, setDate] = React.useState<Date | undefined>(initialDate);
  const [time, setTime] = React.useState<string>(initialTime);

  const updateValue = () => {
    const newValue = moment(`${moment(date).format('YYYY-MM-DD')} ${moment(time, 'HH:mm').format('HH:mm')}`).toISOString();
    onChange(newValue);
  };

  const onChangeDate = (selectedDate: Date | undefined) => {
    setDate(selectedDate);
    updateValue();
  };

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTime(e.target.value);
    updateValue();
  };

  const getContent = () => {
    if (!value) {
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
          <Icon name="Calendar" className="mr-2 h-4 w-4" />
          {getContent()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto py-2">
        <Calendar mode="single" selected={date} onSelect={onChangeDate} initialFocus />
        {includeTime && <Input value={time} onChange={onChangeTime} type="time" />}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
