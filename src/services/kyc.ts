/**
 * KYC (Know Your Customer) service abstraction layer.
 *
 * This file is the single integration point for any third-party age/identity
 * verification provider. To swap providers, only this file needs to change.
 *
 * Supported providers (future integration):
 *   - Veriff     → https://veriff.com
 *   - Sumsub     → https://sumsub.com
 *   - Persona    → https://withpersona.com
 *   - Onfido     → https://onfido.com
 *   - Didit      → https://didit.me
 *   - AU10TIX    → https://au10tix.com
 *
 * Current state: MOCK — no real verification is performed.
 * No ID documents are uploaded or stored.
 *
 * DISCLAIMER: Age verification through this app may assist with club entry,
 * but venues may still require a physical government-issued ID.
 */

export type KYCStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export interface KYCResult {
  status: KYCStatus;
  verifiedAt?: string;
  provider?: string;
  sessionId?: string;
}

/** Replace this with a real provider SDK call when ready. */
export async function startKYCSession(_userId: string): Promise<KYCResult> {
  // TODO: integrate provider SDK here
  // e.g. Veriff: await veriff.createSession({ person: { ... } })
  return { status: 'pending', provider: 'mock', sessionId: 'mock-session-001' };
}

/** Fetch the current verification status for a user. */
export async function getKYCStatus(_userId: string): Promise<KYCResult> {
  // TODO: call provider API to check status
  return { status: 'unverified' };
}
