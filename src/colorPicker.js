//The MIT License (MIT)
//
//Copyright (c) 2015-16 jillix <contact@jillix.com>, https://github.com/jillix/piklor.js/
//Modified to work Copyright (c) 2020-21 Brendon Ngirazi 

export default class Piklor {

    /**
     * Piklor
     * Creates a new `Piklor` instance.
     *
     * @name Piklor
     * @function
     * @param {String|Element} sel The element where the color picker will live.
     * @param {Array} colors An array of strings representing colors.
     * @param {Object} options An object containing the following fields:
     *
     *  - `open` (String|Element): The HTML element or query selector which will open the picker.
     *  - `openEvent` (String): The open event (default: `"click"`).
     *  - `style` (Object): Some style options:
     *    - `display` (String): The display value when the picker is opened (default: `"block"`).
     *  - `template` (String): The color item template. The `{color}` snippet will be replaced
     *    with the color value (default: `"<div data-col=\"{color}\" style=\"background-color: {color}\"></div>"`).
     *  - `autoclose` (Boolean): If `false`, the color picker will not be hided by default (default: `true`).
     *  - `closeOnBlur` (Boolean): If `true`, the color picker will be closed when clicked outside of it (default: `false`).
     *
     * @return {Piklor} The `Piklor` instance.
     */
    constructor(sel, colors, options, /*event = 'pick'*/ ) {
        var self = this;
        options = options ? options : {};
        colors = colors ? colors : [
            "#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"
        ];
        options.open = self.getElm(options.open);
        options.openEvent = options.openEvent || "click";
        options.style = Object(options.style);
        options.style.display = options.style.display || "block";
        options.closeOnBlur = options.closeOnBlur || false;
        options.template = options.template || "<div data-col=\"{color}\" style=\"background-color: {color}\" title=\"{color}\" ></div>";
        //self.pick = new Event(event);
        self.elm = self.getElm(sel);
        self.cbs = [];
        self.color = '';
        self.isOpen = true;
        self.colors = colors;
        self.options = options;
        self.render();

        // Handle the open element and event.
        if (options.open) {
            options.open.addEventListener(options.openEvent, ev => {
                self.isOpen ? self.close() : self.open();
            });
        }

        // Click on colors
        self.elm.addEventListener("click", ev => {
            var col = ev.target.getAttribute("data-col");
            if (!col) {
                return;
            }
            self.color = col;
            //self.elm.dispatchEvent(self.pick);
            self.set(col);
            self.close();
        });

        if (options.closeOnBlur) {
            window.addEventListener("click", ev => {
                // check if we didn't click 'open' and 'color pallete' elements
                if (ev.target != options.open && ev.target != self.elm && self.isOpen) {
                    self.close();
                }
            });
        }

        if (options.autoclose !== false) {
            self.close();
        }
    };

    /**
     * getElm
     * Finds the HTML element.
     *
     * @name getElm
     * @function
     * @param {String|Element} el The HTML element or query selector.
     * @return {HTMLElement} The selected HTML element.
     */
    getElm(el) {
        if (typeof el === "string") {
            return document.querySelector(el);
        }
        return el;
    };

    /**
     * render
     * Renders the colors.
     *
     * @name render
     * @function
     */
    render() {
        var self = this,
            html = "";

        self.colors.forEach(c => {
            html += self.options.template.replace(/\{color\}/g, c);
        });

        self.elm.innerHTML = html;
    };

    /**
     * close
     * Closes the color picker.
     *
     * @name close
     * @function
     */
    close() {
        this.elm.style.display = "none";
        this.isOpen = false;
    };

    /**
     * open
     * Opens the color picker.
     *
     * @name open
     * @function
     */
    open() {
        this.elm.style.display = this.options.style.display;
        this.isOpen = true;
    };

    /**
     * colorChosen
     * Adds a new callback in the colorChosen callback buffer.
     *
     * @name colorChosen
     * @function
     * @param {Function} cb The callback function called with the selected color.
     */
    colorChosen(cb) {
        this.cbs.push(cb);
    };

    /**
     * set
     * Sets the color picker color.
     *
     * @name set
     * @function
     * @param {String} c The color to set.
     * @param {Boolean} p If `false`, the `colorChosen` callbacks will not be called.
     */
    set(c, p) {
        var self = this;
        self.color = c;
        if (p === false) {
            return;
        }
        self.cbs.forEach(cb => {
            cb && cb(c);
        });
        self.cbs = [];
        //self.elm.dispatchEvent(self.pick);
    };
};
