import 'jquery';
import { PasswordRequirementsOptions } from '@/plugins/jquery.passwordRequirements';

declare module 'jquery' {
  interface JQuery {
    passwordRequirements(options?: PasswordRequirementsOptions): JQuery;
  }
}
