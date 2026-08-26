import { Component, Prop, State, Event, EventEmitter, Watch, h } from '@stencil/core';

@Component({
  tag: 'rc-search-bar',
  styleUrl: 'rc-search-bar.css',
  shadow: true,
})
export class RcSearchBar {
  @Prop() value: string = '';
  @Prop() placeholder: string = 'Search recipes...';
  @Prop() debounce: number = 300;

  @Event() searchchange!: EventEmitter<string>;

  @State() private internalValue: string = this.value;

  private debounceTimer!: ReturnType<typeof setTimeout>;

  @Watch('value')
  watchValue(newValue: string) {
    this.internalValue = newValue;
  }

  private handleInput = (e: InputEvent) => {
    const target = e.target as HTMLInputElement;
    this.internalValue = target.value;

    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.searchchange.emit(this.internalValue);
    }, this.debounce);
  };

  disconnectedCallback() {
    clearTimeout(this.debounceTimer);
  }

  render() {
    return (
      <div class="search-bar">
        <input
          type="text"
          value={this.internalValue}
          placeholder={this.placeholder}
          onInput={this.handleInput}
        />
        <div class="suffix">
          <slot name="suffix"></slot>
        </div>
      </div>
    );
  }
}
