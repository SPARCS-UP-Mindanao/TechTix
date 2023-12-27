import moment from 'moment';
import { Event } from '@/model/events';

export const useDashboardEvents = (events: Event[]) => {
  const sortByDate = (a: Event, b: Event) => (moment(b.startDate).isAfter(moment(a.startDate)) ? 1 : -1);

  const onGoingEvents = events.filter((event) => moment(new Date()).isBetween(moment(event.startDate), moment(event.endDate), 'day', '[]')).sort(sortByDate);
  const upcomingEvents = events
    .filter(
      (event) =>
        moment(new Date()).isBefore(moment(event.startDate)) && !moment(new Date()).isBetween(moment(event.startDate), moment(event.endDate), 'day', '[]')
    )
    .sort(sortByDate);

  const pastEvents = events
    .filter((event) => moment(event.startDate).isBefore(moment(new Date())) && moment(event.endDate).isBefore(moment(new Date())))
    .sort(sortByDate);

  return { onGoingEvents, upcomingEvents, pastEvents };
};
