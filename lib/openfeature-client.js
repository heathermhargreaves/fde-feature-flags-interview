/**
 * Minimal stand-in for the OpenFeature global API surface
 * (OpenFeatureAPI.setProviderAndWait / getClient), trimmed down to just
 * what this demo needs.
 */

let _provider = null;

function setProvider(provider) {
  _provider = provider;
  return provider.initialize(); // returns a promise the caller can await
}

function getClient() {
  return {
    getBooleanValue(flagKey, defaultValue, context) {
      if (!_provider) return defaultValue;
      const result = _provider.resolveBooleanEvaluation(flagKey, defaultValue, context);
      return result.value;
    },
    getBooleanDetails(flagKey, defaultValue, context) {
      if (!_provider) return { value: defaultValue, reason: 'NO_PROVIDER' };
      return _provider.resolveBooleanEvaluation(flagKey, defaultValue, context);
    },
  };
}

module.exports = { setProvider, getClient };
