import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.html',
})
export class App {
  protected readonly navItems = [
    { label: 'Upload', path: '/upload', icon: '⬆️' },
    { label: 'Search', path: '/search', icon: '🔍' },
    { label: 'Documents', path: '/documents', icon: '📁' },
  ];
}
