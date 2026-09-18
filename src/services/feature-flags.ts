/**
 * Intentionally never registered anywhere in this sample - `GreetingBanner` resolves it with
 * `useOptionalInjection()` to demonstrate graceful fallback to `undefined` for an optional
 * dependency, instead of `useInjection()` throwing `ProviderNotFoundError`.
 */
export const FEATURE_FLAGS = Symbol("FEATURE_FLAGS");

export interface FeatureFlags {
    betaBanner: boolean;
}
