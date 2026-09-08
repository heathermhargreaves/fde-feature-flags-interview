# Datadog Feature Flags — FDE Pairing Exercise

This is a 45-minute, collaborative debugging exercise. Treat the interviewer
like the customer or an engineer on the customer's team: ask questions, explain
what you are testing, and make changes directly in the repository.

## Setup

Requirements: Node.js 16 or newer. There are no dependencies, network calls,
or Datadog credentials required.

Start the application:

```sh
npm start
```

In a second terminal, send requests:

```sh
curl "http://localhost:3000/checkout?userId=user-42&plan=beta"
curl "http://localhost:3000/checkout?userId=user-7&plan=free"
```

If port 3000 is already in use, stop the previous Node process before starting
another server.

## Customer ticket

> **Subject: Beta checkout flag not rolling out**
>
> We enabled `new-checkout-flow` for beta-plan customers in production last
> week. The flag configuration targets customers where `plan == beta`.
>
> In production, beta customers keep seeing the old checkout. An on-call
> engineer also reported inconsistent behavior immediately after a deploy,
> although they could not reliably reproduce it.
>
> Can you identify what is happening and recommend a safe fix?

## Your task

1. Reproduce the reported behavior.
2. Gather enough evidence to explain the flag evaluation result.
3. Identify the relevant root causes.
4. Implement or describe a safe fix and explain how you would verify it.
5. Discuss what telemetry would make this easier to diagnose in production.

You may inspect and change all application code. The important files are:

- `server.js` — HTTP request handling and evaluation context
- `lib/openfeature-client.js` — minimal OpenFeature-style client
- `lib/feature-flag-provider.js` — local provider and evaluation logic
- `lib/mock-datadog-config-service.js` — offline flag configuration service

There may be more than one contributing issue. Prioritize a clear debugging
process over finding issues quickly.
