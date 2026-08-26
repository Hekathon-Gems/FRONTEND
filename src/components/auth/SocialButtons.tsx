"use client";

import { useState } from "react";

const PROVIDERS = ["Google", "Facebook", "Apple"];

export function SocialButtons() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div>
      <div className="grid grid-cols-3 gap-3">
        {PROVIDERS.map((provider) => (
          <button
            key={provider}
            type="button"
            onClick={() =>
              setMessage(`${provider} sign-in isn't configured yet.`)
            }
            className="flex h-11 items-center justify-center rounded-md border border-border text-sm font-medium text-text-primary-dark transition-colors hover:border-accent-gold"
          >
            {provider}
          </button>
        ))}
      </div>
      {message && (
        <p className="mt-3 text-center text-xs text-text-muted">{message}</p>
      )}
    </div>
  );
}
