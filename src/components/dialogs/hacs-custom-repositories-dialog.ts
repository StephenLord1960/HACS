import "@polymer/paper-item/paper-icon-item";
import "@polymer/paper-item/paper-item-body";
import {
  customElement,
  html,
  TemplateResult,
  css,
  property,
  query,
  PropertyValues,
} from "lit-element";
import { HacsDialogBase } from "./hacs-dialog-base";
import { scrollBarStyle } from "../../styles/element-styles";
import "../../../homeassistant-frontend/src/components/ha-svg-icon";
import { mdiGithub, mdiDelete } from "@mdi/js";

import { repositoryDelete, getRepositories, repositoryAdd } from "../../data/websocket";

import { localize } from "../../localize/localize";

import "../hacs-icon-button";

@customElement("hacs-custom-repositories-dialog")
export class HacsCustomRepositoriesDialog extends HacsDialogBase {
  @property() private _inputRepository: string;
  @property() private _error: any;
  @query("#add-input") private _addInput?: any;
  @query("#category") private _addCategory?: any;

  shouldUpdate(changedProperties: PropertyValues) {
    return (
      changedProperties.has("narrow") ||
      changedProperties.has("active") ||
      changedProperties.has("_error") ||
      changedProperties.has("repositories")
    );
  }

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    const repositories = this.repositories?.filter((repo) => repo.custom);
    return html`
      <hacs-dialog
        .active=${this.active}
        .hass=${this.hass}
        .title=${localize("dialog_custom_repositories.title")}
      >
        <div class="content">
          <div class="list">
            ${this._error ? html`<div class="error">${this._error.message}</div>` : ""}
            ${repositories?.map(
              (repo) => html`<paper-icon-item>
                ${repo.category === "integration"
                  ? html`
                      <img
                        src="https://brands.home-assistant.io/_/${repo.domain}/icon.png"
                        referrerpolicy="no-referrer"
                        @error=${this._onImageError}
                        @load=${this._onImageLoad}
                      />
                    `
                  : html`<ha-svg-icon .path=${mdiGithub} slot="item-icon"></ha-svg-icon>`}
                <paper-item-body
                  @click=${() => this._showReopsitoryInfo(String(repo.id))}
                  three-line
                  >${repo.name}
                  <div secondary>${repo.description}</div>
                  <div secondary>
                    Category: ${repo.category}
                  </div></paper-item-body
                ><hacs-icon-button
                  class="delete"
                  .icon=${mdiDelete}
                  @click=${() => this._removeRepository(repo.id)}
                ></hacs-icon-button>
              </paper-icon-item>`
            )}
          </div>
        </div>
        <input
          id="add-input"
          class="add-input"
          slot="secondaryaction"
          placeholder="${localize("dialog_custom_repositories.url_placeholder")}"
          .value=${this._inputRepository || ""}
          @input=${this._inputValueChanged}
          ?narrow=${this.narrow}
        />

        <div class="add" slot="primaryaction" ?narrow=${this.narrow}>
          <paper-dropdown-menu
            ?narrow=${this.narrow}
            class="category"
            label="${localize("dialog_custom_repositories.category")}"
          >
            <paper-listbox id="category" slot="dropdown-content" selected="-1">
              ${this.hacs.configuration.categories.map(
                (category) => html`
                  <paper-item class="categoryitem" .category=${category}>
                    ${localize(`common.${category}`)}
                  </paper-item>
                `
              )}
            </paper-listbox>
          </paper-dropdown-menu>
          <mwc-button
            ?narrow=${this.narrow}
            slot="primaryaction"
            raised
            @click=${this._addRepository}
            >${localize("common.add")}</mwc-button
          >
        </div>
      </hacs-dialog>
    `;
  }

  protected firstUpdated() {
    this.hass.connection.subscribeEvents((msg) => (this._error = (msg as any).data), "hacs/error");
  }

  private _inputValueChanged() {
    this._inputRepository = this._addInput?.value;
  }

  private async _addRepository() {
    this._error = undefined;
    const repository = this._inputRepository;
    const category = this._addCategory?.selectedItem?.category;
    if (!category) {
      this._error = {
        message: localize("dialog_custom_repositories.no_category"),
      };
      return;
    }
    if (!repository) {
      this._error = {
        message: localize("dialog_custom_repositories.no_repository"),
      };
      return;
    }
    await repositoryAdd(this.hass, repository, category);
    this.repositories = await getRepositories(this.hass);
  }

  private async _removeRepository(repository: string) {
    this._error = undefined;
    await repositoryDelete(this.hass, repository);
    this.repositories = await getRepositories(this.hass);
  }

  private _onImageLoad(ev) {
    ev.target.style.visibility = "initial";
  }

  private _onImageError(ev) {
    ev.target.outerHTML = `<ha-icon
      icon="mdi:github-circle"
      slot="item-icon"
    ></ha-icon>`;
  }

  private async _showReopsitoryInfo(repository: string) {
    this.dispatchEvent(
      new CustomEvent("hacs-dialog-secondary", {
        detail: {
          type: "repository-info",
          repository,
        },
        bubbles: true,
        composed: true,
      })
    );
  }
  static get styles() {
    return [
      scrollBarStyle,
      css`
        .content {
          width: 1024px;
          display: contents;
        }
        .list {
          position: relative;
          margin-top: 16px;
          max-height: 870px;
          overflow: auto;
        }
        ha-icon-button,
        ha-icon {
          color: var(--secondary-text-color);
        }
        ha-icon {
          --mdc-icon-size: 36px;
        }
        img {
          align-items: center;
          display: block;
          justify-content: center;
          margin-bottom: 16px;
          max-height: 36px;
          max-width: 36px;
          position: absolute;
        }
        .delete,
        paper-item-body {
          cursor: pointer;
        }
        .error {
          line-height: 0px;
          margin: 12px;
          color: var(--hacs-error-color, var(--google-red-500));
        }

        paper-item-body {
          width: 100%;
          min-height: var(--paper-item-body-two-line-min-height, 72px);
          display: var(--layout-vertical_-_display);
          flex-direction: var(--layout-vertical_-_flex-direction);
          justify-content: var(--layout-center-justified_-_justify-content);
        }
        paper-item-body div {
          font-size: 14px;
          color: var(--secondary-text-color);
        }
        .add {
          display: flex;
          width: 100%;
          align-items: center;
        }

        .add-input {
          width: 100%;
          height: 40px;
          border: 0;
          padding: 0;
          text-align: left;
          padding-right: 71px;
          font-size: initial;
          color: var(--sidebar-text-color);
          font-family: var(--paper-font-body1_-_font-family);
        }
        input:focus {
          outline-offset: 0;
          outline: 0;
        }
        input {
          background-color: var(--sidebar-background-color);
        }
        paper-dropdown-menu {
          width: 100%;
          left: -50px;
          top: -8px;
        }
        mwc-button {
          margin-right: 10px;
        }

        input[narrow],
        .add[narrow],
        paper-dropdown-menu[narrow],
        mwc-button[narrow] {
          margin: 0;
          padding: 0;
          left: 0;
          top: 0;
          width: 100%;
          max-width: 100%;
        }
        .add[narrow] {
          display: contents;
        }
      `,
    ];
  }
}
