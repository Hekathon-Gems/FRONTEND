"use client";

import { useEffect } from "react";
import * as Sentry from "@sentry/nextjs";

export default function GlobalError({
  error,
}: {
  error: Error & { digest?: string };
}) {
  useEffect(() => {
    Sentry.captureException(error);
  }, [error]);

  return (
    <html lang="en">
      <body>
        <div style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
          <h1 style={{ fontSize: "1.5rem" }}>Something went wrong.</h1>
          <p style={{ marginTop: "0.75rem", color: "#666" }}>
            Please refresh the page. If this keeps happening, contact us at
            hello@hekathongems.com.
          </p>
        </div>
      </body>
    </html>
  );
}
