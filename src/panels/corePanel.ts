import {
  LitElement,
  customElement,
  CSSResultArray,
  TemplateResult,
  html,
  css,
  property
} from "lit-element";

import { HomeAssistant } from "custom-card-helpers";

import { HacsStyle } from "../style/hacs-style"
import { Configuration, Repository, Route } from "../types"
import { navigate } from "../misc/navigate"
import { LovelaceConfig } from "../misc/LovelaceTypes"
import { AddedToLovelace } from "../misc/AddedToLovelace"

import "../buttons/HacsButtonClearNew"


@customElement("hacs-panel")
export class HacsPanelStore extends LitElement {
  @property() public hass!: HomeAssistant;
  @property() public repositories!: Repository[]
  @property() public configuration!: Configuration
  @property() public route!: Route;
  @property() public panel;
  @property() public repository_view = false;
  @property() public repository: string;
  @property() public SearchTerm: string = "";
  @property() public lovelaceconfig: LovelaceConfig;

  protected render(): TemplateResult | void {
    if (this.panel === "repository") {
      // How fun, this is a repository!
      return html`
      <hacs-panel-repository
        .hass=${this.hass}
        .route=${this.route}
        .configuration=${this.configuration}
        .repositories=${this.repositories}
        .repository=${this.repository}
        .lovelaceconfig=${this.lovelaceconfig}
      >
      </hacs-panel-repository>`
    } else {
      const category = this.panel;
      var newRepositories: Repository[] = [];
      const config = this.configuration;
      this.SearchTerm = localStorage.getItem("hacs-search");
      var SearchTerm = this.SearchTerm;
      var _repositories = this.repositories.filter(function (repo) {

        if (category !== "installed") {
          // Hide HACS from the store
          if (repo.id === "172733314") return false;

          // Hide hidden repos from the store
          if (repo.hide) return false;

          // Check contry restrictions
          if (config.country !== "ALL" && repo.country !== undefined) {
            if (config.country !== repo.country) return false;
          }

        } else {
          if (repo.installed) return true;
        }

        if (repo.category === category) {
          if (SearchTerm !== "" || null) {
            if (repo.name.toLowerCase().includes(SearchTerm)) return true;
            if (repo.description.toLowerCase().includes(SearchTerm)) return true;
            if (repo.full_name.toLowerCase().includes(SearchTerm)) return true;
            if (String(repo.authors).toLowerCase().includes(SearchTerm)) return true;
            if (String(repo.topics).toLowerCase().includes(SearchTerm)) return true;
            return false;
          }

          if (repo.new) newRepositories.push(repo);

          // Fallback to not showing it if no search.
          return true;
        }
        // Fallback to not showing it.
        return false;
      });

      return html`
      <paper-input
        class="search-bar search-bar-${this.panel}"
        type="text"
        id="Search"
        @input=${this.DoSearch}
        placeholder="  ${this.hass.localize("component.hacs.store.placeholder_search")}."
        autofocus
        .value=${this.SearchTerm}
      ></paper-input>

    ${(newRepositories.length !== 0 ? html`
    <div class="card-group">
      <h1>${this.hass.localize(`component.hacs.store.new_repositories`)}</h1>
      ${newRepositories.sort((a, b) => (a.name > b.name) ? 1 : -1).map(repo =>
        html`
          ${(this.configuration.frontend_mode !== "Table" ? html`
          <paper-card @click="${this.ShowRepository}" .RepoID="${repo.id}">
          <div class="card-content">
            <div>
              <ha-icon
                icon="mdi:new-box"
                class="${this.StatusAndDescription(repo).status}"
                title="${this.StatusAndDescription(repo).description}"
                >
              </ha-icon>
              <div>
                <div class="title">${repo.name}</div>
                <div class="addition">${repo.description}</div>
              </div>
            </div>
          </div>
          </paper-card>

        ` : html`

        <paper-item .RepoID=${repo.id} @click="${this.ShowRepository}">
          <div class="icon">
            <ha-icon
              icon="mdi:new-box"
              class="${this.StatusAndDescription(repo).status}"
              title="${this.StatusAndDescription(repo).description}"
          </ha-icon>
          </div>
          <paper-item-body two-line>
            <div>${repo.name}</div>
            <div class="addition">${repo.description}</div>
          </paper-item-body>
        </paper-item>
        `)}
      `)}
    </div>
    <div class="card-group">
      <hacs-button-clear-new .hass=${this.hass} .category=${category}></hacs-button-clear-new>
    </div>
    <hr>
    ` : "")}

    <div class="card-group">
    ${_repositories.sort((a, b) => (a.name > b.name) ? 1 : -1).map(repo =>
          html`

      ${(this.configuration.frontend_mode !== "Table" ? html`
        <paper-card @click="${this.ShowRepository}" .RepoID="${repo.id}">
        <div class="card-content">
          <div>
            <ha-icon
              icon=${(repo.new ? "mdi:new-box" : "mdi:cube")}
              class="${this.StatusAndDescription(repo).status}"
              title="${this.StatusAndDescription(repo).description}"
              >
            </ha-icon>
            <div>
              <div class="title">${repo.name}</div>
              <div class="addition">${repo.description}</div>
            </div>
          </div>
        </div>
        </paper-card>

      ` : html`

      <paper-item .RepoID=${repo.id} @click="${this.ShowRepository}">
        <div class="icon">
          <ha-icon
            icon=${(repo.new ? "mdi:new-box" : "mdi:cube")}
            class="${this.StatusAndDescription(repo).status}"
            title="${this.StatusAndDescription(repo).description}"
        </ha-icon>
        </div>
        <paper-item-body two-line>
          <div>${repo.name}</div>
          <div class="addition">${repo.description}</div>
        </paper-item-body>
      </paper-item>
      `)}


      `)}
    </div>
    <script>
    var objDiv = document.getElementById("191563578");
    objDiv.scrollTop = objDiv.scrollHeight;
    console.log("done")
    </script>
          `;
    }
  }

