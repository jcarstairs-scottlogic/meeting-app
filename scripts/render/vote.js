import renderAnyOtherBusiness from './aob.js';
import renderVotingResult from './voting_result.js';

/**
  * Renders the voting component
  * @param {string} sponsor - The name of the sponsor of the motion
  * @param {string} text - The text of the motion
  * @returns {HTMLElement} The rendered voting component
  */
export default function renderVote(sponsor, text) {
  const sederunt = document.getElementById('sederunt');
  const numAttendees = sederunt.getElementsByTagName('li').length;

  const votingForm = document.createElement('form');
  votingForm.setAttribute('class', 'voting-form');

  const heading = document.createElement('h1');
  heading.textContent = `Vote on ${sponsor}’s motion`;
  votingForm.appendChild(heading);

  const textP = document.createElement('p');
  textP.textContent = `${sponsor} moves that ${text}`;
  votingForm.appendChild(textP);

  const inFavourLabel = document.createElement('label');
  inFavourLabel.setAttribute('for', 'voting-those-in-favour');
  inFavourLabel.textContent = 'Those in favour';
  votingForm.appendChild(inFavourLabel);

  const inFavourInput = document.createElement('input');
  inFavourInput.id = 'voting-those-in-favour';
  inFavourInput.type = 'number';
  inFavourInput.min = 0;
  inFavourInput.max = numAttendees;
  const validInputs = [...new Array(numAttendees).keys()];
  inFavourInput.setAttribute('pattern', '[' + validInputs.map(i => `(${i})`));
  inFavourInput.setAttribute('required', '');
  votingForm.appendChild(inFavourInput);

  /** @param {Event} e */
  function proceedFromAgainst(e) {
    e.preventDefault();
    const numInFavour = inFavourInput.value;
    const numAgainst = votingForm.querySelector('#voting-those-against').value;
    resolveVoting(sponsor, text, numInFavour, numAgainst, votingForm);
  }

  /** @param {Event} e */
  function proceedFromInFavour(e) {
    e.preventDefault();
    proceedButton.removeEventListener('click', proceedFromInFavour);

    const numInFavour = inFavourInput.value;
    if (numInFavour === 0 || numInFavour > numAttendees / 2) {
      // Resolve early if:
      // (a) nobody is in favour or
      // (b) a majority of those present is in favour
      resolveVoting(sponsor, text, numInFavour, null, votingForm);
      return;
    }

    const [voteAgainstLabel, voteAgainstInput] =
      renderVoteAgainst(numAttendees - numInFavour);
    proceedButton.before(voteAgainstLabel, voteAgainstInput);
    voteAgainstInput.focus();
    // not sure why the timeout is needed
    setTimeout(() =>  proceedButton.scrollIntoView(), 10);
    proceedButton.addEventListener('click', proceedFromAgainst);
  }

  const proceedButton = document.createElement('button');
  proceedButton.textContent = 'Proceed';
  proceedButton.type = 'submit';
  proceedButton.addEventListener('click', proceedFromInFavour);
  votingForm.appendChild(proceedButton);

  return votingForm;
}

/**
  * Renders a numerical input for voting against the motion along with a label
  * @param {number} maxAgainst - The number of attendees minus the number in favour
  * @returns {HTMLElement[]} The rendered numerical input and its label
  */
function renderVoteAgainst(maxAgainst) {
  const againstLabel = document.createElement('label');
  againstLabel.setAttribute('for', 'voting-those-against');
  againstLabel.textContent = 'Those against';
  againstLabel.setAttribute('for', 'against');

  const againstInput = document.createElement('input');
  againstInput.id = 'voting-those-against';
  againstInput.type = 'number';
  againstInput.min = 0;
  againstInput.max = maxAgainst;
  againstInput.setAttribute('required', '');

  return [againstLabel, againstInput];
}

/**
  * Resolves the voting on the motion
  * @param {string} sponsor - The name of the sponsor of the motion
  * @param {string} text - The text of the motion
  * @param {number} numInFavour - The number of attendees in favour of the motion
  * @param {number | null} numAgainst - The number of attendees against the motion
  * @param {HTMLElement} votingForm - The voting form
  * @returns {void}
  */
function resolveVoting(sponsor, text, numInFavour, numAgainst, votingForm) {
  const votingResult = renderVotingResult(sponsor, text, numInFavour, numAgainst);
  votingForm.replaceWith(votingResult);
  const aob = renderAnyOtherBusiness();
  votingResult.after(aob);
  aob.scrollIntoView();
}

