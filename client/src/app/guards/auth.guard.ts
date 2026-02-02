import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const authGuard: CanActivateFn = () => {
  const router = inject(Router);
  try {
    const token = localStorage.getItem('authToken');
    if (token) return true;
  } catch (e) {
    console.error('Error accessing localStorage:', e);
  }
  router.navigate(['/signin']);
  return false;
};
