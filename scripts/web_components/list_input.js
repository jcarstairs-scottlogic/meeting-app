/**
  * A form control which allows the user to enter a list of string values and
  * add and remove items from the list.
  *
  * It has the following attributes (along with those inherited from HTMLElement):
  *
  * - `required` (boolean): If present, there must be at least one item in the
  *   list for the control to be considered valid.
  * - `allowempty` (boolean): If present, list items can be empty.
  * - `itemdesc` (string): The description of the item type. Defaults to 'item'.
  * - `itemplaceholder` (string): The placeholder text for the item inputs.
  *   Defaults to `itemdesc` with the first character capitalised.
  *
  * Notice that setting both `allowempty` and `required` together has no effect
  * except in the case where the user manages to remove all the inputs, which
  * would require manually altering the HTML, since there is no 'delete' button
  * on the last list item when `required` is set.
  */
class ListInput extends HTMLElement {
  static get formAssociated() {
    return true;
  }

  constructor() {
    super();
    this._internals = this.attachInternals();
  }

  /**
    * Does:
    *
    * - Ensures this element has an ID.
    * - If there is no <ul> element, creates one.
    * - If the <ul> has no children, appends a valid list item.
    * - Ensures, for every <li> within the <ul>:
    *   - The first <label> is a valid label for an input
    *   - The first <input> is a valid input
    *   - The first <button> is a valid delete button, unless it’s the first
    *     item and the `required` attribute is present, in which case it is
    *     removed.
    * - If there is no <button> element, creates one.
    * - Ensures the first <button> element is a valid 'Add item' button.
    * - Updates the value.
    *
    * Does not:
    *
    * - Ensure the pre-existing state is valid except as specified above.
    */
  connectedCallback() {
    const id = this.id ?? `list-input-${crypto.randomUUID()}`;
    this.setAttribute('id', id);

    let ul = this.getElementsByTagName('ul')?.[0];
    if (!ul) {
      this.appendChild(ul = document.createElement('ul'));
    }
    if (!ul.getElementsByTagName('li').length) {
      ul.appendChild(this._renderListItem(0));
    } else {
      // Ensure <li> elements are vaguely functional as per method docstring.
      // Doesn’t guarantee they’ll definitely function if mis-authored.
      let counter = 0;
      for (const li of ul.getElementsByTagName('li')) {
        const label = li.querySelector('label');
        this._configureLabel(label, counter);

        const input = li.querySelector('input');
        this._configureInput(input, counter);

        const deleteButton = li.querySelector('button');
        const deleteButtonShouldExist = !(
          counter === 0 && this.hasAttribute('required')
        );
        if (deleteButton && !deleteButtonShouldExist) {
          deleteButton.remove();
        } else if (deleteButton && deleteButtonShouldExist) {
          this._configureDeleteButton(deleteButton, li);
        } else if (!deleteButton && deleteButtonShouldExist) {
          const newButton = document.createElement('button');
          this._configureDeleteButton(newButton, li);
          li.appendChild(newButton);
        } /* else if (!deleteButton && !deleteButtonShouldExist) {
          no action needed!
        } */

        counter++;
      }
    }

    // This can run async while we render the 'Add item' button
    const updateCountersPromise = this._updateCounters();

    /* @type {HTMLButtonElement} */
    let addButton = this.querySelector(':scope > button');
    if (!addButton) {
      this.appendChild(addButton = document.createElement('button'));
    }
    addButton.setAttribute('type', 'button');
    addButton.ariaLabel = `Add ${this.itemDesc}`;
    addButton.textContent = '+';
    addButton.addEventListener('click', async () => {
      const counter = ul.children.length;
      const id = this.id;
      const li = this._renderListItem(counter);
      ul.appendChild(li);
      li.getElementsByTagName('input')[0].focus();
      this._updateValue();
      this._updateValidity();
    });

    updateCountersPromise.then(async () => {
      await this._updateValue();
      await this._updateValidity();
    });
  }

  async _updateValue() {
    const id = this.id;

    const values = [];

    let counter = 0;
    while (true) {
      /** @type {HTMLInputElement} */
      const input = this.querySelector(`#${id}-input-${counter}`);
      if (!input) {
        break;
      }
      values.push(input.value);
      counter++;
    }

    this.value = values;
  }

  async _updateValidity() {
    const value = this.value;

    /** @returns {HTMLInputElement} */
    const getFirstEmptyInput = () =>
      [...this.getElementsByTagName('input')]
      .find((input) => input.value === '');
    /** @returns {HTMLButtonElement} */
    const getAddButton = () => this.querySelector(':scope > button');
    const isEmpty = /** @param str {string} */ (str) => str === '';

    if (this.required && value.length === 0) {
      this._internals.setValidity(
        { valueMissing: true },
        `Please enter at least one ${this.itemDesc}.`,
        getAddButton()
      );
      return;
    }

    if (this.required && !this.allowEmpty && value.every(isEmpty)) {
      this._internals.setValidity(
        { valueMissing: true },
        `Please enter at least one ${this.itemDesc}.`,
        getFirstEmptyInput()
      );
      return;
    }

    if (!this.allowEmpty && value.some(isEmpty)) {
      this._internals.setValidity(
        { valueMissing: true },
        `Please enter a value for each ${this.itemDesc}.`,
        getFirstEmptyInput()
      );
      return;
    }

    // Value is valid
    this._internals.setValidity({});
  }

