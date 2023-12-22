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

  const timeAdjourned = document.createElement('time');
  const unixNow = Date.now();
  timeAdjourned.setAttribute('datetime', unixNow);
  timeAdjourned.textContent = `${now(unixNow)} on ${today(unixNow)}.`;

  const p = document.createElement('p');
  p.textContent = `The meeting was adjourned at `;
  p.appendChild(timeAdjourned);
  minutesEntry.appendChild(p);

  const draftMinutesButton = document.createElement('button');
  draftMinutesButton.textContent = 'Draft minutes';
  draftMinutesButton.addEventListener('click', () => {
    draftMinutesButton.remove();

    heading.outerHTML = '<h2>Meeting adjourned</h2>';
    
    const headingMeetingTitle = document.getElementById('meeting-title');
    const meetingTitle = headingMeetingTitle.textContent;
    const timeStarted = document.getElementById('time-meeting-called-to-order');
    const newHeadingMeetingTitle = document.createElement('h1');
    newHeadingMeetingTitle.innerHTML = `
      Minutes of the ${meetingTitle} at ${timeStarted.outerHTML}
    `;
    headingMeetingTitle.replaceWith(newHeadingMeetingTitle);

    document.title = `
      ${meetingTitle} | ${timeStarted.textContent} | Minutes
    `;

    newHeadingMeetingTitle.scrollIntoView();
  });
  minutesEntry.appendChild(draftMinutesButton);

  return minutesEntry;
}

