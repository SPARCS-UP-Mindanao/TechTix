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
  const date = value ? new Date(value) : new Date();
  const time = includeTime && value ? moment(value).format('HH:mm') : moment().format('HH:mm');

  type DateValue = {
    date?: Date;
    time?: string;
  };

  const updateValue = ({ date: selectedDate, time: selectedTime }: DateValue) => {
    const newValue = moment(`${moment(selectedDate ?? date).format('YYYY-MM-DD')} ${moment(selectedTime ?? time, 'HH:mm').format('HH:mm')}`).toISOString();
    onChange(newValue);
  };

  const onChangeDate = (date: Date | undefined) => updateValue({ date });

  const onChangeTime = (e: React.ChangeEvent<HTMLInputElement>) => updateValue({ time: e.target.value });

  const getContent = () => {
    if (!value) {
      return includeTime ? 'Pick a time and date' : 'Pick a date';
    }

    const format = includeTime && time ? 'MMM D YYYY hh:mm A' : 'MMM D YYYY';
    return moment(value).format(format);
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal text-foreground border-border bg-input hover:bg-accent hover:text-accent-foreground hover:border-border file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-hidden focus-visible:ring-1 focus-visible:ring-ring',
            className
          )}
        >
          <Icon name="Calendar" className="mr-2 h-4 w-4" />
          {getContent()}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto py-2">
        <Calendar mode="single" selected={date} defaultMonth={date} onSelect={onChangeDate} initialFocus />
        {includeTime && <Input value={time} onChange={onChangeTime} type="time" />}
      </PopoverContent>
    </Popover>
  );
};

export default DatePicker;
