import { createApi } from '@/api/utils/createApi';
import { Admin } from '@/model/admin';

export const inviteAdmin = (admin: Admin) =>
  createApi({
    method: 'post',
    authorize: true,
    url: `/admin/auth/invite`,
    apiService: 'auth',
    body: { ...admin }
  });

export const getAllAdmins = () => {
  return createApi<Admin[]>({
    method: 'get',
    authorize: true,
    apiService: 'auth',
    url: '/admin/auth'
  });
};

export const getAdmin = (entryId: string) =>
  createApi<Admin>({
    method: 'get',
    authorize: true,
    apiService: 'auth',
    url: `/admin/auth${entryId}`
  });

export const updateAdmin = (entryId: string, admin: Admin) =>
  createApi<Admin>({
    method: 'put',
    authorize: true,
    url: `/admin/auth/${entryId}`,
    apiService: 'auth',
    body: { ...admin }
  });

export const deleteAdmin = (entryId: string) =>
  createApi({
    method: 'delete',
    authorize: true,
    apiService: 'auth',
    url: `/admin/auth/${entryId}`
  });
