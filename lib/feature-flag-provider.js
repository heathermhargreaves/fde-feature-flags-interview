/**
 * A lightweight stand-in for a Datadog Feature Flags (OpenFeature) provider.
 * It mimics the real-world shape: initialize from a configuration service,
 * then resolve flag values against an evaluation context.
 *
 * This is intentionally self-contained (no network, no dependencies) so the
 * exercise runs anywhere with just `node`.
 */

const { MockDatadogConfigService } = require('./mock-datadog-config-service');

class DatadogFeatureFlagProvider {
  constructor(options = {}) {
    this.environment = options.environment;
    this.configService = options.configService ?? new MockDatadogConfigService();
    this.ready = false;
    this.flags = null;
  }

  async initialize() {
    this.flags = await this.configService.fetchFlags(this.environment);
    this.ready = true;
  }

  resolveBooleanEvaluation(flagKey, defaultValue, context) {
    if (!this.ready || !this.flags || !this.flags[flagKey]) {
      return {
        value: defaultValue,
        reason: 'DEFAULT',
        detail: !this.ready ? 'provider not ready' : 'flag not found',
      };
    }

    const flag = this.flags[flagKey];
    for (const rule of flag.rules) {
      if (context && context[rule.attribute] === rule.value) {
        return {
          value: rule.variant,
          reason: 'TARGETING_MATCH',
          detail: `${rule.attribute} ${rule.operator} ${rule.value}`,
        };
      }
    }
    return { value: flag.defaultVariant, reason: 'DEFAULT', detail: 'no rule matched' };
  }
}

module.exports = { DatadogFeatureFlagProvider };
