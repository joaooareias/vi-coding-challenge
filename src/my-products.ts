import { LitElement, html, css } from 'lit';
import { customElement, state } from 'lit/decorators.js';
import './filter-panel.ts';

interface Monster {
  name: string;
  id: number;
  sprites: {
    front_default: string;
  };
  types: Array<{ type: { name: string } }>;
}

/**
 * Element to display a list of monsters fetched from PokeAPI.
 */
@customElement('my-products')
export class MyProducts extends LitElement {
  /**
   * Array to hold the list of monsters fetched from the API.
   */
  @state()
  monsters: Monster[] = [];

  /**
   * Boolean to track the loading state.
   */
  @state()
  loading = true;

  /**
   * Array to hold the list of selected types
   */
  @state()
  selectedTypes: string[] = [];

  /**
   * Fetch data when the component is added to the DOM.
   */
  connectedCallback() {
    super.connectedCallback();
    this.fetchMonsters();
  }

  /**
   * Method to fetch the list of monsters from PokeAPI.
   */
  async fetchMonsters() {
    try {
      const response = await fetch('https://pokeapi.co/api/v2/pokemon?limit=20'); // Limit of 20 just for example
      const data = await response.json();
      
      // Fetch details for each Pokemon to get images and types
      const detailedMonsters = await Promise.all(
        data.results.map(async (monster: any) => {
          const detailsResponse = await fetch(monster.url);
          return await detailsResponse.json();
        })
      );

      this.monsters = detailedMonsters; // Set monsters with the detailed data get from the request
    } catch (error) {
      console.error('Error fetching monster data:', error);
    } finally {
      this.loading = false; // when the request is done set loading to false
    }
  }

  static styles = css`
    .container {
      display: flex;
      gap: 16px;
    }
    
    .filter-panel {
      flex: 0 0 200px;
      min-width: 200px;
      border: 1px solid #ddd;
      border-radius: 8px;
      padding: 1rem;
    }

    .monster-grid {
      flex: 1;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
      gap: 16px;
    }
    
    .monster-card {
      position: relative;
      border: 1px solid #ddd;
      border-radius: 8px;
      max-height: 200px;
      padding: 1rem;
      text-align: center;
    }
    
    .monster-image {
      width: 100px;
      height: 100px;
    }
    
    .loading {
      text-align: center;
      font-size: 1.5rem;
      color: #555;
    }

    .monster-id {
      position: absolute;
      top: 8px; 
      right: 8px;
      font-size: 20px;
      color: #888;
    }
  `;

  render() {
    const filteredMonsters = this.selectedTypes.length > 0 
      ? this.monsters.filter(monster => 
          monster.types.some(typeObj => this.selectedTypes.includes(typeObj.type.name))
        )
      : this.monsters;
    return html`
      <h2>These are our products:</h2>
      <div class="container">
        <filter-panel @filter-changed="${(e: CustomEvent) => this.updateFilter(e.detail.selectedTypes)}"></filter-panel>
        <div class="monster-grid">
        ${this.loading
            ? html`<p class="loading">Loading...</p>`
            : html`
                ${filteredMonsters.map(
                (monster: any) => html`
                    <div class="monster-card">
                        <a href="/monster/${monster.name}" target="_blank" rel="noopener noreferrer">
                            <span class="monster-id">#${monster.id}</span>
                            <img
                                src="${monster.sprites.front_default}"
                                alt="${monster.name}"
                                class="monster-image"
                            />
                        </a>
                        <p>${monster.name}</p>
                        <div>
                            ${monster.types.map(
                            (typeObj: any) => html`
                                <span style="color: ${this.getTypeColor(typeObj.type.name)};">
                                • ${typeObj.type.name}
                                </span>
                            `
                            )}
                        </div>
                    </div>
                `
                )}
        `}
        </div>
    </div>
    `;
  }

  /**
   * update array of selected types.
   */      
  updateFilter(selectedTypes: string[]) {
    this.selectedTypes = selectedTypes;
  }

  /**
   * Get color based on monster type.
   */
  getTypeColor(type: string) {
    const typeColors: { [key: string]: string } = {
      normal: '#A8A77A',
      fire: '#EE8130',
      water: '#6390F0',
      electric: '#F7D02C',
      grass: '#7AC74C',
      ice: '#96D9D6',
      fighting: '#C22E28',
      poison: '#A33EA1',
      ground: '#E2BF65',
      flying: '#A98FF3',
      psychic: '#F95587',
      bug: '#A6B91A',
      rock: '#B6A136',
      ghost: '#735797',
      dragon: '#6F35FC',
      dark: '#705746',
      steel: '#B7B7CE',
      fairy: '#D685AD',
    };
    return typeColors[type] || '#000'; // Default to black if type is unknown
  }
}

declare global {
  interface HTMLElementTagNameMap {
    'my-products': MyProducts;
  }
}
