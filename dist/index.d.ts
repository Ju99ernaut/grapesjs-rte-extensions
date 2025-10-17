import { Plugin } from 'grapesjs';

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
export declare const plugin: Plugin<PluginOptions>;

export {
	plugin as default,
};

export {};
