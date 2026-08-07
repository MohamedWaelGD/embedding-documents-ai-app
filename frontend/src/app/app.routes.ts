import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: 'upload', pathMatch: 'full' },
  {
    path: 'upload',
    loadComponent: () => import('./pages/upload-page.component').then((m) => m.UploadPageComponent),
  },
  {
    path: 'search',
    loadComponent: () => import('./pages/search-page.component').then((m) => m.SearchPageComponent),
  },
  {
    path: 'documents',
    loadComponent: () =>
      import('./pages/documents-page.component').then((m) => m.DocumentsPageComponent),
  },
  { path: '**', redirectTo: 'upload' },
];
