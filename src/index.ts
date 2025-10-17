import type { Plugin } from "grapesjs";
import { Picker } from "./colorPicker";

const defaultStyles = `
.gjs-rte-toolbar {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3), 0 1px 2px rgba(0, 0, 0, 0.44);
  border-radius: 3px;
}
.gjs-rte-action {
  font-size: 1rem;
  border-right: none;
  padding: 10px;
  min-width: 35px;
}
.gjs-rte-actionbar {
  max-width: 600px;
  flex-wrap: wrap;
}
.rte-hilite-btn {
  padding: 3px 6px;
  border-radius: 3px;
  background: rgba(210, 120, 201, 0.3);
}
.rte-color-picker {
  display: none;
  padding: 10px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2), 0 2px 5px rgba(0, 0, 0, 0.34);
  border-radius: 5px;
  position: absolute;
  top: 55px;
  width: 250px;
  transition: all 2s ease;
  &:before {
    content: "";
    position: absolute;
    top: -20px;
    left: 46%;
    border-width: 10px;
    border-style: solid;
  }
  &.dark {
    background: rgba(0, 0, 0, 0.8);
    &:before {
      border-color: transparent transparent rgba(0, 0, 0, 0.75) transparent;
    }
  }
  &.light {
    background: rgba(255, 255, 255, 0.75);

    &:before {
      border-color: transparent transparent rgba(255, 255, 255, 0.75)
        transparent;
    }
  }
  & > div {
    width: 30px;
    display: inline-block;
    height: 30px;
    margin: 5px;
    border-radius: 100%;
    opacity: 0.7;
    &:hover {
      opacity: 1;
    }
  }
}
.picker-wrapper {
  padding: 20px;
}
`;

export interface PluginOptions {
  base?: {
    bold: boolean;
    italic: boolean;
    underline: boolean;
    strikethrough: boolean;
    link: boolean;
  };
  fonts?: {
    fontColor?: boolean | string[];
    hilite?: boolean | string[];
    fontName?: boolean | string[];
    fontSize?: boolean | string[];
  };
  format?: {
    heading1?: boolean;
    heading2?: boolean;
    heading3?: boolean;
    heading4?: boolean;
    heading5?: boolean;
    heading6?: boolean;
    paragraph?: boolean;
    quote?: boolean;
    clearFormatting?: boolean;
  };
  subscriptSuperscript?: boolean;
  indentOutdent?: boolean;
  list?: boolean;
  align?: boolean;
  actions?: {
    copy?: boolean;
    cut?: boolean;
    paste?: boolean;
    delete?: boolean;
  };
  undoredo?: boolean;
  extra?: boolean;
  icons?: {
    fontColor?: string;
    hiliteColor?: string;
    heading1?: string;
    heading2?: string;
    heading3?: string;
    heading4?: string;
    heading5?: string;
    heading6?: string;
    paragraph?: string;
    quote?: string;
    clear?: string;
    indent?: string;
    outdent?: string;
    subscript?: string;
    superscript?: string;
    olist?: string;
    ulist?: string;
    justifyLeft?: string;
    justifyRight?: string;
    justifyCenter?: string;
    justifyFull?: string;
    copy?: string;
    cut?: string;
    paste?: string;
    delete?: string;
    code?: string;
    line?: string;
    undo?: string;
    redo?: string;
  };
  darkColorPicker?: boolean;
  maxWidth?: string;
}

