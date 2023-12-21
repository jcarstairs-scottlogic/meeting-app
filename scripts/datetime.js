export const today = () => (new Date()).toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

export const now = () => (new Date()).toLocaleTimeString('en-GB', {
  hourCycle: 'h12',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
});

