import Piklor from './colorPicker';

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
      darkColorPicker: true,
    },
    ...opts
  };

  const formatBlock = 'formatBlock';

  const rte = editor.RichTextEditor;
  if (options.maxWidth)
    rte.getToolbarEl().firstChild.style.maxWidth = options.maxWidth;

  const fontNames = options.fonts.fontName ?
    (Array.isArray(options.fonts.fontName) ? options.fonts.fontName : false) : false;

  options.fonts.fontName = fontNames;
  let fontOptionsEl = '';
  fontNames && fontNames.forEach(font => {
    fontOptionsEl += '<option>' + font.toString() + '</option>'
  });

  const fontNamesEl = `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
      ${fontOptionsEl}
    </select>`;

  //remove defaults if not required
  !options.base && !options.base.bold && rte.remove('bold');
  !options.base && !options.base.italic && rte.remove('italic');
  !options.base && !options.base.underline && rte.remove('underline');
  !options.base && !options.base.strikethrough && rte.remove('strikethrough');
  !options.base && !options.base.link && rte.remove('link');
  options.fonts && options.fonts.fontName && rte.add('fontName', {
    icon: fontNamesEl,
    // Bind the 'result' on 'change' listener
    event: 'change',
    attributes: {
      style: "padding: 0 4px 2px;",
      title: 'Font Name'
    },
    result: (rte, action) => rte.exec('fontName', action.btn.firstChild.value),
    // Callback on any input change (mousedown, keydown, etc..)
    update: (rte, action) => {
      const value = rte.doc.queryCommandValue(action.name);
      if (value != 'false') { // value is a string
        action.btn.firstChild.value = value;
      }
    }
  });
  options.fonts && options.fonts.fontSize && rte.add('fontSize', {
    icon: `<select style="height:1.8rem;color:inherit;" class="gjs-field gjs-field-select">
          <option>1</option>
          <option>2</option>
          <option>3</option>
          <option>4</option>
          <option>5</option>
          <option>6</option>
          <option>7</option>
        </select>`,
    // Bind the 'result' on 'change' listener
    event: 'change',
    attributes: {
      style: "padding: 0 4px 2px;",
      title: 'Font Size'
    },
    result: (rte, action) => rte.exec('fontSize', action.btn.firstChild.value),
    // Callback on any input change (mousedown, keydown, etc..)
    update: (rte, action) => {
      const value = rte.doc.queryCommandValue(action.name);
      if (value != 'false') { // value is a string
        action.btn.firstChild.value = value;
      }
    }
  });
  let pk1 = null;
  options.fonts && options.fonts.fontColor && rte.add('fontColor', {
    icon: `<b style="pointer-events: none"><u>A</u></b>
      <div id="foreColor-picker" 
          class="${options.darkColorPicker ? 'rte-color-picker-dark rte-color-picker' : 'rte-color-picker-light rte-color-picker'}">
      </div>`,
    attributes: {
      id: 'rte-font-color',
      title: 'Font Color'
    },
    result: rte => {
      if (!pk1) pk1 = new Piklor("#foreColor-picker", options.fonts.fontColor ?
        (Array.isArray(options.fonts.fontColor) ? options.fonts.fontColor : null) : null, {
          open: "span#rte-font-color.gjs-rte-action",
          closeOnBlur: true
        });
      pk1.colorChosen(col => rte.exec('foreColor', col));
    },
  });
  let pk2 = null;
  options.fonts && options.fonts.hilite && rte.add('hiliteColor', {
    icon: `<b style="pointer-events: none;" class="rte-hilite-btn">A</b>
      <div id="hilite-picker" 
        class="${options.darkColorPicker ? 'rte-color-picker-dark rte-color-picker' : 'rte-color-picker-light rte-color-picker'}">
      </div>`,
    attributes: {
      id: 'rte-font-hilite',
      title: 'Font Highlight'
    },
    result: rte => {
      if (!pk2) pk2 = new Piklor("#hilite-picker", options.fonts.hilite ?
        (Array.isArray(options.fonts.hilite) ? options.fonts.hilite : null) : null, {
          open: "span#rte-font-hilite.gjs-rte-action",
          closeOnBlur: true
        });
      pk2.colorChosen(col => rte.exec('hiliteColor', col));
    },
  });
  options.format && options.format.heading1 && rte.add('heading1', {
    icon: '<b>H<sub>1</sub></b>',
    attributes: {
      title: 'Heading 1'
    },
    result: rte => rte.exec(formatBlock, '<h1>')
  });
  options.format && options.format.heading2 && rte.add('heading2', {
    icon: '<b>H<sub>2</sub></b>',
    attributes: {
      title: 'Heading 2'
    },
    result: rte => rte.exec(formatBlock, '<h2>')
  });
  options.format && options.format.heading3 && rte.add('heading3', {
    icon: '<b>H<sub>3</sub></b>',
    attributes: {
      title: 'Heading 3'
    },
    result: rte => rte.exec(formatBlock, '<h3>')
  });
  options.format && options.format.heading4 && rte.add('heading4', {
    icon: '<b>H<sub>4</sub></b>',
    attributes: {
      title: 'Heading 4'
    },
    result: rte => rte.exec(formatBlock, '<h4>')
  });
  options.format && options.format.heading5 && rte.add('heading5', {
    icon: '<b>H<sub>5</sub></b>',
    attributes: {
      title: 'Heading 5'
    },
    result: rte => rte.exec(formatBlock, '<h5>')
  });
  options.format && options.format.heading6 && rte.add('heading6', {
    icon: '<b>H<sub>6</sub></b>',
    attributes: {
      title: 'Heading 6'
    },
    result: rte => rte.exec(formatBlock, '<h6>')
  });
  options.format && options.format.paragraph && rte.add('paragraph', {
    icon: '&#182;',
    attributes: {
      title: 'Paragraph'
    },
    result: rte => rte.exec(formatBlock, '<p>')
  });
  options.format && options.format.quote && rte.add('quote', {
    icon: '<i class="fa fa-quote-left"></i>',
    attributes: {
      title: 'Quote'
    },
    result: rte => rte.exec(formatBlock, '<blockquote>')
  });
  options.format && options.format.clearFormatting && rte.add('clearFormatting', {
    icon: '<i class="fa fa-eraser"></i>',
    attributes: {
      title: 'Clear Formatting'
    },
    result: rte => rte.exec('removeFormat')
  });
  options.indentOutdent && rte.add('indent', {
    icon: '<i class="fa fa-indent"></i>',
    attributes: {
      title: 'Indent'
    },
    result: rte => rte.exec('indent')
  });
  options.indentOutdent && rte.add('outdent', {
    icon: '<i class="fa fa-outdent"></i>',
    attributes: {
      title: 'Outdent'
    },
    result: rte => rte.exec('outdent')
  });
  options.subscriptSuperscript && rte.add('subscript', {
    icon: '<b>X<sub>2</sub></b>',
    attributes: {
      title: 'Subscript'
    },
    result: rte => rte.exec('subscript')
  });
  options.subscriptSuperscript && rte.add('superscript', {
    icon: '<b>X<sup>2</sup></b>',
    attributes: {
      title: 'Superscript'
    },
    result: rte => rte.exec('superscript')
  });
  options.list && rte.add('olist', {
    icon: '<i class="fa fa-list-ol"></i>',
    attributes: {
      title: 'Ordered List'
    },
    result: rte => rte.exec('insertOrderedList')
  });
  options.list && rte.add('ulist', {
    icon: '<i class="fa fa-list-ul"></i>',
    attributes: {
      title: 'Unordered List'
    },
    result: rte => rte.exec('insertUnorderedList')
  });
  options.align && rte.add('justifyLeft', {
    icon: '<i class="fa fa-align-left"></i>',
    attributes: {
      title: 'Align Left'
    },
    result: rte => rte.exec('justifyLeft')
  });
  options.align && rte.add('justifyCenter', {
    icon: '<i class="fa fa-align-center"></i>',
    attributes: {
      title: 'Align Center'
    },
    result: rte => rte.exec('justifyCenter')
  });
  options.align && rte.add('justifyFull', {
    icon: '<i class="fa fa-align-justify"></i>',
    attributes: {
      title: 'Align Justify'
    },
    result: rte => rte.exec('justifyFull')
  });
  options.align && rte.add('justifyRight', {
    icon: '<i class="fa fa-align-right"></i>',
    attributes: {
      title: 'Align Right'
    },
    result: rte => rte.exec('justifyRight')
  });
  options.actions && options.actions.copy && rte.add('copy', {
    icon: '<i class="fa fa-files-o"></i>',
    attributes: {
      title: 'Copy'
    },
    result: rte => rte.exec('copy')
  });
  options.actions && options.actions.cut && rte.add('cut', {
    icon: '<i class="fa fa-scissors"></i>',
    attributes: {
      title: 'Cut'
    },
    result: rte => rte.exec('cut')
  });
  options.actions && options.actions.paste && rte.add('paste', {
    icon: '<i class="fa fa-clipboard"></i>',
    attributes: {
      title: 'Paste'
    },
    result: rte => rte.exec('paste')
  });
  options.actions && options.actions.delete && rte.add('delete', {
    icon: '<i class="fa fa-trash-o"></i>',
    attributes: {
      title: 'Delete'
    },
    result: rte => rte.exec('delete')
  });
  options.extra && rte.add('code', {
    icon: '<i class="fa fa-code"></i>',
    attributes: {
      title: 'Code'
    },
    result: rte => rte.exec(formatBlock, '<pre>')
  });
  options.extra && rte.add('line', {
    icon: '<b>&#8213;</b>',
    attributes: {
      title: 'Horizontal Line'
    },
    result: rte => rte.exec('insertHorizontalRule')
  });
  options.undoredo && rte.add('undo', {
    icon: '<i class="fa fa-reply"></i>',
    attributes: {
      title: 'Undo'
    },
    result: rte => rte.exec('undo')
  });
  options.undoredo && rte.add('redo', {
    icon: '<i class="fa fa-share"></i>',
    attributes: {
      title: 'Redo'
    },
    result: rte => rte.exec('redo')
  });
};