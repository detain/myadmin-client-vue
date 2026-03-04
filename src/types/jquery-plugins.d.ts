import type * as JQuery from 'jquery';

declare global {
    interface JQuery {
        passwordRequirements(options?: any): JQuery;
        modal(action?: 'show' | 'hide' | 'toggle' | 'handleUpdate'): JQuery;
        tooltip(options?: any): JQuery;
        dropdown(options?: any): JQuery;
        popover(options?: any): JQuery;
        select2(...args: any[]): JQuery;
    }
}

export {};
