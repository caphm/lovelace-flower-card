customElements.whenDefined('card-tools').then(() => {
class FlowerCard extends cardTools.LitElement {


  async setConfig(config) {

    this.config = config;

  }

  static get styles() {
    return cardTools.LitCSS`
    ha-card {
      margin-top: 32px;
    }
    .attributes {
      white-space: nowrap;
      padding: 8px;
    }
    .attribute ha-icon {
      float: left;
      margin-right: 4px;
    }
    .attribute {
      display: inline-block;
      width: 50%;
      white-space: normal;
    }
    .header {
      padding-top: 8px;
      height: 72px;
    }
    .header > img {
      width: 88px;
      border-radius: var(--ha-card-border-radius, 2px);
      margin-left: 16px;
      margin-right: 16px;
      margin-top: -32px;
      float: left;
      box-shadow: var( --ha-card-box-shadow, 0 2px 2px 0 rgba(0, 0, 0, 0.14), 0 1px 5px 0 rgba(0, 0, 0, 0.12), 0 3px 1px -2px rgba(0, 0, 0, 0.2) );
    }
    .header > #name {
      font-weight: bold;
      width: 100%;
      margin-top: 16px;
      text-transform: capitalize;
      display: block;
    }
    .header > #species {
      text-transform: capitalize;
      color: #8c96a5;
      display: block;
    }
    .meter {
      height: 8px;
      background-color: #f1f1f1;
      border-radius: 2px;
      display: inline-grid;
      overflow: hidden;
    }
    .meter.red {
      width: 10%;
    }
    .meter.green {
      width: 50%;
    }
    .meter > span {
      grid-row: 1;
      grid-column: 1;
      height: 100%;
    }
    .meter > .good {
      background-color: rgba(43,194,83,1);
    }
    .meter > .bad {
      background-color: rgba(240,163,163);
    }
    .divider {
      height: 1px;
      background-color: #727272;
      opacity: 0.25;
      margin-left: 8px;
      margin-right: 8px;
    }
    `;
  }

  render() {
    if(!this.stateObj)
      return cardTools.LitHtml``;
    const r = this.stateObj.attributes.readings;

    const attribute = (icon, a, overrideState) => {
      const state = typeof overrideState !== 'undefined' ? overrideState : a.state;
      const pct = 100*Math.max(0, Math.min(1, (state-a.minimum)/(a.maximum-a.minimum)));
      return cardTools.LitHtml`
        <div class="attribute">
          <ha-icon .icon="${icon}"></ha-icon>
          <div class="meter red">
            <span
            class="${state < a.minimum || state > a.maximum ? 'bad' : 'good'}"
            style="width: 100%;"
            ></span>
          </div>
          <div class="meter green">
            <span
            class="${state > a.maximum ? 'bad' : 'good'}"
            style="width:${pct}%;"
            ></span>
          </div>
          <div class="meter red">
            <span
            class="bad"
            style="width:${state > a.maximum ? 100 : 0}%;"
            ></span>
          </div>
        </div>
      `;
          // ${a.state} (${a.minimum}-${a.maximum})
    }

    return cardTools.LitHtml`
    <ha-card>
    <div class="header"
    @click="${() => cardTools.moreInfo(this.stateObj.entity_id)}"
    >
    <img src="${this.stateObj.attributes.entity_picture}">
    <span id="name"> ${this.stateObj.attributes.friendly_name}</span>
    <span id="species"> ${this.stateObj.attributes.display_pid} </span>
    </div>
    <div class="divider"></div>

    <div class="attributes">
    ${attribute('mdi:water-pump', r.soil_moist)}
    ${attribute('mdi:leaf', r.soil_ec)}
    </div>

    <div class="attributes">
    ${attribute('mdi:thermometer', r.temp)}
    ${attribute('mdi:white-balance-sunny', r.light_lux, this.stateObj.attributes.max_brightness)}
    </div>

    </ha-card>
    `;
    // ${attribute('mdi:white-balance-sunny', r.light_mmol)}
  }

  set hass(hass) {
    this._hass = hass;
    this.stateObj = hass.states[this.config.entity];
    this.requestUpdate();
  }

}

customElements.define('flower-card', FlowerCard);
});

window.setTimeout(() => {
  if(customElements.get('card-tools')) return;
  customElements.define('flower-card', class extends HTMLElement{
    setConfig() { throw new Error("Can't find card-tools. See https://github.com/thomasloven/lovelace-card-tools");}
  });
}, 2000);