  StatusAndDescription(repository: Repository): { status: string, description: string } {
    var status = repository.status;
    var description = repository.status_description;

    if (repository.installed) {
      if (repository.category === "plugin" && !AddedToLovelace(repository, this.lovelaceconfig)) {
        status = "pending-restart";
        description = "Not loaded in lovelace";
      } else if (repository.category === "integration" &&
        !this.hass.config.components.includes(repository.domain)) {
        status = "pending-restart";
        description = "Not loaded in Home Assistant";
      }
    }

    return { status: status, description: description }
  }

  DoSearch(ev) {
    this.SearchTerm = ev.composedPath()[0].value.toLowerCase();

    localStorage.setItem("hacs-search", this.SearchTerm);
  };

  ShowRepository(ev) {
    var RepoID: string

    ev.composedPath().forEach((item: any) => {
      if (item.RepoID) {
        RepoID = item.RepoID;
      }
    })

    this.panel = `repository`;
    this.repository = RepoID;
    this.repository_view = true;
    this.requestUpdate();
    navigate(this, `/${this._rootPath}/repository/${RepoID}`);
  }

  private get _rootPath() {
    if (window.location.pathname.split("/")[1] === "hacs_dev") return "hacs_dev";
    return "hacs"
  }

  static get styles(): CSSResultArray {
    return [
      HacsStyle,
      css`
      hr {
        width: 95%
      }
      paper-item {
        margin-bottom: 24px;
      }
      paper-item:hover {
        outline: 0;
        background: var(--table-row-alternative-background-color);
    }
      .search-bar {
        display: block;
        width: 92%;
        margin-left: 3.4%;
        margin-top: 2%;
        background-color: var(--primary-background-color);
        color: var(--primary-text-color);
        line-height: 32px;
        border-color: var(--dark-primary-color);
        border-width: inherit;
        border-bottom-width: thin;
      }

      .search-bar-installed, .search-bar-settings {
        display: none;
      }

      .card-group {
          margin-top: 24px;
          width: 95%;
          margin-left: 2.5%;
        }

        .card-group .title {
          color: var(--primary-text-color);
          margin-bottom: 12px;
        }

        .card-group .description {
          font-size: 0.5em;
          font-weight: 500;
          margin-top: 4px;
        }

        .card-group paper-card {
          --card-group-columns: 3;
          width: calc((100% - 12px * var(--card-group-columns)) / var(--card-group-columns));
          margin: 4px;
          vertical-align: top;
          height: 136px;
        }

        @media screen and (max-width: 1200px) and (min-width: 601px) {
          .card-group paper-card {
            --card-group-columns: 2;
          }
        }

        @media screen and (max-width: 600px) and (min-width: 0) {
          .card-group paper-card {
            width: 100%;
            margin: 4px 0;
          }
          .content {
            padding: 0;
          }
        }
    `];
  }
}