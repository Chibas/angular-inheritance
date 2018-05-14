import {Component, OnInit, ViewChild} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {Bounds, CropperSettings, ImageCropperComponent} from '../cropper';
import {CanvasToImage} from '../../helpers/canvastoimage';
import {AlertService} from "../../services/alert.service"

@Component({
	selector: 'app-edit-profile',
	templateUrl: './edit-profile.component.html',
	styleUrls: ['./edit-profile.component.sass']
})
export class EditProfileComponent implements OnInit {

	profileForm: FormGroup;
	profile_id: number;

	user;
	user_id;

	profile: any;
	csrf: string;
	csrf_token: string;

	profileImg;
	profileCropper: CropperSettings;
	croppedWidth: number;
	croppedHeight: number;
	canvas: any;

	Errors = {};

	@ViewChild('cropper', undefined) cropper: ImageCropperComponent;

	constructor(
		private activateRoute: ActivatedRoute,
        private router: Router,
        public fb: FormBuilder,
		private alertService: AlertService
	)
	{
		this.profile_id = +this.activateRoute.snapshot.paramMap.get('id');

		this.profileCropper = new CropperSettings();
		this.profileCropper.width = 295;
		this.profileCropper.height = 295;
		this.profileCropper.croppedWidth = 280;
		this.profileCropper.croppedHeight = 280;
		this.profileCropper.canvasWidth = 295;
		this.profileCropper.canvasHeight = 295;
		this.profileCropper.minWidth = 10;
		this.profileCropper.minHeight = 10;
		this.profileCropper.rounded = false;
		this.profileCropper.keepAspect = true;
		this.profileCropper.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
		this.profileCropper.cropperDrawSettings.strokeWidth = 2;

		this.profileImg = {};
	}

	ngOnInit() {
		this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
		this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');

		this.activateRoute.data
			.subscribe((data: { profile }) => {
				this.profile = data.profile;
			});

		this.profileForm = this.fb.group({
			'firstName': new FormControl(this.profile.firstName, [Validators.required, Validators.minLength(5)]),
			'lastName': new FormControl(this.profile.lastName, Validators.required),
			'dob': new FormControl(this.profile.dob, [Validators.required]),
			'location': new FormControl(this.profile.location, [Validators.required]),
			'institution': new FormControl(this.profile.institution, [Validators.required]),
			'team': new FormControl(this.profile.team, [Validators.required]),
			'description': new FormControl(this.profile.description, [Validators.required]),
		});

		this.user = JSON.parse((<any>window).localStorage.getItem('currentUser'));
		this.user_id = this.user.user_id;
	}


	protected processing(inProgress) {
		this.alertService.processing(inProgress);
	}

	cropped(bounds: Bounds) {
		this.croppedHeight = 322;
		this.croppedWidth = 645;
	}

	fileChangeListener($event) {
		const image: any = new Image();
		const file: File = $event.target.files[0];
		const myReader: FileReader = new FileReader();
		const that = this;
		myReader.onloadend = function (loadEvent: any) {
			image.src = loadEvent.target.result;
			that.cropper.setImage(image);
		};

		myReader.readAsDataURL(file);
	}

	cancel(event) {
		this.profileForm.reset();
		this.router.navigate(['/events']);
	}
}
