import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { CustomAxiosError } from '@/api/utils/createApi';
import { Admin } from '@/model/admin';
import { inviteAdmin } from '@/api/admin';
import { isValidContactNumber } from '@/utils/functions';
import { useNotifyToast } from '@/hooks/useNotifyToast';
import { zodResolver } from '@hookform/resolvers/zod';

const AdminFormSchema = z.object({
  email: z.string().email({
    message: 'Please enter a valid email address'
  }),
  firstName: z.string().min(1, {
    message: 'Please enter your first name'
  }),
  lastName: z.string().min(1, {
    message: 'Please enter your last name'
  }),
  position: z.string().min(1, {
    message: 'Please enter your position'
  }),
  address: z.string().min(1, {
    message: 'Please enter your address'
  }),
  contactNumber: z
    .string()
    .min(1, {
      message: 'Please enter your contact number'
    })
    .refine(isValidContactNumber, {
      message: 'Please enter a valid PH contact number'
    })
});

export type AdminFormValues = z.infer<typeof AdminFormSchema>;

export const useAdminForm = (onSuccess: () => void) => {
  const { successToast, errorToast } = useNotifyToast();
  const form = useForm<AdminFormValues>({
    mode: 'onChange',
    resolver: zodResolver(AdminFormSchema)
  });

  const submit = form.handleSubmit(async (values) => {
    const { queryFn: admin } = inviteAdmin(values);
    try {
      const response = await admin();
      if (response.status === 200) {
        successToast({
          title: 'Admin Invited Successfully',
          description: `Admin will be sent an Invitation Email`
        });
        onSuccess()
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
