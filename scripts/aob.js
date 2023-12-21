import { renderMeetingAdjournment } from './adjourn.js';

/**
  * Renders an AOB component, which presents the user with options to conduct
  * some more business or to adjourn the meeting.
  * @param feed {HTMLElement} - The feed to which to append this AOB instance
  * @returns {void}
  */
export function renderAnyOtherBusiness(feed) {
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
  adjournButton.addEventListener('click', () => adjourn(feed));
  buttons.appendChild(adjournButton);

  for (const h1 of document.getElementsByTagName('h1')) {
    h1.remove();
  }

  feed.appendChild(aob);
}

function putMotion() {
  window.alert('Putting motion');
}

/**
  * Adjourns the meeting.
  * @param feed {HTMLElement} - The minutes feed.
  * @returns {void}
  */
function adjourn(feed) {
  const aob = document.getElementById('aob');
  if (aob) {
    aob.remove();
  }

  renderMeetingAdjournment(feed);
}

