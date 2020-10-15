const Client = require('./src/structures/Client');

const client = new Client();

const Sentry = require("@sentry/node");
const Tracing = require("@sentry/tracing");

Sentry.init({
  dsn: "https://20454f919fd14b11ac6f24fbd436d5ed@o459376.ingest.sentry.io/5458429",
  tracesSampleRate: 1.0,
});

setTimeout(() => {
  try {
    foo();
  } catch (e) {
    Sentry.captureException(e);
  } finally {
    transaction.finish();
  }
}, 99);

const init = async () => {
    
}