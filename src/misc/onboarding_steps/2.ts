import { html } from "lit-element";

export const step = html`
  <h1>
    Background tasks
  </h1>
  <hr />
  <p>
    If you see this progress bar it means that HACS is working with something
    in the background. Upgrade and uninstall are disabled while this is running.
  </p>
  <hacs-progressbar .active=${true}></hacs-progressbar>
`;
