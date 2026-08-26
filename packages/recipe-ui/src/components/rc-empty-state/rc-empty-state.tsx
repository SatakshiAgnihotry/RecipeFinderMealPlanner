import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'rc-empty-state',
  styleUrl: 'rc-empty-state.css',
  shadow: true,
})
export class RcEmptyState {
  @Prop() heading: string = '';
  @Prop() message: string = '';

  render() {
    return (
      <div class="empty-state">
        <h3>{this.heading}</h3>
        <p>{this.message}</p>
        <div class="action">
          <slot></slot>
        </div>
      </div>
    );
  }
}
