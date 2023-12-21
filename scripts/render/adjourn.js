import { now, today } from '../datetime.js';

/**
  * Renders the meeting adjournment minutes entry.
  * @returns {HTMLElement} The meeting adjournment minutes entry.
  */
export default function renderMeetingAdjournment() {
  const minutesEntry = document.createElement('section');

  const heading = document.createElement('h1');
  heading.textContent = 'Meeting adjourned';
  minutesEntry.appendChild(heading);

  const p = document.createElement('p');
  p.textContent = `The meeting was adjourned at ${now()} on ${today()}.`;
  minutesEntry.appendChild(p);

  return minutesEntry;
}

