/** @typedef {import('../types/meeting_details.js').MeetingDetails} */

/**
  * Renders an entry in the minutes saying that the meeting was called to order.
  * @param {MeetingDetails} meetingDetails - The meeting details.
  * @returns {HTMLElement} The rendered entry.
  */
export default function renderMeetingCalledToOrderMinuteEntry(meetingDetails) {
  const minuteEntry = document.createElement('section');

  const headingMeetingTitle = document.createElement('h2');
  headingMeetingTitle.setAttribute('id', 'meeting-title');
  headingMeetingTitle.textContent = meetingDetails.title;
  minuteEntry.appendChild(headingMeetingTitle);

  const pCalledToOrder = document.createElement('p');
  pCalledToOrder.innerHTML = `
    The meeting was called to order at
    <time
      id="time-meeting-called-to-order"
      datetime=${meetingDetails.unixStart}
    >
      ${meetingDetails.localStartTime} on ${meetingDetails.localStartDate}
    </time>.
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

