import { customElement, property } from "lit-element";
import {
  HassRouterPage,
  RouterOptions,
} from "../homeassistant-frontend/src/layouts/hass-router-page";
import { HomeAssistant, Route } from "../homeassistant-frontend/src/types";
import { listenMediaQuery } from "../homeassistant-frontend/src/common/dom/media_query";

import {
  Configuration,
  Critical,
  LovelaceResource,
  Repository,
  RemovedRepository,
  Status,
} from "./data/common";
import { sectionsEnabled } from "./panels/hacs-sections";
import { Hacs } from "./data/hacs";

import "./panels/hacs-entry-panel";
import "./panels/hacs-store-panel";

@customElement("hacs-router")
class HacsRouter extends HassRouterPage {
  @property({ attribute: false }) public hacs?: Hacs;
  @property({ attribute: false }) public configuration: Configuration;
  @property({ attribute: false }) public critical!: Critical[];
  @property({ attribute: false }) public hass!: HomeAssistant;
  @property({ attribute: false }) public lovelace: LovelaceResource[];
  @property({ attribute: false }) public removed: RemovedRepository[];
  @property({ attribute: false }) public repositories: Repository[];
  @property({ attribute: false }) public route!: Route;
  @property({ attribute: false }) public status: Status;
  @property({ type: Boolean }) public narrow!: boolean;

  @property() private _wideSidebar = false;
  @property() private _wide = false;

  private _listeners: Array<() => void> = [];

  public connectedCallback() {
    super.connectedCallback();
    this._listeners.push(
      listenMediaQuery("(min-width: 1040px)", (matches) => {
        this._wide = matches;
      })
    );
    this._listeners.push(
      listenMediaQuery("(min-width: 1296px)", (matches) => {
        this._wideSidebar = matches;
      })
    );
  }

  public disconnectedCallback() {
    super.disconnectedCallback();
    while (this._listeners.length) {
      this._listeners.pop()!();
    }
  }

  protected routerOptions: RouterOptions = {
    defaultPage: "entry",
    routes: {
      entry: {
        tag: "hacs-entry-panel",
      },
      integrations: {
        tag: "hacs-store-panel",
      },
      frontend: {
        tag: "hacs-store-panel",
      },
      automation: {
        tag: "hacs-store-panel",
      },
    },
  };

  protected updatePageEl(el) {
    const section = this.route.path.replace("/", "");
    const isWide = this.hass.dockedSidebar === "docked" ? this._wideSidebar : this._wide;
    el.hass = this.hass;
    el.hacs = this.hacs;
    el.route = this.route;
    el.narrow = this.narrow;
    el.isWide = isWide;
    el.configuration = this.configuration;
    el.critical = this.critical;
    el.lovelace = this.lovelace;
    el.removed = this.removed;
    el.repositories = this.repositories;
    el.status = this.status;

    el.sections = sectionsEnabled(this.configuration);
    el.section = section;
  }
}
