/**
 * Local stand-in for the Datadog Feature Flags configuration service.
 *
 * There are no network calls or credentials. The fixed delay models the time
 * a real provider might spend fetching its initial configuration and makes
 * startup evaluations easy to reproduce during the exercise.
 */
class MockDatadogConfigService {
  constructor(options = {}) {
    this.minLatencyMs = options.minLatencyMs ?? 5000;
    this.maxLatencyMs = options.maxLatencyMs ?? 5000;
    this.flagsByEnvironment = options.flagsByEnvironment ?? {
      production: {
        'new-checkout-flow': {
          defaultVariant: false,
          rules: [
            { attribute: 'plan', operator: 'eq', value: 'beta', variant: true },
          ],
        },
      },
      staging: {
        'new-checkout-flow': {
          defaultVariant: true,
          rules: [],
        },
      },
    };
  }

  async fetchFlags(environment) {
    const latency =
      this.minLatencyMs + Math.random() * (this.maxLatencyMs - this.minLatencyMs);

    await new Promise((resolve) => setTimeout(resolve, latency));
    return this.flagsByEnvironment[environment] ?? {};
  }
}

module.exports = { MockDatadogConfigService };
