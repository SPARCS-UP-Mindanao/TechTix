import { useState } from 'react';
import { deleteEvent } from '@/api/events';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';

export const useDeleteEvent = (eventId: string) => {
  const { errorToast, successToast } = useNotifyToast();
  const [isDeletingEvent, setDeletingEvent] = useState(false);
  const api = useApi();
  const onDeleteEvent = async () => {
    try {
      setDeletingEvent(true);
      const response = await api.execute(deleteEvent(eventId));
      if (response.status === 204) {
        successToast({
          title: 'Deleted successfully',
          description: 'Event deleted successfully'
        });
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in deleting event',
          description: message || 'An error occurred while deleting event. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in deleting event',
        description: errorData.message || 'An error occurred while deleting event. Please try again.'
      });
    } finally {
      setDeletingEvent(false);
    }
  };

  return { onDeleteEvent, isDeletingEvent };
};
