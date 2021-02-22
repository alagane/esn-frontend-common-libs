const getAuthProvider = require('openpaas-auth-client').default;

const DEFAULT_PROVIDER = 'basic';

function getAuth(options, esnAuthConfig) {
  return getAuthProvider(getProvider(esnAuthConfig), {
    ...getSettings(esnAuthConfig),
    ...options
  });
}

function getSettings(esnAuthConfig) {
  if (esnAuthConfig) {
    return esnAuthConfig.authProviderSettings;
  }

  if (typeof process.env.AUTH_PROVIDER_SETTINGS === 'string') {
    try {
      return JSON.parse(process.env.AUTH_PROVIDER_SETTINGS);
    } catch (error) {
      console.log('Cannot get configuration from AUTH_PROVIDER_SETTINGS environment variable');
      throw error;
    }
  }

  return process.env.AUTH_PROVIDER_SETTINGS;
}

function getProvider(esnAuthConfig) {
  if (esnAuthConfig) {
    return esnAuthConfig.authProvider;
  }

  if (process.env.AUTH_PROVIDER) {
    return process.env.AUTH_PROVIDER;
  }

  return DEFAULT_PROVIDER;
}

module.exports = { getAuth };
