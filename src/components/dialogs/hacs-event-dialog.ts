import { html, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators";
import { HacsDialogBase } from "./hacs-dialog-base";

const DIALOG = {
  about: () => import("./hacs-about-dialog"),
  "add-repository": () => import("./hacs-add-repository-dialog"),
  "custom-repositories": () => import("./hacs-custom-repositories-dialog"),
  generic: () => import("./hacs-generic-dialog"),
  install: () => import("./hacs-install-dialog"),
  navigate: () => import("./hacs-navigate-dialog"),
  removed: () => import("./hacs-removed-dialog"),
  update: () => import("./hacs-update-dialog"),
  "repository-info": () => import("./hacs-repository-info-dialog"),
};

@customElement("hacs-event-dialog")
export class HacsEventDialog extends HacsDialogBase {
  @property({ attribute: false }) public params!: any;

  protected render(): TemplateResult | void {
    if (!this.active) return html``;
    const dialog = this.params.type || "generic";
    DIALOG[dialog]();

    const el: any = document.createElement(`hacs-${dialog}-dialog`);
    el.active = true;
    el.hass = this.hass;
    el.hacs = this.hacs;
    el.narrow = this.narrow;
    el.configuration = this.configuration;
    el.lovelace = this.lovelace;
    el.secondary = this.secondary;
    el.repositories = this.repositories;
    el.route = this.route;
    el.status = this.status;

    if (this.params) {
      for (let [key, value] of Object.entries(this.params)) {
        el[key] = value;
      }
    }
    return html`${el}`;
  }
}
