if (typeof polyfillDOM !== 'function') {
  function polyfillDOM(method, url) {
    return new Promise(function (resolve, reject) {
      let xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://cdnjs.cloudflare.com/ajax/libs/webcomponentsjs/1.2.0/webcomponents-sd-ce.js');
      xhr.onload = function () {
        if (this.status >= 200 && this.status < 300) {
          resolve(xhr.response);
        } else {
          reject({
            status: this.status,
            statusText: xhr.statusText
          });
        }
      };
      xhr.onerror = function () {
        reject({
          status: this.status,
          statusText: xhr.statusText
        });
      };
      xhr.send();
    });
  }
}

polyfillDOM().then(() => {

  class ActionButton extends HTMLElement {

    static get observedAttributes() { return ['disabled', 'size', 'theme']; }

    constructor() {
      super();
      this._root = null;
      this._state = {
        size: 'large',
        theme: 'primary',
        disabled: false
      };
    }

    connectedCallback() {
      if (this._root === null) {
        if (!!this.attachShadow) {
          this._root = this.attachShadow({ mode: "open" });
        } else {
          this._root = this;
        }
      }
      this._render();
    }

    attributeChangedCallback(name, oldValue, newValue) {
      if (newValue === oldValue) { return };
      if (name === 'size') { this._state.size = newValue; }
      if (name === 'disabled') { this._state.disabled = !!newValue }
      if (name === 'theme') { this._state.theme = newValue; }
      this._render();
    }

    get size() { return this._state.size; }
    get theme() { return this._state.theme; }

    _render() {

      if (!!this._root) {
        let $template = document.createElement("template");
        $template.id = 'action-button-template';
        $template.innerHTML = `
          <style>
            :host {
              overflow: hidden;
              display: inline-block;
              outline-color: rgba(255,255,255,0);
            }

            .input-button {
              -webkit-user-select: none;
              user-select: none;
              --webkit-appearance: none;
              display: inline-block;
              border: solid 1px;
              border-radius: 4px;
              cursor: pointer;
              max-width: 100%;
              width: auto;
              font: normal normal 500 1rem/1 Roboto, Helvetica, Arial, sans-serif;
              text-align: center;
              text-transform: capitalize;
              margin: 0;
              transition-duration: 0.25s;
              transition-timing-function: ease-in;
              transition-property: background, color;
            }

            .dark-theme {
              background-color: #424242;
              background-color: var(--colors--buttons-cancel-bckground, #424242);
              color: #eee;
              color: var(--colors--buttons-cancel-default, #eee);
              outline-color: #eee;
              outline-color: var(--colors--buttons-cancel-default, #eee);
              border-color: #eee;
              border-color: var(--colors--buttons-cancel-default, #eee);
            }

            .dark-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              background-color: #bdbdbd;
              background-color: var(--colors--buttons-cancel-disabled, #bdbdbd);
            }
            
            .dark-theme.active,
            .dark-theme:hover {
              background-color: rgba(66, 66, 66, 0.6);
              background-color: var(--colors--buttons-cancel-active, rgba(66, 66, 66, 0.6));
            }

            .primary-theme {
              background-color: #7dc243;
              background-color: var(--colors--buttons-primary-bckground, #7dc243);
              color: #fff;
              color: var(--colors--buttons-primary-default, #fff);
              outline-color: #7dc243;
              outline-color: var(--colors--buttons-primary-bckground, #7dc243);
              border-color: #7dc243;
              border-color: var(--colors--buttons-primary-bckground, #7dc243);
            }

            .primary-theme.active,
            .primary-theme:hover {
              background-color: #4c7827;
              background-color: var(--colors--buttons-primary-active, #4c7827);
            }

            .primary-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              border-color: rgba(125, 194, 67, 0.6);
              border-color: var(
                --colors--buttons-primary-disabled,
                rgba(125, 194, 67, 0.6)
              );
              background-color: rgba(125, 194, 67, 0.6);
              background-color: var(
                --colors--buttons-primary-disabled,
                rgba(125, 194, 67, 0.6)
              );
            }

            .secondary-theme {
              background-color: #3777bc;
              background-color: var(--colors--buttons-secondary-bckground, #3777bc);
              color: #fff;
              color: var(--colors--buttons-secondary-default, #fff);
              outline-color: #3777bc;
              outline-color: var(--colors--buttons-secondary-bckground, #3777bc);
              border-color: #3777bc;
              border-color: var(--colors--buttons-secondary-bckground, #3777bc);
            }

            .secondary-theme.active,
            .secondary-theme:hover {
              background-color: #20456d;
              background-color: var(--colors--buttons-secondary-active, #20456d);
            }

            .secondary-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              border-color: rgba(55, 119, 188, 0.6);
              border-color: var(
                --colors--buttons-secondary-disabled,
                rgba(55, 119, 188, 0.6)
              );
              background-color: rgba(55, 119, 188, 0.6);
              background-color: var(
                --colors--buttons-secondary-disabled,
                rgba(55, 119, 188, 0.6)
              );
            }

            .tertiary-theme {
              background-color: #fff;
              background-color: var(--colors--buttons-tertiary-background, #fff);
              color: #3777bc;
              color: var(--colors--buttons-tertiary-default, #3777bc);
              outline-color: #3777bc;
              outline-color: var(--colors--buttons-tertiary-default, #3777bc);
              border-color: #3777bc;
              border-color: var(--colors--buttons-tertiary-default, #3777bc);
            }

            .tertiary-theme.active,
            .tertiary-theme:hover {
              background-color: #3777bc;
              background-color: var(--colors--buttons-tertiary-background-active, #3777bc);
              color: #fff;
              color: var(--colors--buttons-tertiary-active, #fff);
            }

            .tertiary-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              background-color: #fff;
              background-color: var(--colors--buttons-tertiary-background-disabled, #fff);
              color: rgba(55, 119, 188, 0.6);
              color: var(--colors--buttons-tertiary-disabled-default, rgba(55, 119, 188, 0.6));
            }
            .quarternary-theme {
              background-color: rgba(255,255,255,0);
              background-color: var(--colors--buttons-quarterary-background, rgba(255,255,255,0));
              color: #2c5f96;
              color: var(--colors--buttons-quarternary-default, #2c5f96);
              outline-color: rgba(255,255,255,0);
              outline-color: var(--colors--buttons-quarternary-default, rgba(255,255,255,0));
              border-color: rgba(255,255,255,0);
              border-color: var(--colors--buttons-quarternary-default, rgba(255,255,255,0));
            }

            .quarternary-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              background-color: rgba(255,255,255,0);
              background-color: var(--colors--buttons-quarternary-background-disabled, rgba(255,255,255,0));
              color: #3777bc;
              color: var(--colors--buttons-quarternary-disabled, #3777bc);
            }

            .flat-theme {
              background-color: rgba(255, 255, 255, 0);
              background-color: var(--colors--buttons-flat-bckground, rgba(255, 255, 255, 0));
              color: #3777bc;
              color: var(--colors--buttons-flat-default,  #3777bc);
              outline-color: rgba(255, 255, 255, 0);
              outline-color: var(--colors--buttons-flat-bckground, rgba(255, 255, 255, 0));
              border-color: rgba(255, 255, 255, 0);
              border-color: var(--colors--buttons-flat-bckground, rgba(255, 255, 255, 0));
            }

            .flat-theme.active,
            .flat-theme:hover {
              background-color: #cedff1;
              background-color: var(--colors--buttons-secondary-active, #cedff1);
            }

            .flat-theme.disabled {
              cursor: not-allowed;
              opacity: 0.6;
              border-color: rgba(55, 119, 188, 0.6);
              border-color: var(
                --colors--buttons-secondary-disabled,
                rgba(55, 119, 188, 0.6)
              );
              background-color: rgba(55, 119, 188, 0.6);
              background-color: var(
                --colors--buttons-secondary-disabled,
                rgba(55, 119, 188, 0.6)
              );
            }

            .small {
              min-width: 60px;
              padding: 11px 16px;
            }

            .large {
              min-width: 80px;
              line-height: 19px;
              padding: 15px 16px;
            }

            @media screen and (min-width: 1440px) {
              .small {
                font-size: 1rem;
                line-height: 1;
              }
            }

            @media screen and (min-width: 580px) {
              .small {
                width: auto;
              }
            }
          </style>
          <button ${this._state.disabled ? 'disabled' : ''}  class="input-button ${this._state.disabled ? 'disabled' : ''} ${this._state.theme}-theme ${this.size}" type="button">
            ${!!this.attachShadow ? '<slot></slot>' : this._root.innerHTML}
          </button>
          `;
        this._root.appendChild(document.importNode($template.content, true));
      }
    }

  }
  if (!(!!customElements.get('action-button'))) {
    customElements.define('action-button', ActionButton);
  }
});