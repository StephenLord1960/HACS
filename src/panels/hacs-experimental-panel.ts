import "@material/mwc-button/mwc-button";
import "@material/mwc-list/mwc-list";
import "@material/mwc-list/mwc-list-item";
import { mdiDotsVertical, mdiPlus } from "@mdi/js";
import "@polymer/app-layout/app-header/app-header";
import "@polymer/app-layout/app-toolbar/app-toolbar";
import { css, CSSResultGroup, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import memoize from "memoize-one";
import type {
  DataTableColumnContainer,
  DataTableRowData,
} from "../../homeassistant-frontend/src/components/data-table/ha-data-table";

import "../../homeassistant-frontend/src/components/ha-button-menu";
import "../../homeassistant-frontend/src/components/ha-fab";
import "../../homeassistant-frontend/src/components/ha-menu-button";
import "../../homeassistant-frontend/src/components/ha-svg-icon";
import { haStyle } from "../../homeassistant-frontend/src/resources/styles";
import type { HomeAssistant, Route } from "../../homeassistant-frontend/src/types";
import { hacsIcon } from "../components/hacs-icon";
import "../components/hacs-tabs-subpage-data-table";
import type { Hacs } from "../data/hacs";
import type { RepositoryBase } from "../data/repository";
import { HacsStyles } from "../styles/hacs-common-style";

@customElement("hacs-experimental-panel")
export class HacsExperimentalPanel extends LitElement {
  @property({ attribute: false }) public hacs!: Hacs;

  @property({ attribute: false }) public hass!: HomeAssistant;

  @property({ attribute: false }) public route!: Route;

  @property({ type: Boolean, reflect: true })
  public narrow!: boolean;

  @property({ type: Boolean }) public isWide!: boolean;

  protected render = (): TemplateResult | void => html`<hacs-tabs-subpage-data-table
    .tabs=${[
      {
        name: "Home Assistant Community Store - EXPERIMENTAL",
        path: `/hacs/entry`,
        iconPath: hacsIcon,
      },
    ]}
    .columns=${this._columns(this.narrow)}
    .data=${this._filterRepositories(this.hacs.repositories)}
    .hass=${this.hass}
    isWide=${this.isWide}
    .localizeFunc=${this.hass.localize}
    .mainPage=${true}
    .narrow=${this.narrow}
    .route=${this.route}
    clickable
    hasFab
    noDataText="No downloaded repositories"
  >
    <ha-button-menu corner="BOTTOM_START" slot="toolbar-icon" @action=${this._handleAction}>
      <ha-icon-button
        .label=${this.hass?.localize("ui.common.menu")}
        .path=${mdiDotsVertical}
        slot="trigger"
      ></ha-icon-button>
      <mwc-list-item> ${this.hacs.localize("common.reload")} </mwc-list-item>
    </ha-button-menu>
    <ha-fab
      slot="fab"
      .label=${this.hacs.localize("store.explore")}
      .extended=${!this.narrow}
      @click=${this._addRepository}
    >
      <ha-svg-icon slot="icon" .path=${mdiPlus}></ha-svg-icon>
    </ha-fab>
  </hacs-tabs-subpage-data-table>`;

  private _filterRepositories = memoize((repositories: RepositoryBase[]): DataTableRowData[] =>
    repositories.filter((reposiotry) => reposiotry.installed)
  );

  private _columns = memoize(
    (narrow: boolean): DataTableColumnContainer<RepositoryBase> => ({
      name: {
        title: "Name",
        main: true,
        sortable: true,
        filterable: true,
        direction: "asc",
        grows: true,
        template: !narrow
          ? (name, repository: RepositoryBase) =>
              html`
                ${name}<br />
                <div class="secondary">${repository.description}</div>
              `
          : undefined,
      },
      category: {
        title: "Category",
        hidden: narrow,
        sortable: true,
        filterable: true,
      },
    })
  );

  static get styles(): CSSResultGroup {
    return [haStyle, HacsStyles, css``];
  }
}
