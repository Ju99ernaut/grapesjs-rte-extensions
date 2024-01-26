import Piklor from "./colorPicker";

export default (editor, opts = {}) => {
  const options = {
    ...{
      // default options
      base: {
        bold: true,
        italic: true,
        underline: true,
        strikethrough: true,
        link: true,
      },
      //fonts: {
      //  fontName: ['font1',...,'fontn'],
      //  fontSize: true,
      //  //An array of strings representing colors
      //  fontColor: [],
      //  //An array of strings representing colors
      //  hilite: [],
      //}
      fonts: {
        fontColor: true,
        hilite: true,
      },
      format: {
        heading1: true,
        heading2: true,
        heading3: true,
        //heading4: false,
        //heading5: false,
        //heading6: false,
        paragraph: true,
        //quote: false,
        clearFormatting: true,
      },
      subscriptSuperscript: false,
      indentOutdent: false,
      list: false,
      align: true,
      //actions: {
      //  copy: true,
      //  cut: true,
      //  paste: true,
      //  delete: true,
      //},
      actions: false,
      undoredo: false,
      extra: false,
      icons: {},
      darkColorPicker: true,
    },
    ...opts,
  };

  const { icons } = options;
  const formatBlock = "formatBlock";
  const rte = editor.RichTextEditor;

  const fontNames = options.fonts.fontName
    ? Array.isArray(options.fonts.fontName)
      ? options.fonts.fontName
      : false
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

  editor.onReady(() => {
    if (options.maxWidth)
      rte.getToolbarEl().firstChild.style.maxWidth = options.maxWidth;

    //remove defaults if not required
    if (!options.base || typeof options.base === "object") {
      !options.base.bold && rte.remove("bold");
      !options.base.italic && rte.remove("italic");
      !options.base.underline && rte.remove("underline");
      !options.base.strikethrough && rte.remove("strikethrough");
      !options.base.link && rte.remove("link");
    }
    options.fonts &&
      options.fonts.fontName &&
      rte.add("fontName", {
        icon: fontNamesEl,
        // Bind the 'result' on 'change' listener
        event: "change",
        attributes: {
          style: "padding: 0 4px 2px;",
          title: "Font Name",
        },
        result: (rte, action) =>
          rte.exec("fontName", action.btn.firstChild.value),
        // Callback on any input change (mousedown, keydown, etc..)
        update: (rte, action) => {
          const value = rte.doc.queryCommandValue(action.name);
          if (value != "false") {
            // value is a string
            action.btn.firstChild.value = value;
          }
        },
      });
    options.fonts &&
      options.fonts.fontSize &&
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
        // Bind the 'result' on 'change' listener
        event: "change",
        attributes: {
          style: "padding: 0 4px 2px;",
          title: "Font Size",
        },
        result: (rte, action) =>
          rte.exec("fontSize", action.btn.firstChild.value),
        // Callback on any input change (mousedown, keydown, etc..)
        update: (rte, action) => {
          const value = rte.doc.queryCommandValue(action.name);
          if (value != "false") {
            // value is a string
            action.btn.firstChild.value = value;
          }
        },
      });
    const pk1 = {};
    options.fonts &&
      options.fonts.fontColor &&
      rte.add("fontColor", {
        icon: `${
          icons.fontColor ||
          '<b style="pointer-events:none;border-bottom:2px solid">A</b>'
        }
      <div id="foreColor-picker-${editor.Config.container.replace("#", "")}"
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
          const pikerEle = `#foreColor-picker-${editor.Config.container.replace(
            "#",
            ""
          )}`;
          if (!pk1[pikerEle])
            pk1[pikerEle] = new Piklor(
              pikerEle,
              options.fonts.fontColor
                ? Array.isArray(options.fonts.fontColor)
                  ? options.fonts.fontColor
                  : null
                : null,
              {
                open: "span#rte-font-color.gjs-rte-action",
                closeOnBlur: true,
              }
            );
          pk1[pikerEle].colorChosen((col) => rte.exec("foreColor", col));
        },
      });
    let pk2 = {};
    options.fonts &&
      options.fonts.hilite &&
      rte.add("hiliteColor", {
        icon: `${
          icons.hiliteColor ||
          '<b style="pointer-events:none;" class="rte-hilite-btn">A</b>'
        }
      <div id="hilite-picker-${editor.Config.container.replace("#", "")}"
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
          const pikerEle = `#hilite-picker-${editor.Config.container.replace(
            "#",
            ""
          )}`;
          if (!pk2[pikerEle])
            pk2[pikerEle] = new Piklor(
              pikerEle,
              options.fonts.hilite
                ? Array.isArray(options.fonts.hilite)
                  ? options.fonts.hilite
                  : null
                : null,
              {
                open: "span#rte-font-hilite.gjs-rte-action",
                closeOnBlur: true,
              }
            );
          pk2[pikerEle].colorChosen((col) => rte.exec("hiliteColor", col));
        },
      });
    options.format &&
      options.format.heading1 &&
      rte.add("heading1", {
        icon: icons.heading1 || "<div>H1</div>",
        attributes: {
          title: "Heading 1",
        },
        result: (rte) => rte.exec(formatBlock, "<h1>"),
      });
    options.format &&
      options.format.heading2 &&
      rte.add("heading2", {
        icon: icons.heading2 || "<div>H2</div>",
        attributes: {
          title: "Heading 2",
        },
        result: (rte) => rte.exec(formatBlock, "<h2>"),
      });
    options.format &&
      options.format.heading3 &&
      rte.add("heading3", {
        icon: icons.heading3 || "<div>H3</div>",
        attributes: {
          title: "Heading 3",
        },
        result: (rte) => rte.exec(formatBlock, "<h3>"),
      });
    options.format &&
      options.format.heading4 &&
      rte.add("heading4", {
        icon: icons.heading4 || "<div>H4</div>",
        attributes: {
          title: "Heading 4",
        },
        result: (rte) => rte.exec(formatBlock, "<h4>"),
      });
    options.format &&
      options.format.heading5 &&
      rte.add("heading5", {
        icon: icons.heading5 || "<div>H5</div>",
        attributes: {
          title: "Heading 5",
        },
        result: (rte) => rte.exec(formatBlock, "<h5>"),
      });
    options.format &&
      options.format.heading6 &&
      rte.add("heading6", {
        icon: icons.heading6 || "<div>H6</div>",
        attributes: {
          title: "Heading 6",
        },
        result: (rte) => rte.exec(formatBlock, "<h6>"),
      });
    options.format &&
      options.format.paragraph &&
      rte.add("paragraph", {
        icon: icons.paragraph || "&#182;",
        attributes: {
          title: "Paragraph",
        },
        result: (rte) => rte.exec(formatBlock, "<p>"),
      });
    options.format &&
      options.format.quote &&
      rte.add("quote", {
        icon: icons.quote || '<i class="fa fa-quote-left"></i>',
        attributes: {
          title: "Quote",
        },
        result: (rte) => rte.exec(formatBlock, "<blockquote>"),
      });
    options.format &&
      options.format.clearFormatting &&
      rte.add("clearFormatting", {
        icon: icons.clear || '<i class="fa fa-eraser"></i>',
        attributes: {
          title: "Clear Formatting",
        },
        result: (rte) => rte.exec("removeFormat"),
      });
    options.indentOutdent &&
      rte.add("indent", {
        icon: icons.indent || '<i class="fa fa-indent"></i>',
        attributes: {
          title: "Indent",
        },
        result: (rte) => rte.exec("indent"),
      });
    options.indentOutdent &&
      rte.add("outdent", {
        icon: icons.outdent || '<i class="fa fa-outdent"></i>',
        attributes: {
          title: "Outdent",
        },
        result: (rte) => rte.exec("outdent"),
      });
    options.subscriptSuperscript &&
      rte.add("subscript", {
        icon: icons.subscript || "<div>X<sub>2</sub></div>",
        attributes: {
          title: "Subscript",
        },
        result: (rte) => rte.exec("subscript"),
      });
    options.subscriptSuperscript &&
      rte.add("superscript", {
        icon: icons.superscript || "<div>X<sup>2</sup></div>",
        attributes: {
          title: "Superscript",
        },
        result: (rte) => rte.exec("superscript"),
      });
    options.list &&
      rte.add("olist", {
        icon: icons.olist || '<i class="fa fa-list-ol"></i>',
        attributes: {
          title: "Ordered List",
        },
        result: (rte) => rte.exec("insertOrderedList"),
      });
    options.list &&
      rte.add("ulist", {
        icon: icons.ulist || '<i class="fa fa-list-ul"></i>',
        attributes: {
          title: "Unordered List",
        },
        result: (rte) => rte.exec("insertUnorderedList"),
      });
    options.align &&
      rte.add("justifyLeft", {
        icon: icons.justifyLeft || '<i class="fa fa-align-left"></i>',
        attributes: {
          title: "Align Left",
        },
        result: (rte) => rte.exec("justifyLeft"),
      });
    options.align &&
      rte.add("justifyCenter", {
        icon: icons.justifyRight || '<i class="fa fa-align-center"></i>',
        attributes: {
          title: "Align Center",
        },
        result: (rte) => rte.exec("justifyCenter"),
      });
    options.align &&
      rte.add("justifyFull", {
        icon: icons.justifyFull || '<i class="fa fa-align-justify"></i>',
        attributes: {
          title: "Align Justify",
        },
        result: (rte) => rte.exec("justifyFull"),
      });
    options.align &&
      rte.add("justifyRight", {
        icon: icons.justifyRight || '<i class="fa fa-align-right"></i>',
        attributes: {
          title: "Align Right",
        },
        result: (rte) => rte.exec("justifyRight"),
      });
    options.actions &&
      options.actions.copy &&
      rte.add("copy", {
        icon: icons.copy || '<i class="fa fa-files-o"></i>',
        attributes: {
          title: "Copy",
        },
        result: (rte) => rte.exec("copy"),
      });
    options.actions &&
      options.actions.cut &&
      rte.add("cut", {
        icon: icons.cut || '<i class="fa fa-scissors"></i>',
        attributes: {
          title: "Cut",
        },
        result: (rte) => rte.exec("cut"),
      });
    options.actions &&
      options.actions.paste &&
      rte.add("paste", {
        icon: icons.paste || '<i class="fa fa-clipboard"></i>',
        attributes: {
          title: "Paste",
        },
        result: (rte) => rte.exec("paste"),
      });
    options.actions &&
      options.actions.delete &&
      rte.add("delete", {
        icon: icons.delete || '<i class="fa fa-trash-o"></i>',
        attributes: {
          title: "Delete",
        },
        result: (rte) => rte.exec("delete"),
      });
    options.extra &&
      rte.add("code", {
        icon: icons.code || '<i class="fa fa-code"></i>',
        attributes: {
          title: "Code",
        },
        result: (rte) => rte.exec(formatBlock, "<pre>"),
      });
    options.extra &&
      rte.add("line", {
        icon: icons.line || "<b>&#8213;</b>",
        attributes: {
          title: "Horizontal Line",
        },
        result: (rte) => rte.exec("insertHorizontalRule"),
      });
    options.undoredo &&
      rte.add("undo", {
        icon: icons.undo || '<i class="fa fa-reply"></i>',
        attributes: {
          title: "Undo",
        },
        result: (rte) => rte.exec("undo"),
      });
    options.undoredo &&
      rte.add("redo", {
        icon: icons.redo || '<i class="fa fa-share"></i>',
        attributes: {
          title: "Redo",
        },
        result: (rte) => rte.exec("redo"),
      });
  });
};
