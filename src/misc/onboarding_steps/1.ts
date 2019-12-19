import { html } from "lit-element";

export const step = html`
  <h1>
    Introduction
  </h1>
  <hr />
  <p>
    HACS, in short, is really just a glorified downloader, but no one wants
    that so....
  </p>
  <p>
    HACS works as a distribution platform for extensions to Home Assistant that
    are not part of Home Assistant core.
  </p>
  <p>
    Extensions, or "categories", in this context are:
  </p>
  <li>Custom integrations (custom_components)</li>
  <li>
    <hacs-link url="https://www.home-assistant.io/lovelace"
      >Plugins (Lovelace elements)</hacs-link
    >
  </li>
  <li>
    <hacs-link url="https://appdaemon.readthedocs.io/en/latest/"
      >AppDaemon apps</hacs-link
    >
  </li>
  <li>
    <hacs-link url="https://www.home-assistant.io/integrations/python_script/"
      >python scripts</hacs-link
    >
  </li>
  <li>
    <hacs-link
      url="https://www.home-assistant.io/integrations/frontend/#defining-themes"
      >Themes</hacs-link
    >
  </li>
  <p>
    Having HACS as a distribution platform allows the developer(s)/author(s) of
    these extensions to reach a broader audience and allows for fast deployment
    of new versions.
  </p>
  <p>
  That's fine for developers/authors, but how about users?</br>
  The nice part for users is that most of the custom extensions for Home Assistant now are in HACS, which makes it super easy to find, install, and upgrade.
  </p>
`;
