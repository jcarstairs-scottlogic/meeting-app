/**
  * Renders the 'discuss motion' component
  * @param {string} sponsor - the name of the sponsor of the motion
  * @param {string} text - the text of the motion
  * @returns {HTMLElement} - the rendered 'discuss motion' component
  */
export default function renderDiscussMotion(sponsor, text) {
  const discussMotion = document.createElement('section');

  const heading = document.createElement('h1');
  heading.textContent = `${sponsor}’s motion is on the table`;
  discussMotion.appendChild(heading);

  const textP = document.createElement('p');
  if (text[text.length - 1] !== '.') {
    text += '.';
  }
  textP.textContent = `${sponsor} moved that ${text}`;
  discussMotion.appendChild(textP);

  const instructionsP = document.createElement('p');
  instructionsP.textContent = `
    Discuss the motion. When the floor is ready to vote,
    activate the button below.
  `;
  discussMotion.appendChild(instructionsP);

  const voteButton = document.createElement('button');
  voteButton.textContent = 'Vote';
  voteButton.addEventListener('click', () => {
    const feed = motionWasPut.parentElement;
    const vote = renderVote(sponsor, text);
    feed.appendChild(vote);
    motionWasPut.remove();
    vote.focus();
  });
  discussMotion.appendChild(voteButton);

  return discussMotion;
}

