import moment from 'moment';
import { Event } from '@/model/events';

export const useDashboardEvents = (events: Event[]) => {
  const activeEvents = events.filter((event) => event.status !== 'draft');
  const draftEvents = events.filter((event) => event.status === 'draft');
  const sortByDate = (a: Event, b: Event) => (moment(b.startDate).isAfter(moment(a.startDate)) ? 1 : -1);

  const ongoingEvents = activeEvents
    .filter((event) => moment(new Date()).isBetween(moment(event.startDate), moment(event.endDate), 'day', '[]'))
    .sort(sortByDate);
  const upcomingEvents = activeEvents
    .filter(
      (event) =>
        moment(new Date()).isBefore(moment(event.startDate)) && !moment(new Date()).isBetween(moment(event.startDate), moment(event.endDate), 'day', '[]')
    )
    .sort(sortByDate);

  const pastEvents = activeEvents
    .filter((event) => moment(event.startDate).isBefore(moment(new Date())) && moment(event.endDate).isBefore(moment(new Date())))
    .sort(sortByDate);

  return [
    {
      id: 'draft-events',
      name: 'Draft Events',
      events: draftEvents
    },
    {
      id: 'ongoing-events',
      name: 'Ongoing Events',
      events: ongoingEvents
    },
    {
      id: 'upcoming-events',
      name: 'Upcoming Events',
      events: upcomingEvents
    },
    {
      id: 'past-events',
      name: 'Past Events',
      events: pastEvents
    }
  ];
};
