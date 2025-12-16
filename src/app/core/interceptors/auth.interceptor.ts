import { inject } from '@angular/core';
import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Router } from '@angular/router';
import { Auth } from '../services/auth/auth';
import { MessageService } from 'primeng/api';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const auth = inject(Auth);
  const router = inject(Router);
  const messageService = inject(MessageService);

  const token = auth.token;

  // 1️⃣ Clonamos el request y agregamos el token si existe
  const authReq = token
    ? req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    : req;

  // 2️⃣ Continuamos la request
  return next(authReq).pipe(

    // 3️⃣ Capturamos errores
    catchError((error: HttpErrorResponse) => {
       if (error.status === 401) {
        messageService.add({
          severity: 'warn',
          summary: 'Sesión expirada',
          detail: 'Por favor inicia sesión nuevamente'
        });
        auth.logout();
        router.navigate(['/login']);
      }
      if (error.status === 403) {
        // 🔐 Token inválido o expirado      
        messageService.add({
          severity: 'warn',
          summary: 'Sesión expirada',
          detail: 'Tu sesión ha expirado, vuelve a iniciar sesión',
          life: 3000000
        });
        debugger;
        auth.logout();
        setTimeout(() => {
          router.navigate(['/login']);
        }, 1000);
      }

      return throwError(() => error);
    })
  );
};
