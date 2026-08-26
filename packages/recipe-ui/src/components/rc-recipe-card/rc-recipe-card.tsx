import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';
import { RecipeSummary } from '../../types';

@Component({
  tag: 'rc-recipe-card',
  styleUrl: 'rc-recipe-card.css',
  shadow: true,
})
export class RcRecipeCard {
  @Prop() recipe!: RecipeSummary;
  @Prop() isFavorite: boolean = false;

  @Event() cardselect!: EventEmitter<string>;
  @Event() favoritetoggle!: EventEmitter<string>;

  private handleCardClick = () => {
    this.cardselect.emit(this.recipe.id);
  };

  private handleFavoriteClick = (e: MouseEvent) => {
    e.stopPropagation();
    this.favoritetoggle.emit(this.recipe.id);
  };

  render() {
    if (!this.recipe) {
      return null;
    }

    return (
      <div class="card" onClick={this.handleCardClick}>
        <div class="media">
          <img src={this.recipe.image} alt={this.recipe.title} />
          <div class="badge-slot">
            <slot></slot>
          </div>
        </div>
        <div class="body">
          <h3>{this.recipe.title}</h3>
          {this.recipe.category && <p class="category">{this.recipe.category}</p>}
        </div>
        <button
          class={{ 'fav-btn': true, active: this.isFavorite }}
          aria-label={this.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
          onClick={this.handleFavoriteClick}
        >
          {this.isFavorite ? '♥' : '♡'}
        </button>
      </div>
    );
  }
}
