import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({ providedIn: 'root' })
export class SweetAlertService {
  constructor() {}

  successMessage(title: string) {
    Swal.fire({
      position: 'center',
      icon: 'success',
      title,
      showConfirmButton: false,
      timer: 2000,
    });
  }

  errorMessage(title: string) {
    Swal.fire({
      position: 'center',
      icon: 'error',
      title,
      showConfirmButton: false,
      timer: 2500,
    });
  }
}
