import { renderAnyOtherBusiness } from './aob.js';
import { now, today } from './datetime.js';

/**
  * Called when the meeting details form is submitted.
  * @param {SubmitEvent} e - The form submit event.
  */
export function callToOrder(e) {
  e.preventDefault();

  /** @type {HTMLFormElement} */
  const form = e.currentTarget;
  const meetingDetails = getMeetingDetails(form);
  console.debug('Meeting details submitted.', meetingDetails);

  document.getElementsByTagName('title')[0].textContent = `
    Meeting in session: ${meetingDetails.title}
  `;

  const feed = form.parentElement;
  feed.appendChild(renderMeetingCalledToOrderMinuteEntry(meetingDetails));
  form.remove();
  renderAnyOtherBusiness(feed);
}

/**
  * Extracts the meeting details from the meeting details form.
  * @param {HTMLFormElement} form - The meeting details form.
  * @returns {MeetingDetails} The meeting details.
  */
function getMeetingDetails(form) {
  const title = form.querySelector('#meeting-title').value;
  const sederunt = JSON.parse(form.querySelector('#sederunt').value);

  const localStartDate = today();
  const localStartTime = now();

  return { title, sederunt, localStartDate, localStartTime };
}

/**
  * Renders an entry in the minutes saying that the meeting was called to order.
  * @param {MeetingDetails} meetingDetails - The meeting details.
  * @returns {HTMLSectionElement} The rendered entry.
  */
function renderMeetingCalledToOrderMinuteEntry(meetingDetails) {
  const minuteEntry = document.createElement('section');

  const headingCalledToOrder = document.createElement('h2');
  headingCalledToOrder.textContent = 'Meeting called to order';
  minuteEntry.appendChild(headingCalledToOrder);

  const pCalledToOrder = document.createElement('p');
  pCalledToOrder.textContent = `
    The ${meetingDetails.title} meeting was called to order at
    ${meetingDetails.localStartTime} on ${meetingDetails.localStartDate}.
  `;
  minuteEntry.appendChild(pCalledToOrder);

  const headingSederunt = document.createElement('h3');
  headingSederunt.textContent = 'Sederunt';
  minuteEntry.appendChild(headingSederunt);

  const ulSederunt = document.createElement('ul');
  for (const attendee of meetingDetails.sederunt) {
    const li = document.createElement('li');
    li.textContent = attendee;
    ulSederunt.appendChild(li);
  }
  minuteEntry.appendChild(ulSederunt);

  return minuteEntry;
}

/**
 * @typedef {{
 *   title: string,
 *   sederunt: string[],
 *   localStartDate: string,
 *   localStartTime: string
 *  }} MeetingDetails
 */
