import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { LayoutService } from '../../core/layout.service';
import { AuthService, UserType } from '../../../../modules/auth';

@Component({
  selector: 'app-topbar',
  templateUrl: './topbar.component.html',
  styleUrls: ['./topbar.component.scss'],
})
export class TopbarComponent implements OnInit {
  toolbarButtonMarginClass = 'ms-1 ms-lg-3';
  toolbarButtonHeightClass = 'w-30px h-30px w-md-40px h-md-40px';
  toolbarUserAvatarHeightClass = 'symbol-30px symbol-md-40px';
  toolbarButtonIconSizeClass = 'svg-icon-1';
  headerLeft: string = 'menu';
  user$: Observable<UserType>;

  constructor(
    private layout: LayoutService,
    private auth: AuthService
  ) {}

  ngOnInit(): void {
    this.headerLeft = this.layout.getProp('header.left') as string;
    this.user$ = this.auth.currentUser$;
  }

  getDisplayName(user: UserType): string {
    const userData = user as any;
    const fullName = `${userData?.firstName || ''} ${userData?.lastName || ''}`.trim();

    return fullName || userData?.fullname || userData?.name || userData?.username || userData?.email || 'User';
  }

  getUsername(user: UserType): string {
    const userData = user as any;

    return userData?.username || userData?.email || this.getDisplayName(user);
  }

  getInitials(user: UserType): string {
    const name = this.getDisplayName(user);
    const parts = name.split(/[\s.@_-]+/).filter(Boolean);

    if (!parts.length) {
      return 'U';
    }

    return parts
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  }

  getRoleLabel(user: UserType): string {
    const userData = user as any;
    const rawRole = userData?.roles?.[0]?.role || userData?.roles?.[0] || userData?.role || '';

    if (!rawRole) {
      return 'User';
    }

    return rawRole
      .toString()
      .replace(/^ROLE_/, '')
      .toLowerCase()
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (letter: string) => letter.toUpperCase());
  }

  logout(): void {
    this.auth.logout();
    document.location.reload();
  }
}