export const plugin: Plugin<PluginOptions> = (editor, opts = {}) => {
  const options: PluginOptions = {
    base: {
      bold: true,
      italic: true,
      underline: true,
      strikethrough: true,
      link: true,
    },
    fonts: {
      fontColor: true,
      hilite: true,
    },
    format: {
      heading1: true,
      heading2: true,
      heading3: true,
      paragraph: true,
      clearFormatting: true,
    },
    subscriptSuperscript: false,
    indentOutdent: false,
    list: false,
    align: true,
    undoredo: false,
    extra: false,
    icons: {},
    darkColorPicker: true,
    ...opts,
  };

  const { icons } = options;
  const formatBlock = "formatBlock";
  const rte = editor.RichTextEditor;
  const pk1: Record<string, Picker> = {};
  let pk2: Record<string, Picker> = {};
  const editorContainerId = editor.Config.container
    ? editor.Config.container instanceof HTMLElement
      ? editor.Config.container.id
      : editor.Config.container
    : "";

  editor.onReady(() => {
    const styleElement = document.createElement("style");
    styleElement.textContent = defaultStyles;
    document.head.appendChild(styleElement);
    const toolbarElement = rte.getToolbarEl();
    if (options.maxWidth && toolbarElement.firstChild instanceof HTMLElement) {
      toolbarElement.firstChild.style.maxWidth = options.maxWidth;
    }

    if (!options.base?.bold) rte.remove("bold");
    if (!options.base?.italic) rte.remove("italic");
    if (!options.base?.underline) rte.remove("underline");
    if (!options.base?.strikethrough) rte.remove("strikethrough");
    if (!options.base?.link) rte.remove("link");

    if (options.fonts) {
      const fontNames = Array.isArray(options.fonts?.fontName)
        ? options.fonts.fontName
        : false;
      options.fonts.fontName = fontNames;

      const fontOptionsEl = fontNames
        ? fontNames
            .map((font) => "<option>" + font.toString() + "</option>")
            .join("")
        : "";

      const fontNamesEl = `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
        ${fontOptionsEl}
      </select>`;

      if (options.fonts.fontName) {
        rte.add("fontName", {
          icon: fontNamesEl,
          event: "change",
          attributes: {
            style: "padding: 0 4px 2px;",
            title: "Font Name",
          },
          result: (rte, action) => {
            if (!(action.btn?.firstChild instanceof HTMLSelectElement)) return;
            rte.exec("fontName", action.btn?.firstChild?.value);
          },
          update: (rte, action) => {
            if (!(action.btn?.firstChild instanceof HTMLSelectElement)) {
              return 0;
            }
            const value = rte.doc.queryCommandValue(action.name);
            if (value != "false") {
              action.btn.firstChild.value = value;
            }
            return 1;
          },
        });
      }
      if (options.fonts.fontSize) {
        rte.add("fontSize", {
          icon: `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
            <option value="1">xx-small</option>
            <option value="2">x-small</option>
            <option value="3">small</option>
            <option value="4">medium</option>
            <option value="5">large</option>
            <option value="6">x-large</option>
            <option value="7">xx-large</option>
          </select>`,
          event: "change",
          attributes: {
            style: "padding: 0 4px 2px;",
            title: "Font Size",
          },
          result: (rte, action) => {
            if (!(action.btn?.firstChild instanceof HTMLSelectElement)) {
              return;
            }
            rte.exec("fontSize", action.btn.firstChild.value);
          },
          update: (rte, action) => {
            if (!(action.btn?.firstChild instanceof HTMLSelectElement)) {
              return 0;
            }
            const value = rte.doc.queryCommandValue(action.name);
            if (value != "false") {
              action.btn.firstChild.value = value;
            }
            return 1;
          },
        });
      }
      if (options.fonts.fontColor) {
        rte.add("fontColor", {
          icon: `${
            icons?.fontColor ||
            '<b style="pointer-events:none;border-bottom:2px solid">A</b>'
          }
          <div id="foreColor-picker-${editorContainerId.replace("#", "")}"
              class="${
                options.darkColorPicker
                  ? "rte-color-picker dark"
                  : "rte-color-picker light"
              }">
          </div>`,
          attributes: {
            id: "rte-font-color",
            title: "Font Color",
          },
          result: (rte) => {
            const pikerEle = `#foreColor-picker-${editorContainerId.replace(
              "#",
              ""
            )}`;
            if (!pk1[pikerEle])
              pk1[pikerEle] = new Picker(
                pikerEle,
                Array.isArray(options.fonts?.fontColor)
                  ? options.fonts.fontColor
                  : [],
                {
                  open: "span#rte-font-color.gjs-rte-action",
                  closeOnBlur: true,
                }
              );
            pk1[pikerEle].colorChosen((col) => rte.exec("foreColor", col));
          },
        });
      }

      if (options.fonts.hilite) {
        rte.add("hiliteColor", {
          icon: `${
            icons?.hiliteColor ||
            '<b style="pointer-events:none;" class="rte-hilite-btn">A</b>'
          }
          <div id="hilite-picker-${editorContainerId?.replace("#", "")}"
            class="${
              options.darkColorPicker
                ? "rte-color-picker dark"
                : "rte-color-picker light"
            }">
          </div>`,
          attributes: {
            id: "rte-font-hilite",
            title: "Font Highlight",
          },
          result: (rte) => {
            const pikerEle = `#hilite-picker-${editorContainerId?.replace(
              "#",
              ""
            )}`;
            if (!pk2[pikerEle])
              pk2[pikerEle] = new Picker(
                pikerEle,
                Array.isArray(options.fonts?.hilite)
                  ? options.fonts.hilite
                  : [],
                {
                  open: "span#rte-font-hilite.gjs-rte-action",
                  closeOnBlur: true,
                }
              );
            pk2[pikerEle].colorChosen((col) => rte.exec("hiliteColor", col));
          },
        });
      }
    }

    if (options.format) {
      if (options.format.heading1) {
        rte.add("heading1", {
          icon: icons?.heading1 || "<div>H1</div>",
          attributes: {
            title: "Heading 1",
          },
          result: (rte) => rte.exec(formatBlock, "<h1>"),
        });
      }
      if (options.format.heading2) {
        rte.add("heading2", {
          icon: icons?.heading2 || "<div>H2</div>",
          attributes: {
            title: "Heading 2",
          },
          result: (rte) => rte.exec(formatBlock, "<h2>"),
        });
      }
      if (options.format.heading3) {
        rte.add("heading3", {
          icon: icons?.heading3 || "<div>H3</div>",
          attributes: {
            title: "Heading 3",
          },
          result: (rte) => rte.exec(formatBlock, "<h3>"),
        });
      }
      if (options.format.heading4) {
        rte.add("heading4", {
          icon: icons?.heading4 || "<div>H4</div>",
          attributes: {
            title: "Heading 4",
          },
          result: (rte) => rte.exec(formatBlock, "<h4>"),
        });
      }
      if (options.format.heading5) {
        rte.add("heading5", {
          icon: icons?.heading5 || "<div>H5</div>",
          attributes: {
            title: "Heading 5",
          },
          result: (rte) => rte.exec(formatBlock, "<h5>"),
        });
      }
      if (options.format.heading6) {
        rte.add("heading6", {
          icon: icons?.heading6 || "<div>H6</div>",
          attributes: {
            title: "Heading 6",
          },
          result: (rte) => rte.exec(formatBlock, "<h6>"),
        });
      }
      if (options.format.paragraph) {
        rte.add("paragraph", {
          icon: icons?.paragraph || "&#182;",
          attributes: {
            title: "Paragraph",
          },
          result: (rte) => rte.exec(formatBlock, "<p>"),
        });
      }
      if (options.format.quote) {
        rte.add("quote", {
          icon: icons?.quote || '<i class="fa fa-quote-left"></i>',
          attributes: {
            title: "Quote",
          },
          result: (rte) => rte.exec(formatBlock, "<blockquote>"),
        });
      }
      if (options.format.clearFormatting) {
        rte.add("clearFormatting", {
          icon: icons?.clear || '<i class="fa fa-eraser"></i>',
          attributes: {
            title: "Clear Formatting",
          },
          result: (rte) => rte.exec("removeFormat"),
        });
      }
    }

    if (options.indentOutdent) {
      rte.add("indent", {
        icon: icons?.indent || '<i class="fa fa-indent"></i>',
        attributes: {
          title: "Indent",
        },
        result: (rte) => rte.exec("indent"),
      });
      rte.add("outdent", {
        icon: icons?.outdent || '<i class="fa fa-outdent"></i>',
        attributes: {
          title: "Outdent",
        },
        result: (rte) => rte.exec("outdent"),
      });
    }
    if (options.subscriptSuperscript) {
      rte.add("subscript", {
        icon: icons?.subscript || "<div>X<sub>2</sub></div>",
        attributes: {
          title: "Subscript",
        },
        result: (rte) => rte.exec("subscript"),
      });
      rte.add("superscript", {
        icon: icons?.superscript || "<div>X<sup>2</sup></div>",
        attributes: {
          title: "Superscript",
        },
        result: (rte) => rte.exec("superscript"),
      });
    }

    if (options.list) {
      rte.add("olist", {
        icon: icons?.olist || '<i class="fa fa-list-ol"></i>',
        attributes: {
          title: "Ordered List",
        },
        result: (rte) => rte.exec("insertOrderedList"),
      });
      rte.add("ulist", {
        icon: icons?.ulist || '<i class="fa fa-list-ul"></i>',
        attributes: {
          title: "Unordered List",
        },
        result: (rte) => rte.exec("insertUnorderedList"),
      });
    }

    if (options.align) {
      rte.add("justifyLeft", {
        icon: icons?.justifyLeft || '<i class="fa fa-align-left"></i>',
        attributes: {
          title: "Align Left",
        },
        result: (rte) => rte.exec("justifyLeft"),
      });
      rte.add("justifyCenter", {
        icon: icons?.justifyCenter || '<i class="fa fa-align-center"></i>',
        attributes: {
          title: "Align Center",
        },
        result: (rte) => rte.exec("justifyCenter"),
      });
      rte.add("justifyFull", {
        icon: icons?.justifyFull || '<i class="fa fa-align-justify"></i>',
        attributes: {
          title: "Align Justify",
        },
        result: (rte) => rte.exec("justifyFull"),
      });
      rte.add("justifyRight", {
        icon: icons?.justifyRight || '<i class="fa fa-align-right"></i>',
        attributes: {
          title: "Align Right",
        },
        result: (rte) => rte.exec("justifyRight"),
      });
    }

    if (options.actions) {
      if (options.actions.copy) {
        rte.add("copy", {
          icon: icons?.copy || '<i class="fa fa-files-o"></i>',
          attributes: {
            title: "Copy",
          },
          result: (rte) => rte.exec("copy"),
        });
      }
      if (options.actions.cut) {
        rte.add("cut", {
          icon: icons?.cut || '<i class="fa fa-scissors"></i>',
          attributes: {
            title: "Cut",
          },
          result: (rte) => rte.exec("cut"),
        });
      }
      if (options.actions.paste) {
        rte.add("paste", {
          icon: icons?.paste || '<i class="fa fa-clipboard"></i>',
          attributes: {
            title: "Paste",
          },
          result: (rte) => rte.exec("paste"),
        });
      }
      if (options.actions.delete) {
        rte.add("delete", {
          icon: icons?.delete || '<i class="fa fa-trash-o"></i>',
          attributes: {
            title: "Delete",
          },
          result: (rte) => rte.exec("delete"),
        });
      }
    }

    if (options.extra) {
      rte.add("code", {
        icon: icons?.code || '<i class="fa fa-code"></i>',
        attributes: {
          title: "Code",
        },
        result: (rte) => rte.exec(formatBlock, "<pre>"),
      });
      rte.add("line", {
        icon: icons?.line || "<b>&#8213;</b>",
        attributes: {
          title: "Horizontal Line",
        },
        result: (rte) => rte.exec("insertHorizontalRule"),
      });
    }

    if (options.undoredo) {
      rte.add("undo", {
        icon: icons?.undo || '<i class="fa fa-reply"></i>',
        attributes: {
          title: "Undo",
        },
        result: (rte) => rte.exec("undo"),
      });
      rte.add("redo", {
        icon: icons?.redo || '<i class="fa fa-share"></i>',
        attributes: {
          title: "Redo",
        },
        result: (rte) => rte.exec("redo"),
      });
    }
  });
};

export default plugin;
