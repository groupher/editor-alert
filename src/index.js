/**
 * Build styles
 */

import "./index.css";

import WarningIcon from "./icon/warning_icon.svg";
import ErrorIcon from "./icon/error_icon.svg";
import SuccessIcon from "./icon/success_icon.svg";

import {
  make,
  enableCtrlEnterBreak,
  addBreakHint,
} from "@groupher/editor-utils";

import { capitalize } from "./utils";

/**
 * Import Tool's icon
 */

/**
 * @class Alert
 * @classdesc Alert Tool for Editor.js
 * @property {WarningData} data - Alert Tool`s input and output data
 * @property {object} api - Editor.js API instance
 *
 * @typedef {object} WarningData
 * @description Alert Tool`s input and output data
 * @property {string} desc - warning`s desc
 *
 * @typedef {object} WarningConfig
 * @description Alert Tool`s initial configuration
 * @property {string} desc - placeholder to show in warning`s desc input
 */

export default class Alert {
  /**
   * Render plugin`s main Element and fill it with saved data
   *
   * @param {AlertData} data — previously saved data
   * @param {AlertConfig} config — user config for Tool
   * @param {Object} api - Editor.js API
   */
  constructor({ data, config, api }) {
    this.api = api;
    this.i18n = config.i18n || "en";

    this.defaultDesc = config.desc || Alert.DEFAULT_DESC_PLACEHOLDER;

    this.containerEl = null;
    this.descEl = null;

    this.settings = [
      {
        title: "警告提示",
        icon: WarningIcon,
        type: "warning",
      },
      {
        title: "错误/禁止提示",
        icon: ErrorIcon,
        type: "error",
      },
      {
        title: "成功提示",
        icon: SuccessIcon,
        type: "success",
      },
    ];

    this.data = {
      type: data.type || "warning",
      desc: data.desc || this.defaultDesc,
    };
  }
  /**
   * Get Toolbox settings
   *
   * @public
   * @return {string}
   */
  static get toolbox() {
    return {
      icon: `<svg width="16" height="17" viewBox="0 0 320 294" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M160.5 97c12.426 0 22.5 10.074 22.5 22.5v28c0 12.426-10.074 22.5-22.5 22.5S138 159.926 138 147.5v-28c0-12.426 10.074-22.5 22.5-22.5zm0 83c14.636 0 26.5 11.864 26.5 26.5S175.136 233 160.5 233 134 221.136 134 206.5s11.864-26.5 26.5-26.5zm-.02-135c-6.102 0-14.05 8.427-23.842 25.28l-74.73 127.605c-12.713 21.444-17.806 35.025-15.28 40.742 2.527 5.717 8.519 9.175 17.974 10.373h197.255c5.932-1.214 10.051-4.671 12.357-10.373 2.307-5.702-1.812-16.903-12.357-33.603L184.555 70.281C174.608 53.427 166.583 45 160.48 45zm154.61 165.418c2.216 6.027 3.735 11.967 4.393 18.103.963 8.977.067 18.035-3.552 26.98-7.933 19.612-24.283 33.336-45.054 37.586l-4.464.913H61.763l-2.817-.357c-10.267-1.3-19.764-4.163-28.422-9.16-11.051-6.377-19.82-15.823-25.055-27.664-4.432-10.03-5.235-19.952-3.914-29.887.821-6.175 2.486-12.239 4.864-18.58 3.616-9.64 9.159-20.55 16.718-33.309L97.77 47.603c6.469-11.125 12.743-20.061 19.436-27.158 4.62-4.899 9.562-9.07 15.206-12.456C140.712 3.01 150.091 0 160.481 0c10.358 0 19.703 2.99 27.989 7.933 5.625 3.356 10.563 7.492 15.193 12.354 6.735 7.072 13.08 15.997 19.645 27.12l.142.24 76.986 134.194c6.553 10.46 11.425 19.799 14.654 28.577z"/></svg>`,
      title: this.i18n === "en" ? "Alert" : "注意/警告",
    };
  }

  /**
   * Allow to press Enter inside the Alert
   * @public
   * @returns {boolean}
   */
  static get enableLineBreaks() {
    return true;
  }

  /**
   * Default placeholder for warning desc
   *
   * @public
   * @returns {string}
   */
  static get DEFAULT_DESC_PLACEHOLDER() {
    return this.i18n === "en" ? "Desc" : "提示描述信息";
  }

  /**
   * Alert Tool`s styles
   *
   * @returns {Object}
   */
  get CSS() {
    return {
      baseClass: this.api.styles.block,
      wrapper: "cdx-alert",
      wrapperWarning: "cdx-alert--warning",
      wrapperError: "cdx-alert--error",
      wrapperSuccess: "cdx-alert--success",

      sideIcon: "cdx-alert__sideicon",
      sideIconWarning: "cdx-alert__sideicon--warning",
      sideIconError: "cdx-alert__sideicon--error",
      sideIconSuccess: "cdx-alert__sideicon--success",

      customSettingWrapper: "custom-setting-wrapper",
      settingsButton: "cdx-settings-button",
      settingsButtonIcon: "cdx-settings-button-icon",
      settingsButtonActive: this.api.styles.settingsButtonActive,

      descInput: "cdx-alert__desc_input",
      descInputWarning: "cdx-alert__desc_input--warning",
      descInputError: "cdx-alert__desc_input--error",
      descInputSuccess: "cdx-alert__desc_input--success",
      desc: "cdx-alert__desc",
    };
  }

