import { now, today } from './datetime.js';

/**
  * Renders the meeting adjournment minutes entry and appends it to the feed.
  * @param {HTMLElement} feed - The minutes feed
  * @returns {void}
  */
export function renderMeetingAdjournment(feed) {
  const minutesEntry = document.createElement('section');

  const heading = document.createElement('h1');
  heading.textContent = 'Meeting adjourned';
  minutesEntry.appendChild(heading);

  const p = document.createElement('p');
  p.textContent = `The meeting was adjourned at ${now()} on ${today()}.`;
  minutesEntry.appendChild(p);

  feed.appendChild(minutesEntry);
}
