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
    { title: 'Home', link: '/dashboard', roles: ['ROLE_ADMIN', 'ROLE_ENTREPRENEUR','ROLE_INVESTOR'], icon: 'element-11' },
    { title: 'Categories', link: '/admin/categories', roles: ['ROLE_ADMIN'], icon: 'element-12' },
    { title: 'Investments', link: '/admin/investments', roles: ['ROLE_ADMIN'], icon: 'diamonds' },
    { title: 'Projects', link: '/admin/projects', roles: ['ROLE_ADMIN'], icon: 'briefcase' },

    { title: 'Entrepreneurs', link: '/admin/entrepreneurs', roles: ['ROLE_ADMIN'], icon: 'rocket' },
    { title: 'Investors', link: '/admin/investors', roles: ['ROLE_ADMIN'], icon: 'finance-calculator' },
    { title: 'Media', link: '/admin/media', roles: ['ROLE_ADMIN'], icon: 'teacher' },
    { title: 'Partners', link: '/admin/partners', roles: ['ROLE_ADMIN'], icon: 'element-11' },
    { title: 'Questionnaire', link: '/admin/questionnaires', roles: ['ROLE_ADMIN'], icon: 'element-11' },
    { title: 'Users', link: '/admin/users', roles: ['ROLE_ADMIN'], icon: 'user' },
    //Investor
    { title: 'Profile', link: '/investor/profile', roles: ['ROLE_INVESTOR'], icon: 'element-12' },
    { title: 'Projects', link: '/investor/projects', roles: ['ROLE_INVESTOR'], icon: 'briefcase' },
    { title: 'Investments', link: '/investor/investments', roles: ['ROLE_INVESTOR'], icon: 'finance-calculator' },




    //Entrepreneur
    { title: 'Projects', link: '/entrepreneur/projects', roles: ['ROLE_ENTREPRENEUR'], icon: 'briefcase' },
    { title: 'Courses', link: '/entrepreneur/courses', roles: ['ROLE_ENTREPRENEUR'], icon: 'element-11' },
    { title: 'Surveys', link: '/entrepreneur/surveys', roles: ['ROLE_ENTREPRENEUR'], icon: 'element-11' },
    { title: 'GSS', link: '/entrepreneur/gss', roles: ['ROLE_ENTREPRENEUR'], icon: 'element-11' },
    { title: 'Policy', link: '/entrepreneur/policy', roles: ['ROLE_ENTREPRENEUR'], icon: 'element-11' },

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