  /**
   * Create Alert Tool container with inputs
   *
   * @returns {Element}
   */
  render() {
    const typeName = capitalize(this.data.type);
    // const container = make('div', [this.CSS.baseClass, this.CSS.wrapper])
    this.containerEl = make(
      "div",
      [this.CSS.wrapper, this.CSS[`wrapper${typeName}`]],
      {}
    );
    // textarea 会有各种问题，比如 backspace 会回到上一个 block, 比如 autosize 等等
    this.descEl = make(
      "code",
      [
        this.CSS.baseClass,
        this.CSS.descInput,
        this.CSS[`descInput${typeName}`],
        this.CSS.desc,
      ],
      {
        contentEditable: true,
        innerText: this.data.desc,
        "data-placeholder": "//提示内容",
        "data-skip-plus-button": true,
      }
    );

    this.sideIcon = make(
      "div",
      [this.CSS.sideIcon, this.CSS[`sideIcon${typeName}`]],
      {
        innerHTML: WarningIcon,
        "data-skip-plus-button": true,
      }
    );

    this.api.listeners.on(
      this.sideIcon,
      "click",
      (ev) => {
        console.log("click ev: ", ev);
        this.toggleAlertType();
      },
      false
    );

    this.containerEl.appendChild(this.descEl);
    this.containerEl.appendChild(this.sideIcon);

    enableCtrlEnterBreak(this.containerEl, this.api);
    addBreakHint(this.containerEl, { right: "12px", bottom: "-18px" });

    return this.containerEl;
  }

  /**
   * editor or go to origin site when edit
   * @public
   *
   * @return {Element}
   */
  renderSettings() {
    // if (R.isEmpty(this.data.provider)) return make("DIV", "");

    const Wrapper = make("DIV", [this.CSS.customSettingWrapper], {});

    this.settings.forEach((item) => {
      const itemEl = make(
        "div",
        [this.CSS.settingsButton, this.CSS.settingsButtonIcon],
        {
          title: item.title,
          innerHTML: item.icon,
        }
      );

      if (this.data.type === item.type) this.highlightSettingIcon(itemEl);

      itemEl.addEventListener("click", () => {
        this.setAlertType(item.type);
        this.highlightSettingIcon(itemEl);
      });

      Wrapper.appendChild(itemEl);
    });

    return Wrapper;
  }

  /**
   * highlight the current setting icon
   * @private
   *
   */
  highlightSettingIcon(el) {
    if (el.parentNode) {
      const buttons = el.parentNode.querySelectorAll(
        "." + this.CSS.settingsButton
      );
      Array.from(buttons).forEach((button) =>
        button.classList.remove(this.CSS.settingsButtonActive)
      );
    }

    el.classList.add(this.CSS.settingsButtonActive);
  }

  /**
   * toggle Alert type between warning | error | success
   *
   * @private
   */
  toggleAlertType() {
    const currentType = this.data.type;

    if (currentType === "warning") {
      this.setAlertType("error");
    } else if (currentType === "error") {
      this.setAlertType("success");
    } else {
      this.setAlertType("warning");
    }
  }

  /**
   * change style to match current Alert type
   * @private
   *
   */
  setAlertType(type) {
    this.data.type = type;

    this.clearColorClasses();

    const typeName = capitalize(type);

    const iconMap = {
      Warning: WarningIcon,
      Error: ErrorIcon,
      Success: SuccessIcon,
    };

    this.containerEl.classList.add(this.CSS["wrapper" + typeName]);
    this.descEl.classList.add(this.CSS["descInput" + typeName]);
    this.sideIcon.classList.add(this.CSS["sideIcon" + typeName]);

    this.sideIcon.innerHTML = iconMap[typeName];
  }

  /**
   * clean up Alert classes
   * @private
   *
   */
  clearColorClasses() {
    this.containerEl.classList.remove(this.CSS.wrapperWarning);
    this.containerEl.classList.remove(this.CSS.wrapperError);
    this.containerEl.classList.remove(this.CSS.wrapperSuccess);

    this.descEl.classList.remove(this.CSS.descInputWarning);
    this.descEl.classList.remove(this.CSS.descInputError);
    this.descEl.classList.remove(this.CSS.descInputSuccess);

    this.sideIcon.classList.remove(this.CSS.sideIconWarning);
    this.sideIcon.classList.remove(this.CSS.sideIconError);
    this.sideIcon.classList.remove(this.CSS.sideIconSuccess);
  }

  /**
   * Extract Alert data from Alert Tool element
   *
   * @param {HTMLDivElement} warningElement - element to save
   * @returns {WarningData}
   */
  save(warningElement) {
    return Object.assign(this.data, {
      desc: this.descEl.innerHTML,
    });
  }

  /**
   * Sanitizer config for Warning Tool saved data
   * @return {Object}
   */
  static get sanitize() {
    return {
      desc: {},
    };
  }
}
