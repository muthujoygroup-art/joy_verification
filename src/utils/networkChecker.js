/**
 * Network Connectivity & Pre-Flight Resilience Checker for JOY TrueProfile
 * Validates internet connection before financial transactions, heavy PDF builds, or API calls.
 */

export const isOnline = () => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') return true;
  return navigator.onLine !== false;
};

export const checkNetworkBeforeAction = async (actionName = 'this operation', onOnlineCallback = null) => {
  if (!isOnline()) {
    const errorMsg = `⚠️ You are currently offline. Please check your internet connection before ${actionName}.`;
    return { ok: false, message: errorMsg };
  }

  // Quick light ping test if browser supports it
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3500);
    
    // Quick ping to health or logo
    const res = await fetch('/joy_logo.png?ping=' + Date.now(), { 
      method: 'HEAD', 
      signal: controller.signal,
      cache: 'no-store'
    }).catch(() => null);
    
    clearTimeout(timeoutId);

    if (res && res.status < 500) {
      if (typeof onOnlineCallback === 'function') {
        return await onOnlineCallback();
      }
      return { ok: true };
    }
  } catch (e) {
    // If ping fails or times out, proceed based on navigator.onLine
  }

  if (typeof onOnlineCallback === 'function') {
    return await onOnlineCallback();
  }
  return { ok: true };
};
