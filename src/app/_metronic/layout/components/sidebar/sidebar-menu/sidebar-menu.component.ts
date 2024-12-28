// src/app/_metronic/layout/components/sidebar/sidebar-menu/sidebar-menu.component.ts
import { Component, OnInit } from '@angular/core';
import {AuthService} from "../../../../../modules/auth";


interface MenuItem {
  title: string;
  link: string;
  roles: string[];
  icon: string; // Add this line
}

@Component({
  selector: 'app-sidebar-menu',
  templateUrl: './sidebar-menu.component.html',
  styleUrls: ['./sidebar-menu.component.scss']
})
export class SidebarMenuComponent implements OnInit {
  menuItems: MenuItem[] = [
    { title: 'Dashboard', link: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_ENTREPRENEUR', 'ROLE_INVESTOR'], icon: 'element-11' },
    { title: 'Categories', link: '/admin/categories', roles: ['ROLE_ADMIN'], icon: 'element-12' },
    { title: 'Investments', link: '/investments', roles: ['ROLE_INVESTOR'], icon: 'element-13' },
    { title: 'Projects', link: '/projects', roles: ['ROLE_ENTREPRENEUR','ROLE_ADMIN'], icon: 'element-14' },
    { title: 'Entrepreneurs', link: '/entrepreneurs', roles: ['ROLE_ADMIN', 'ROLE_ENTREPRENEUR'], icon: 'rocket' },
    { title: 'Investors', link: '/investors', roles: ['ROLE_ADMIN', 'ROLE_INVESTOR'], icon: 'briefcase' },
    { title: 'Media', link: '/media', roles: ['ROLE_ADMIN'], icon: 'element-11' },
    { title: 'Partners', link: '/partners', roles: ['ROLE_ADMIN'], icon: 'element-11' },
    { title: 'Users', link: '/apps/users', roles: ['ROLE_ADMIN'], icon: 'user' }
  ];

  filteredMenuItems: MenuItem[] = [];

  constructor(private authService: AuthService) { }

  ngOnInit(): void {
    const userRoles = this.authService.getUserRoles();
    this.filteredMenuItems = this.filterMenuItems(this.menuItems, userRoles);
  }

  filterMenuItems(menuItems: MenuItem[], roles: string[]): MenuItem[] {
    return menuItems.filter(item => item.roles.some(role => roles.includes(role)));
  }
}
