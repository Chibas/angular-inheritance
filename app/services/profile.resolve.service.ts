import {Injectable, OnInit} from '@angular/core';
import {ActivatedRouteSnapshot, Router} from '@angular/router';
import {AlertService} from './alert.service';


@Injectable()
export class ProfileResolve implements OnInit {
	profile;
	constructor(
          private alertService: AlertService,
          private router: Router) {
	}

	resolve(route: ActivatedRouteSnapshot) {
		let id = +route.params['id'];
		this.processing(true);
		return this.getProfile(id)
			.then(
				data => {
					this.processing(false);
					return data;
				},
				error => {
					console.log(error);
					this.processing(false);
					this.alertService.alert(error.toString(), true);
					this.router.navigate(['/events']);
					return false;
				}
			);
	}

	ngOnInit() {}

	public getProfile(id) {
		return new Promise((resolve, reject) => {

			let csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
			let csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
			let form = new FormData();
			form.append(csrf, csrf_token);

			setTimeout(() => {
				this.profile = {
					firstName: "Jeffrey",
					lastName: "Williams",
					dob: "09/10/1990",
					location: "Old Bridge, New Jersey",
					institution: "NJ High School",
					team: "Eagles",
					description: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum",
					profileImg: "assets/images/profile-img.jpg"
				};
				resolve(this.profile);
			}, 500);
		});
	}

	protected processing(inProgress) {
		this.alertService.processing(inProgress);
	}

}