  /**
    * Renders a list item.
    * @param counter {number} - The number of the list item to render.
    * @returns {HTMLLIElement} The rendered list item. It’s the consumer’s
    * responsibility to append this to the <ul>.
    */
  _renderListItem(counter) {
    const li = document.createElement('li');

    const label = document.createElement('label');
    this._configureLabel(label, counter)
    li.appendChild(label);

    const input = document.createElement('input');
    this._configureInput(input, counter);
    li.appendChild(input);

    // If 'required' attribute is true, the first item cannot be deleted
    if (counter !== 0 && this.hasAttribute('required')) {
      const deleteButton = document.createElement('button');
      this._configureDeleteButton(deleteButton, li);
      li.appendChild(deleteButton);
    }

    return li;
  }

  /**
    * Sets attributes and the text content on a label for an attendee input.
    * @param label {HTMLLabelElement} - The label element to configure
    * @param counter {number} - The number of the list item to render.
    * @returns {void}
    */
  _configureLabel(label, counter) {
    label.setAttribute('for', `${this.id}-input-${counter}`);
    label.textContent = 'Name';
  }

  /**
    * Sets attributes and event listeners on an attendee input.
    * @param input {HTMLInputElement} - The input element to configure.
    * @param counter {number} - The number of the list item to render.
    * @returns {void}
    */
  _configureInput(input, counter) {
    input.setAttribute('id', `${this.id}-input-${counter}`);
    input.setAttribute('type', 'text');
    input.setAttribute('placeholder', `${this.itemPlaceholder} ${counter + 1}`);
    input.addEventListener('change', async () => {
      await this._updateValue();
      await this._updateValidity();
    });
  }

  /**
    * Sets attributes and event listeners on a delete button.
    * @param deleteButton {HTMLButtonElement} - The button element to configure.
    * @param li {HTMLLIElement} - The list item to remove when the button is clicked.
    * @returns {void}
    */
  _configureDeleteButton(deleteButton, li) {
    deleteButton.setAttribute('type', 'button');
    deleteButton.ariaLabel = `Remove ${this.itemDesc}`;
    deleteButton.textContent = 'x';
    deleteButton.addEventListener('click', async () => {
      li.remove();
      await this._updateCounters();
      await this._updateValue();
      await this._updateValidity();
    });
  }

  async _updateCounters() {
    const ul = this.getElementsByTagName('ul')?.[0];
    for (let i = 0; i < ul.children.length; i++) {
      const li = ul.children[i];
      const label = li.querySelector('label');
      label.setAttribute('for', `${this.id}-input-${i}`);
      const input = li.querySelector('input');
      input.setAttribute('id', `${this.id}-input-${i}`);
      input.setAttribute('placeholder', `${this.itemPlaceholder} ${i + 1}`);
    }
  }

  /**
    * Whether empty list items are considered valid.
    * @returns {boolean}
    */
  get allowEmpty() {
    return this.hasAttribute('allowempty');
  }

  /**
    * The item description with the first character capitalised.
    * @returns {string}
    */
  get capitalizedItemDesc() {
    const itemDesc = this.itemDesc;
    return `${itemDesc[0].toLocaleUpperCase()}${itemDesc.slice(1)}`;
  }

  /**
    * The ID of this component.
    * @returns {string}
    */
  get id() {
    return this.getAttribute('id');
  }

  /**
    * The item description. Defaults to 'item'.
    * @returns {string}
    */
  get itemDesc() {
    return this.getAttribute('itemdesc') ?? 'item';
  }

  /**
    * The placeholder to display in inputs in list items.
    * @returns {string}
    */
  get itemPlaceholder() {
    return this.getAttribute('itemplaceholder') ?? this.capitalizedItemDesc;
  }

  /**
    * Whether there must be at least one list item for the value to be valid.
    * @returns {boolean}
    */
  get required() {
    return this.hasAttribute('required');
  }

  /**
    * Gets the value of this component.
    * @returns {string[]}
    */
  get value() {
    return this._value ?? [];
  }

  /**
    * Sets the value of this component.
    * @param newValue {string[]} - The list of values in each of the inputs.
    */
  set value(newValue) {
    this._value = newValue;
    const stringified = JSON.stringify(newValue);
    this.setAttribute('value', stringified);
    this._internals.setFormValue(stringified);
  }
}

export default ListInput;

if (!customElements.get('list-input')) {
  customElements.define('list-input', ListInput);
}

