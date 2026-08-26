import { Component, Prop, Event, EventEmitter, h } from '@stencil/core';

@Component({
  tag: 'rc-filter-chip',
  styleUrl: 'rc-filter-chip.css',
  shadow: true,
})
export class RcFilterChip {
  @Prop() label: string = '';
  @Prop() active: boolean = false;

  @Event() chiptoggle!: EventEmitter<{ label: string; active: boolean }>;

  private handleClick = () => {
    this.chiptoggle.emit({ label: this.label, active: !this.active });
  };

  render() {
    return (
      <button class={{ chip: true, active: this.active }} aria-pressed={this.active ? 'true' : 'false'} onClick={this.handleClick}>
        {this.label}
      </button>
    );
  }
}
