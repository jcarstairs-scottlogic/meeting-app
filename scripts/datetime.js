/**
  * Converts a UNIX epoch into a localised date string.
  * @param unix {number}
  * @returns {string}
  */
export const today = (unix) => (new Date(unix)).toLocaleDateString('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
  year: 'numeric',
});

/**
  * Converts a UNIX epoch into a localised time string.
  * @param unix {number}
  * @returns {string}
  */
export const now = (unix) => (new Date(unix)).toLocaleTimeString('en-GB', {
  hourCycle: 'h12',
  hour: 'numeric',
  minute: 'numeric',
  timeZoneName: 'short',
});

