import { AuthSession } from 'aws-amplify/auth';

export const COGNITO_GROUPS = ['admin', 'super_admin'] as const;

export type CognitoGroupType = (typeof COGNITO_GROUPS)[number];

type CustomCognitoAttributes = 'id' | 'role' | 'is_first_sign_in';

export const COGNITO_GROUPS_KEY = 'cognito:groups';

export const COGNITO_CUSTOM_ATTRIBUTES: Record<CustomCognitoAttributes, string> = {
  id: 'custom:entity_id',
  role: 'custom:role',
  is_first_sign_in: 'custom:is_first_sign_in'
};

export const getUserAttributes = (session?: AuthSession) => {
  if (!session) {
    return null;
  }

  const userAttributes = session?.tokens?.idToken?.payload;
  // const id = userAttributes?.[COGNITO_CUSTOM_ATTRIBUTES.id]?.toString(); //TODO: Utilize ID
  const id = userAttributes?.sub;
  const email = userAttributes?.['email']?.toString();

  const groups = userAttributes?.['cognito:groups'];
  const isAdmin = Array.isArray(groups) && groups.some((x): x is CognitoGroupType => COGNITO_GROUPS.includes((x?.toString() || '') as CognitoGroupType));
  const isSuperAdmin = Array.isArray(groups) && groups.some((x) => x === 'super_admin');

  const picture = userAttributes?.picture?.toString();
  const userName = userAttributes?.name?.toString();

  if (!id || !email || !groups) {
    return null;
  }

  return {
    id,
    email,
    groups,
    picture,
    userName,
    isAdmin,
    isSuperAdmin
  };
};

export type CurrentUser = ReturnType<typeof getUserAttributes>;
