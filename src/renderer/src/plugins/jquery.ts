import $ from 'jquery';

// Expose jQuery globally for legacy plugins
(window as any).$ = $;
(window as any).jQuery = $;

// ---- Legacy jQuery plugins (side-effect imports) ----
import './jquery.passwordRequirements.ts';
import 'select2';

// Bootstrap 4 ONLY (jQuery-based)
import 'bootstrap/js/dist/tooltip';
import 'bootstrap/js/dist/popover';

// Optional auto-init
/* $(function () {
  $('[data-toggle="tooltip"]').tooltip();
  $('[data-toggle="popover"]').popover();
}); */

export default $;
