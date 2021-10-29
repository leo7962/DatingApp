import {Injectable} from '@angular/core';
import {CanDeactivate} from '@angular/router';
import {MemberEditComponent} from '../members/member-edit/member-edit.component';

@Injectable()
export class PreventUnsaveChanges
  implements CanDeactivate<MemberEditComponent> {
  canDeactivate(component: MemberEditComponent) {
    if (component.editForm.dirty) {
      return confirm(
        '¿Está seguro de continuar? algún cambio que no haya sido guardado podría perderse'
      );
    }
    return true;
  }
}
