// Add custom jest matchers
require('@testing-library/jest-dom');

jest.mock('next-intl', () => ({
  useTranslations: () => (key) => ({
    errorTitle: 'Unable to load Explore',
    errorDescription: 'Something went wrong while loading Explore. Please try again.',
    retry: 'Retry',
    bannerText: 'We use essential cookies to make Chabaqa work.',
    privacyPolicy: 'Privacy Policy',
    settings: 'Settings',
    reject: 'Reject non-essential',
    acceptAll: 'Accept all',
    modalTitle: 'Cookie preferences',
    modalBadge: 'Your privacy, your choice',
    modalDesc: 'Choose which cookies you allow.',
    essentialTitle: 'Essential cookies',
    essentialDesc: 'Required for the site to work.',
    alwaysActive: 'Always active',
    analyticsTitle: 'Enable analytics cookies',
    analyticsDesc: 'Help us improve Chabaqa.',
    savePreferences: 'Save preferences',
  }[key] || key),
}));

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    refresh: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: () => '/admin/dashboard',
  useSearchParams: () => new URLSearchParams(),
}));

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props) => {
    const { src, alt, ...rest } = props;
    return require('react').createElement('img', { src, alt, ...rest });
  },
}));

// Polyfills for Radix UI / floating elements in JSDOM
if (typeof global.ResizeObserver === 'undefined') {
  global.ResizeObserver = class ResizeObserver {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

// Pointer capture APIs used by Radix Select/Popover
if (typeof HTMLElement !== 'undefined') {
  if (typeof HTMLElement.prototype.hasPointerCapture !== 'function') {
    HTMLElement.prototype.hasPointerCapture = () => false;
  }
  if (typeof HTMLElement.prototype.setPointerCapture !== 'function') {
    HTMLElement.prototype.setPointerCapture = () => {};
  }
  if (typeof HTMLElement.prototype.releasePointerCapture !== 'function') {
    HTMLElement.prototype.releasePointerCapture = () => {};
  }
  if (typeof HTMLElement.prototype.scrollIntoView !== 'function') {
    HTMLElement.prototype.scrollIntoView = () => {};
  }
}

if (typeof window !== 'undefined' && typeof window.matchMedia === 'undefined') {
  window.matchMedia = () => ({
    matches: false,
    media: '',
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => false,
  });
}

// Suppress console errors in tests
global.console = {
  ...console,
  error: jest.fn(),
  warn: jest.fn(),
};
