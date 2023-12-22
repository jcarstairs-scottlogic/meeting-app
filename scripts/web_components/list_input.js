/**
  * A form control which allows the user to enter a list of string values and
  * add and remove items from the list.
  */
class ListInput extends HTMLElement {
  constructor() {
    super();
  }

  /**
    * Does:
    *
    * - Ensures this element has an ID.
    * - If there is no <ul> element, creates one.
    * - If the <ul> has no children, appends a valid list item.
    * - Ensures, for every <li> within the <ul>:
    *   - The first <label> is a valid label for an attendee input
    *   - The first <input> is a valid attendee input
    *   - The first <button> is a valid delete button, unless it’s the first
    *     <li> in the <ul>, in which case it is removed if it exists.
    * - If there is no <button> element, creates one.
    * - Ensures the first <button> element is a valid 'Add attendee' button.
    * - Updates the value.
    *
    * Does not:
    *
    * - Ensure the pre-existing state is valid except as specified above.
    */
  connectedCallback() {
    const id = this.getAttribute('id') ?? crypto.randomUUID();

    let ul = this.getElementsByTagName('ul')?.[0];
    if (!ul) {
      this.appendChild(ul = document.createElement('ul'));
    }
    if (!ul.getElementsByTagName('li').length) {
      ul.appendChild(this._renderListItem(0, id));
    } else {
      // Ensure <li> elements are vaguely functional as per method docstring.
      // Doesn’t guarantee they’ll definitely function if mis-authored.
      let counter = 0;
      for (const li of ul.getElementsByTagName('li')) {
        const label = li.querySelector('label');
        this._configureLabel(label, counter, id);

        const input = li.querySelector('input');
        this._configureInput(input, counter, id);

        const deleteButton = li.querySelector('button');
        if (deleteButton && counter === 0) {
          deleteButton.remove();
        } else if (deleteButton && counter !== 0) {
          this._configureDeleteButton(button, li);
        } else if (/* !deleteButton && */ counter !== 0) {
          const newButton = document.createElement('button');
          this._configureDeleteButton(newButton, li);
          li.appendChild(newButton);
        }

        counter++;
      }
    }

    const updateCountersPromise = this._updateCounters();

    /* @type {HTMLButtonElement} */
    let addButton = this.querySelector(':scope > button');
    if (!addButton) {
      this.appendChild(addButton = document.createElement('button'));
    }
    addButton.setAttribute('type', 'button');
    addButton.ariaLabel = 'Add attendee';
    addButton.textContent = '+';
    addButton.addEventListener('click', () => {
      const counter = ul.children.length;
      const id = this.getAttribute('id');
      const li = this._renderListItem(counter, id);
      ul.appendChild(li);
      li.getElementsByTagName('input')[0].focus();
    });

    updateCountersPromise.then(() => this._updateValue());
  }

  async _updateValue() {
    const id = this.getAttribute('id');

    const sederunt = [];

    let counter = 0;
    while (true) {
      const input = this.querySelector(`#${id}-attendee-${counter}-input`);
      if (!input) {
        break;
      }
      sederunt.push(input.value);
      counter++;
    }

    this['value'] = JSON.stringify(sederunt);
  }

  /**
    * Renders a list item.
    * @param counter {number} - The number of the list item to render.
    * @param id {string} - The ID of the whole component
    * @returns {HTMLLIElement} The rendered list item. It’s the consumer’s
    * responsibility to append this to the <ul>.
    */
  _renderListItem(counter, id) {
    const li = document.createElement('li');

    const label = document.createElement('label', id);
    this._configureLabel(label, counter, id)
    li.appendChild(label);

    const input = document.createElement('input', id);
    this._configureInput(input, counter, id);
    li.appendChild(input);

    if (counter !== 0 /* The first attendee cannot be deleted */) {
      const deleteButton = document.createElement('button');
      this._configureDeleteButton(deleteButton, li);
      li.appendChild(deleteButton);
    }

    return li;
  }

  /**
    * Sets attributes and the text content on a label for an attendee input.
    * @param label {HTMLLabelElement} - The label element to configure
    * @param id {string} - The ID of the whole component
    * @param counter {number} - The number of the list item to render.
    * @returns {void}
    */
  _configureLabel(label, counter, id) {
    label.setAttribute('for', `${id}-attendee-${counter}-input`);
    label.textContent = 'Name';
  }

  /**
    * Sets attributes and event listeners on an attendee input.
    * @param input {HTMLInputElement} - The input element to configure
    * @param id {string} - The ID of the whole component
    * @returns {void}
    */
  _configureInput(input, counter, id) {
    input.setAttribute('id', `${id}-attendee-${counter}-input`);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', `Attendee ${counter + 1}`);
    input.setAttribute('required', true);
    input.addEventListener('change', (_) => this._updateValue());
  }

  /**
    * Sets attributes and event listeners on a delete button.
    * @param deleteButton {HTMLButtonElement} - The button element to configure
    * @param li {HTMLLIElement} - The list item to remove when the button is clicked
    * @returns {void}
    */
  _configureDeleteButton(deleteButton, li) {
    deleteButton.setAttribute('type', 'button');
    deleteButton.ariaLabel = 'Remove attendee';
    deleteButton.textContent = 'x';
    deleteButton.addEventListener('click', () => {
      li.remove();
      this._updateCounters().then(() => this._updateValue());
    });
  }

  async _updateCounters() {
    const id = this.getAttribute('id');
    const ul = this.getElementsByTagName('ul')?.[0];
    for (let i = 0; i < ul.children.length; i++) {
      const li = ul.children[i];
      const label = li.querySelector('label');
      label.setAttribute('for', `${id}-attendee-${i}-input`);
      const input = li.querySelector('input');
      input.setAttribute('id', `${id}-attendee-${i}-input`);
      input.setAttribute('placeholder', `Attendee ${i + 1}`);
    }
  }
}

export default ListInput;

if (!customElements.get('list-input')) {
  customElements.define('list-input', ListInput);
}

