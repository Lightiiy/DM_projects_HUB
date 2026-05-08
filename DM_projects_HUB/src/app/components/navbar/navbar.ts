import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dm-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
  
  toggleNav = signal<boolean>(false);

  router = inject(Router);

  navLinks = this.router.config.filter(route => route.title).map(route => ({
    path: route.path,
    label: route.title
  }))

  toggleNavList() {
    this.toggleNav.set(!this.toggleNav());

  }
}
