import $ from 'jquery';

// Expose jQuery globally for legacy plugins
(window as any).$ = $;
(window as any).jQuery = $;

// ---- Legacy jQuery plugins (side-effect imports) ----
import './jquery.passwordRequirements.ts';
import 'select2';

// Bootstrap 5 tooltip/popover are initialized via vanilla JS in App.vue

export default $;
