/** @typedef {import('../types/meeting_details.js').MeetingDetails} */

/**
  * Renders an entry in the minutes saying that the meeting was called to order.
  * @param {MeetingDetails} meetingDetails - The meeting details.
  * @returns {HTMLElement} The rendered entry.
  */
export default function renderMeetingCalledToOrderMinuteEntry(meetingDetails) {
  const minuteEntry = document.createElement('section');

  const headingCalledToOrder = document.createElement('h2');
  headingCalledToOrder.textContent = meetingDetails.title;
  minuteEntry.appendChild(headingCalledToOrder);

  const pCalledToOrder = document.createElement('p');
  pCalledToOrder.textContent = `
    The meeting was called to order at
    ${meetingDetails.localStartTime} on ${meetingDetails.localStartDate}.
  `;
  minuteEntry.appendChild(pCalledToOrder);

  const headingSederunt = document.createElement('h3');
  headingSederunt.textContent = 'Sederunt';
  minuteEntry.appendChild(headingSederunt);

  const ulSederunt = document.createElement('ul');
  ulSederunt.id = 'sederunt';
  for (const attendee of meetingDetails.sederunt) {
    const li = document.createElement('li');
    li.textContent = attendee;
    ulSederunt.appendChild(li);
  }
  minuteEntry.appendChild(ulSederunt);

  return minuteEntry;
}

