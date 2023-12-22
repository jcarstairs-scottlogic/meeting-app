/**
  * Renders the voting result
  * @param {string} sponsor - The name of the sponsor of the motion
  * @param {string} text - The text of the motion
  * @param {number} numInFavour - The number of attendees in favour of the motion
  * @param {number | null} numAgainst - The number of attendees against the motion
  * @returns {HTMLElement} The rendered voting result
  */
export default function renderVotingResult(sponsor, text, numInFavour, numAgainst) {
  const votingResult = document.createElement('section');

  const result = numInFavour > numAgainst ? 'carried' : 'denied';

  const heading = document.createElement('h2');
  heading.textContent = `${sponsor}’s motion was ${result}`;
  votingResult.append(heading);

  const motionP = document.createElement('p');
  motionP.textContent = `${sponsor} moved that ${text}`;
  votingResult.append(motionP);

  const resultP = document.createElement('p');
  if (numInFavour === 0) {
    resultP.textContent = 'The motion was denied, since nobody was in favour.';
  } else if (numAgainst === null) {
    resultP.textContent = `
      The motion was carried, since ${numInFavour} voted in favour,
      which is an absolute majority of those present.
    `;
  } else {
    resultP.textContent = `
      The motion was ${result}, since ${numInFavour} voted in favour and
      ${numAgainst} voted against.
    `;
  }
  votingResult.append(resultP);

  return votingResult;
}

