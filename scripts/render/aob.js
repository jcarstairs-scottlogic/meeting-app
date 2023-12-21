import renderMeetingAdjournment from './adjourn.js';

/**
  * Renders an AOB component, which presents the user with options to conduct
  * some more business or to adjourn the meeting.
  * @returns {HTMLElement} - The AOB component.
  */
export default function renderAnyOtherBusiness() {
  const aob = document.createElement('section');
  aob.id = "aob";
  aob.setAttribute('class', 'aob');

  const heading = document.createElement('h1');
  heading.textContent = 'Any other business?'
  aob.appendChild(heading);

  const buttons = document.createElement('div');
  buttons.setAttribute('class', 'aob__buttons');
  aob.appendChild(buttons);

  const moveButton = document.createElement('button');
  moveButton.textContent = 'Put a motion';
  moveButton.addEventListener('click', putMotion);
  buttons.appendChild(moveButton);

  const adjournButton = document.createElement('button');
  adjournButton.textContent = 'Adjourn the meeting';
  adjournButton.addEventListener('click', adjourn);
  buttons.appendChild(adjournButton);

  return aob;
}

function putMotion() {
  window.alert('Putting motion');
}

function adjourn() {
  const aob = document.getElementById('aob');
  const feed = aob.parentElement;
  aob.remove();
  feed.appendChild(renderMeetingAdjournment());
}

