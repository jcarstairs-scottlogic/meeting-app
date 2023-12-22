import { today, now } from './datetime.js';
import renderCallToOrder from './render/call_to_order.js';
import renderAnyOtherBusiness from './render/aob.js';

/** @typedef {import('../types/meeting_details.js').MeetingDetails} */

export function callToOrder(e) {
  e.preventDefault();

  /** @type {HTMLFormElement} */
  const form = e.currentTarget;
  const meetingDetails = getMeetingDetails(form);
  console.debug('Meeting details submitted.', meetingDetails);

  document.getElementsByTagName('title')[0].textContent = `
    ${meetingDetails.title} | Meeting in session
  `;

  for (const h1 of document.getElementsByTagName('h1')) {
    h1.remove();
  }
  const callToOrder = renderCallToOrder(meetingDetails);
  const aob = renderAnyOtherBusiness();
  form.replaceWith(callToOrder);
  callToOrder.after(aob);

  // It may seem odd to focus to CTO and scroll to the AOB. I reckon focusing
  // the AOB would be super confusing to screen reader users since they won’t
  // know what they’ve missed, but visual users can scroll up if they need to
  // while the actionable bit (the AOB form) is in their face by default.
  callToOrder.focus();
  aob.scrollIntoView();
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

