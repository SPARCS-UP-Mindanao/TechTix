import { useState } from 'react';
import { deleteAdmin } from '@/api/admin';
import { CustomAxiosError } from '@/api/utils/createApi';
import { useApi } from './useApi';
import { useNotifyToast } from './useNotifyToast';

export const useDeleteAdmin = (adminId: string) => {
  const { errorToast, successToast } = useNotifyToast();
  const [isDeletingAdmin, setDeletingAdmin] = useState(false);
  const api = useApi();
  const onDeleteAdmin = async () => {
    try {
      setDeletingAdmin(true);
      const response = await api.execute(deleteAdmin(adminId));
      if (response.status === 204) {
        successToast({
          title: 'Deleted successfully',
          description: 'Admin deleted successfully'
        });
      } else {
        const {
          errorData: { message }
        } = response;
        errorToast({
          title: 'Error in deleting admin',
          description: message || 'An error occurred while deleting admin. Please try again.'
        });
      }
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in deleting admin',
        description: errorData.message || 'An error occurred while deleting admin. Please try again.'
      });
    } finally {
      setDeletingAdmin(false);
    }
  };

  return { onDeleteAdmin, isDeletingAdmin };
};
