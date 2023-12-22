import renderAnyOtherBusiness from './aob.js';
import renderDiscussMotion from './discuss_motion.js';

/**
  * Renders a form whereby the user can either put a motion or return to AOB.
  * @returns {HTMLFormElement} The put motion form.
  */
export default function renderPutMotionForm() {
  const sederuntUl = document.getElementById('sederunt');
  const sederunt = [];
  for (const li of sederuntUl.getElementsByTagName('li')) {
    sederunt.push(li.textContent);
  }

  const form = document.createElement('form');
  form.setAttribute('class', 'put-motion-form');

  const motionDiv = document.createElement('div');
  motionDiv.setAttribute('class', 'put-motion-form__motion');
  form.appendChild(motionDiv);

  const sponsorCombobox = document.createElement('select');
  sponsorCombobox.id = 'put-motion-form-sponsor';
  sponsorCombobox.setAttribute('aria-label', 'Sponsor');
  sponsorCombobox.setAttribute('class', 'put-motion-form__sponsor');
  sponsorCombobox.setAttribute('required', '');
  for (const attendee of sederunt) {
    const option = document.createElement('option');
    option.value = attendee;
    option.textContent = attendee;
    sponsorCombobox.appendChild(option);
  }
  motionDiv.appendChild(sponsorCombobox);

  const movesThatP = document.createElement('p');
  movesThatP.textContent = 'moves that';
  movesThatP.setAttribute('aria-hidden', 'true');
  movesThatP.setAttribute('class', 'put-motion-form__moves-that');
  motionDiv.appendChild(movesThatP);

  const motionTextInput = document.createElement('textarea');
  motionTextInput.setAttribute('aria-label', 'Motion text');
  motionTextInput.setAttribute('class', 'put-motion-form__text');
  motionTextInput.setAttribute('type', 'text');
  motionTextInput.setAttribute('required', '');
  motionTextInput.addEventListener('input', () => {
    motionTextInput.style.height = 'auto';
    motionTextInput.style.height = (motionTextInput.scrollHeight + 3) + 'px';
  });
  motionDiv.appendChild(motionTextInput);

  const buttons = document.createElement('div');
  buttons.setAttribute('class', 'put-motion-form__buttons');
  form.appendChild(buttons);

  const putButton = document.createElement('button');
  putButton.setAttribute('type', 'submit');
  putButton.textContent = 'Put motion';
  buttons.appendChild(putButton);

  const cancelButton = document.createElement('button');
  cancelButton.setAttribute('type', 'button');
  cancelButton.setAttribute('class', 'button--neutral');
  cancelButton.textContent = 'Cancel';
  cancelButton.addEventListener('click', () => {
    const feed = form.parentElement;
    const aob = renderAnyOtherBusiness();
    feed.appendChild(aob);
    form.remove();
    aob.focus();
  });
  buttons.appendChild(cancelButton);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const feed = form.parentElement;
    const discussMotion = renderDiscussMotion(
      sponsorCombobox.value,
      motionTextInput.value
    );
    feed.appendChild(discussMotion);
    form.remove();
    discussMotion.focus();
    discussMotion.scrollIntoView();
  });

  return form;
}

