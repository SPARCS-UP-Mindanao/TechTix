import { defineBackend } from '@aws-amplify/backend';

const backend = defineBackend({});
backend.addOutput({
  auth: {
    aws_region: 'ap-southeast-1',
    user_pool_id: process.env.COGNITO_POOL_ID,
    user_pool_client_id: process.env.COGNITO_POOL_CLIENT_ID,
    oauth: {
      identity_providers: ['GOOGLE'],
      domain: process.env.COGNITO_DOMAIN_URL!,
      scopes: ['email', 'openid', 'phone', 'profile', 'aws.cognito.signin.user.admin'],
      redirect_sign_in_uri: [`${process.env.FRONTEND_BASE_URL}/signin/callback`],
      redirect_sign_out_uri: [],
      response_type: 'token'
    }
  }
});
