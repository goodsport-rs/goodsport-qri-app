import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { menuReinitialization } from 'src/app/_metronic/kt/kt-helpers';
import { AuthService, UserType } from '../../../../../modules/auth';

@Component({
	selector: 'app-navbar',
	templateUrl: './navbar.component.html',
	styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit, AfterViewInit {
	@Input() appHeaderDefaulMenuDisplay: boolean;
	@Input() isRtl: boolean;

	itemClass: string = 'ms-1 ms-lg-3';
	btnClass: string = 'btn btn-icon btn-custom btn-icon-muted btn-active-light btn-active-color-primary w-35px h-35px w-md-40px h-md-40px';
	userAvatarClass: string = 'symbol-35px symbol-md-40px';
	btnIconClass: string = 'fs-2 fs-md-1';
	user$: Observable<UserType>;

	constructor(private auth: AuthService) { }

	ngAfterViewInit(): void {
		menuReinitialization();
	}

	ngOnInit(): void {
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
