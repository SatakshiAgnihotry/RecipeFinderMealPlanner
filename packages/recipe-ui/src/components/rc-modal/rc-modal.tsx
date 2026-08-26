import { Component, Prop, Event, EventEmitter, Listen, h } from '@stencil/core';

@Component({
  tag: 'rc-modal',
  styleUrl: 'rc-modal.css',
  shadow: true,
})
export class RcModal {
  @Prop() open: boolean = false;
  @Prop() heading: string = '';

  @Event() modalclose!: EventEmitter<void>;

  @Listen('keydown', { target: 'window' })
  handleKeydown(e: KeyboardEvent) {
    if (this.open && e.key === 'Escape') {
      this.handleClose();
    }
  }

  private handleClose = () => {
    this.modalclose.emit();
  };

  private handleBackdropClick = (e: MouseEvent) => {
    if (e.target === e.currentTarget) {
      this.handleClose();
    }
  };

  render() {
    if (!this.open) {
      return null;
    }

    return (
      <div class="backdrop" onClick={this.handleBackdropClick}>
        <div class="dialog" role="dialog" aria-modal="true" aria-label={this.heading}>
          <div class="header">
            <h2>{this.heading}</h2>
            <button class="close-btn" aria-label="Close" onClick={this.handleClose}>
              ✕
            </button>
          </div>
          <div class="content">
            <slot></slot>
          </div>
          <div class="footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    );
  }
}
