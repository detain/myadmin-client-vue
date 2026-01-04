/// <reference types="jquery" />

interface JQuery {
    // Bootstrap modal plugin
    modal(action?: 'show' | 'hide' | 'toggle' | 'handleUpdate'): JQuery;

    // Bootstrap tooltip plugin
    tooltip(options?: any): JQuery;

    // Optional: add other Bootstrap plugins you use
    dropdown(options?: any): JQuery;
    popover(options?: any): JQuery;

    // Select2 (if also used)
    select2(...args: any[]): JQuery;
}
