import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { inviteAdmin } from '@/api/admin';
import { CustomAxiosError } from '@/api/utils/createApi';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { useApi } from './useApi';
import { zodResolver } from '@hookform/resolvers/zod';

const AdminFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  firstName: z.string().min(1, {
    message: "Please enter the admin's first name"
  }),
  lastName: z.string().min(1, {
    message: "Please enter the admin's last name"
  }),
  position: z.string().min(1, {
    message: "Please enter the admin's position"
  }),
  address: z.string().min(1, {
    message: "Please enter the admin's address"
  }),
  contactNumber: z
    .string()
    .min(1, {
      message: "Please enter the admin's contact number"
    })
    .refine(isValidContactNumber, {
      message: 'Please enter a valid PH contact number'
    })
});

export type AdminFormValues = z.infer<typeof AdminFormSchema>;

export const useAdminForm = (onSuccess: () => void) => {
  const { successToast, errorToast } = useNotifyToast();
  const api = useApi();
  const form = useForm<AdminFormValues>({
    mode: 'onChange',
    resolver: zodResolver(AdminFormSchema),
    defaultValues: {
      email: '',
      firstName: '',
      lastName: '',
      position: '',
      address: '',
      contactNumber: ''
    }
  });

  const submit = form.handleSubmit(async (values) => {
    try {
      const response = await api.execute(inviteAdmin(values));
      if (response.status === 200) {
        successToast({
          title: 'Admin Invited Successfully',
          description: `Admin will be sent an Invitation Email`
        });
        onSuccess();
      } else {
        errorToast({
          title: 'Error in Invited Admin',
          description: 'An error occurred while inviting admin. Please try again.'
        });
      }
      return response;
    } catch (e) {
      const { errorData } = e as CustomAxiosError;
      errorToast({
        title: 'Error in logging in',
        description: errorData.message || errorData.detail[0].msg
      });
      return e;
    }
  });

  return {
    form,
    submit
  };
};
