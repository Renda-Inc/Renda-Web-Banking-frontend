// Client error reporting for the root error boundary.
//
// Errors are logged to the console with their boundary context. Wire this to
// a real monitoring service (Sentry, Datadog, etc.) when one is adopted:
// this function is the single place that needs to change.

export function reportError(error: unknown, context: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;
  // Loaders and server functions commonly throw a raw Response; String(it) is
  // the opaque "[object Response]", so pull out the status and URL instead.
  const message =
    error instanceof Response
      ? `Response ${error.status}${error.url ? ` at ${error.url}` : ""}`
      : error instanceof Error
        ? error.message
        : String(error);
  console.error("[renda-web] error boundary", {
    message,
    route: window.location.pathname,
    ...(error instanceof Error && error.stack ? { stack: error.stack } : {}),
    ...context,
  });
}
