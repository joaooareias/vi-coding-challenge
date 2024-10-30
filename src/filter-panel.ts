import { LitElement, html, css } from "lit";
import { customElement, state } from "lit/decorators.js";

@customElement("filter-panel")
export class FilterPanel extends LitElement {
  // define types and the color of that type
  @state()
  types = [
    { name: 'normal', color: '#A8A77A' },
    { name: "fire", color: "#EE8130" },
    { name: "water", color: "#6390F0" },
    { name: "grass", color: "#7AC74C" },
    { name: "electric", color: "#F7D02C" },
    { name: "ice", color: "#96D9D6" },
    { name: "fighting", color: "#C22E28" },
    { name: "poison", color: "#A33EA1" },
    { name: "ground", color: "#E2BF65" },
    { name: "flying", color: "#A98FF3" },
    { name: "psychic", color: "#F95587" },
    { name: "bug", color: "#A6B91A" },
    { name: "rock", color: "#B6A136" },
    { name: "ghost", color: "#735797" },
    { name: "dragon", color: "#6F35FC" },
    { name: "dark", color: "#705746" },
    { name: "steel", color: "#B7B7CE" },
    { name: "fairy", color: "#D685AD" },
  ];

  // array with selected types to filter by
  @state()
  selectedTypes: string[] = [];

  static styles = css`
    .filter-panel {
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
      display: flex;
      flex-direction: column;
    }

    .type-checkbox {
      display: flex;
      align-items: center;
      margin: 8px 0;
    }

    .color-box {
      width: 10px;
      height: 10px;
      border-radius: 100%;
      margin-left: 5px;
      margin-top: 5px;
    }
  `;

  render() {
    return html`
      <div class="filter-panel">
        <h3>Filter by Type</h3>
        ${this.types.map(
          (type) => html`
            <label class="type-checkbox">
              <input
                type="checkbox"
                @change="${(e: Event) => this.handleTypeChange(e, type.name)}"
                ?checked="${this.selectedTypes.includes(type.name)}"
              />
              ${type.name}
              <span
                class="color-box"
                style="background-color: ${type.color};"
              ></span>
            </label>
          `
        )}
      </div>
    `;
  }

  handleTypeChange(event: Event, typeName: string) {
    const checked = (event.target as HTMLInputElement).checked;

    if (checked) {
      this.selectedTypes = [...this.selectedTypes, typeName];
    } else {
      this.selectedTypes = this.selectedTypes.filter(
        (type) => type !== typeName
      );
    }

    // Dispatch an event to notify the parent component
    this.dispatchEvent(
      new CustomEvent("filter-changed", {
        detail: { selectedTypes: this.selectedTypes },
        bubbles: true,
        composed: true,
      })
    );
  }
}

declare global {
  interface HTMLElementTagNameMap {
    "filter-panel": FilterPanel;
  }
}
