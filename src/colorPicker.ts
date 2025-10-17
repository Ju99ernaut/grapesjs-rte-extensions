export interface PickerStyleOptions {
  display?: string;
}

export interface PickerOptions {
  open?: string | HTMLElement;
  openEvent?: keyof HTMLElementEventMap | string;
  style?: PickerStyleOptions;
  template?: string;
  autoclose?: boolean;
  closeOnBlur?: boolean;
}

type ColorChosenCallback = (color: string) => void;

interface NormalizedOptions {
  open?: HTMLElement;
  openEvent: string;
  style: PickerStyleOptions;
  template: string;
  autoclose: boolean;
  closeOnBlur: boolean;
}

const DEFAULT_COLORS: string[] = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#ecf0f1",
  "#95a5a6",
  "#f39c12",
  "#d35400",
  "#c0392b",
  "#bdc3c7",
  "#7f8c8d",
];

export class Picker {
  public elm: HTMLElement;
  public color = "";
  public isOpen = true;
  public colors: string[];
  public options: NormalizedOptions;
  private cbs: ColorChosenCallback[] = [];

  constructor(
    sel: string | HTMLElement,
    colors?: string[],
    options?: PickerOptions
  ) {
    const normalized: NormalizedOptions = {
      open: options?.open ? this.getElm(options.open) : undefined,
      openEvent: (options?.openEvent ?? "click") as string,
      style: {
        display: options?.style?.display ?? "block",
      },
      template:
        options?.template ??
        '<div data-col="{color}" style="background-color: {color}" title="{color}"></div>',
      autoclose: options?.autoclose !== false,
      closeOnBlur: options?.closeOnBlur ?? false,
    };

    this.elm = this.getElm(sel);
    this.colors =
      Array.isArray(colors) && colors.length ? colors : DEFAULT_COLORS.slice();
    this.options = normalized;

    this.render();

    if (this.options.open) {
      this.options.open.addEventListener(this.options.openEvent, () => {
        this.isOpen ? this.close() : this.open();
      });
    }

    this.elm.addEventListener("click", (ev) => {
      const target = ev.target as HTMLElement | null;
      const col = target?.getAttribute("data-col");
      if (!col) return;

      this.set(col);
      this.close();
    });

    if (this.options.closeOnBlur) {
      window.addEventListener("click", (ev) => {
        const target = ev.target as Node | null;
        const openEl = this.options.open;

        const clickedInsidePalette = !!(target && this.elm.contains(target));
        const clickedOpener = !!(
          target &&
          openEl &&
          (openEl === target || openEl.contains(target))
        );

        if (!clickedInsidePalette && !clickedOpener && this.isOpen) {
          this.close();
        }
      });
    }

    if (this.options.autoclose) {
      this.close();
    }
  }

  private getElm<T extends HTMLElement = HTMLElement>(el: string | T): T {
    if (typeof el === "string") {
      const found = document.querySelector(el);
      if (!found)
        throw new Error(`Piklor: element not found for selector "${el}"`);
      return found as T;
    }
    return el as T;
  }

  private render(): void {
    const html = this.colors
      .map((c) => this.options.template.replace(/\{color\}/g, c))
      .join("");
    this.elm.innerHTML = html;
  }

  public close(): void {
    this.elm.style.display = "none";
    this.isOpen = false;
  }

  /** Open the picker */
  public open(): void {
    this.elm.style.display = this.options.style.display ?? "block";
    this.isOpen = true;
  }

  public colorChosen(cb: ColorChosenCallback): void {
    this.cbs.push(cb);
  }

  public set(c: string, triggerCallbacks: boolean = true): void {
    this.color = c;
    if (!triggerCallbacks) return;

    for (const cb of this.cbs) {
      try {
        cb?.(c);
      } catch {
        // Swallow callback errors to avoid breaking picker flow
      }
    }
    this.cbs = [];
  }
}
