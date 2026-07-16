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
    { title: 'Hem', link: '/dashboard', roles: ['ROLE_ADMIN'], icon: 'element-11' },
    { title: 'Kategorier', link: '/admin/categories', roles: ['ROLE_ADMIN'], icon: 'element-12' },
    { title: 'Investeringar', link: '/admin/investments', roles: ['ROLE_ADMIN'], icon: 'diamonds' },
    { title: 'Projekt', link: '/admin/projects', roles: ['ROLE_ADMIN'], icon: 'briefcase' },

    { title: 'Entreprenörer', link: '/admin/entrepreneurs', roles: ['ROLE_ADMIN'], icon: 'rocket' },
    { title: 'Investerare', link: '/admin/investors', roles: ['ROLE_ADMIN'], icon: 'finance-calculator' },
    { title: 'Media', link: '/admin/media', roles: ['ROLE_ADMIN'], icon: 'teacher' },
    { title: 'Partner', link: '/admin/partners', roles: ['ROLE_ADMIN'], icon: 'heart-circle' },
    { title: 'Frågeformulär', link: '/admin/questionnaires', roles: ['ROLE_ADMIN'], icon: 'book' },
    { title: 'Användare', link: '/admin/users', roles: ['ROLE_ADMIN'], icon: 'user' },
    { title: 'Rapporter', link: '/admin/reports', roles: ['ROLE_ADMIN'], icon: 'rocket' },
    { title: 'Projektfaser', link: '/admin/project-questionnaires', roles: ['ROLE_ADMIN'], icon: 'rocket' },

    //Investor
    { title: 'Hem', link: '/investor/home', roles: ['ROLE_INVESTOR'], icon: 'element-11' },
    { title: 'Profil', link: '/investor/profile', roles: ['ROLE_INVESTOR'], icon: 'user-square' },
    { title: 'Projekt', link: '/investor/projects', roles: ['ROLE_INVESTOR'], icon: 'briefcase' },
    { title: 'Investeringar', link: '/investor/investments', roles: ['ROLE_INVESTOR'], icon: 'finance-calculator' },




    //Entrepreneur
    { title: 'Hem', link: '/entrepreneur/home', roles: ['ROLE_ENTREPRENEUR'], icon: 'element-11' },
    { title: 'Min profil', link: '/entrepreneur/profile', roles: ['ROLE_ENTREPRENEUR'], icon: 'user-square' },
    { title: 'Projekt', link: '/entrepreneur/projects', roles: ['ROLE_ENTREPRENEUR'], icon: 'briefcase' },
    { title: 'Kurser', link: '/entrepreneur/courses', roles: ['ROLE_ENTREPRENEUR'], icon: 'teacher' },
    { title: 'Enkäter', link: '/entrepreneur/surveys', roles: ['ROLE_ENTREPRENEUR'], icon: 'note-2' },
    { title: 'GSS', link: '/entrepreneur/gss', roles: ['ROLE_ENTREPRENEUR'], icon: 'information-2' },
    { title: 'Policy', link: '/entrepreneur/policy', roles: ['ROLE_ENTREPRENEUR'], icon: 'shield' },

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
