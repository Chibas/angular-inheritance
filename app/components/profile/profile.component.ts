import { Component, OnInit, ViewChild } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';

import { Profile } from '../../helpers/profile';
import { AlertService } from '../../services/alert.service';
import {ActivatedRoute, Router} from '@angular/router';

import {Bounds, CropperSettings, ImageCropperComponent} from '../cropper';
import {CanvasToImage} from '../../helpers/canvastoimage';
import 'cropperjs';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.sass']
})
export class ProfileComponent implements OnInit {

    profileForm: FormGroup;
    profile: Profile;
    profile_id: number;
    profile_img: string;

    user: any;
    user_id: number;
    panelOpenState: boolean = false;



    // new cropper below
    newCropper;
    newImgBlock;
    cropBoxData;
    canvasData;
    cropImgLink;
    showCropModal: boolean = false;
    croppedOptions = {
        width: 200,
        height: 200,
        minWidth: 256,
        minHeight: 256,
        maxWidth: 256,
        maxHeight: 256,
        fillColor: '#fff',
        imageSmoothingEnabled: false,
        imageSmoothingQuality: 'high',
    };


    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    constructor(
        private activatedRoute: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private fb: FormBuilder
    ) {

    }

    ngOnInit() {
        this.activatedRoute.data
            .subscribe((data: { profile }) => {
                this.profile = data.profile;
            });

        this.profile_id = +this.activatedRoute.snapshot.paramMap.get('id');
        this.user = JSON.parse((<any>window).localStorage.getItem('currentUser'));
        this.user_id = this.user.user_id;
        this.profileForm = this.fb.group({
            'firstName': new FormControl(this.profile.firstName, [Validators.required, Validators.minLength(5)]),
            'lastName': new FormControl(this.profile.lastName, Validators.required),
            'dob': new FormControl(this.profile.dob, [Validators.required]),
            'location': new FormControl(this.profile.location, [Validators.required]),
            'institution': new FormControl(this.profile.institution, [Validators.required]),
            'team': new FormControl(this.profile.team, [Validators.required]),
            'description': new FormControl(this.profile.description, [Validators.required]),
        });
        this.profile_img = this.profile.profileImg;

        this.newImgBlock = document.getElementById('newImg');
    }


    protected processing(inProgress) {
        this.alertService.processing(inProgress);
    }

    fileChangeListener($event) {
        const image: any = new Image();
        const file: File = $event.target.files[0];
        const myReader: FileReader = new FileReader();
        const that = this;
        myReader.onloadend = function (loadEvent: any) {
            image.src = loadEvent.target.result;
            that.cropImgLink = image.src;
        };
        myReader.readAsDataURL(file);
        this.showCropModal = true;
    }

    create($event, preview) {
        this.newCropper = null;
        this.newCropper = new Cropper(this.newImgBlock, {
            autoCropArea: 0.5,
            aspectRatio: 1 / 1,
            that : this,
            ready: function () {
                // Set crop box data first
                this.cropper.setCropBoxData(this.cropper.cropBoxData).setCanvasData(this.cropper.canvasData);
                // Create preview
                let clone = this.cloneNode();
                clone.className = '';
                clone.style.cssText = (
                    'display: block;' +
                    'width: 100%;' +
                    'min-width: 0;' +
                    'min-height: 0;' +
                    'max-width: none;' +
                    'max-height: none;'
                );
                preview.appendChild(clone.cloneNode());
            },
            crop: function(e) {
                let data = e.detail;
                let cropper = this.cropper;
                let imageData = cropper.getImageData();
                let previewAspectRatio = data.width / data.height;
                let previewImage = preview.getElementsByTagName('img').item(0);
                let previewWidth = preview.offsetWidth;
                let previewHeight = previewWidth / previewAspectRatio;
                let imageScaledRatio = data.width / previewWidth;
                preview.style.height = previewHeight + 'px';
                previewImage.style.width = imageData.naturalWidth / imageScaledRatio + 'px';
                previewImage.style.height = imageData.naturalHeight / imageScaledRatio + 'px';
                previewImage.style.marginLeft = -data.x / imageScaledRatio + 'px';
                previewImage.style.marginTop = -data.y / imageScaledRatio + 'px';
            }
        });
    }

    setImage() {
        let link = this.newCropper.getCroppedCanvas(this.croppedOptions).toDataURL('image/png');
        this.profile_img = link;
        this.showCropModal = false;
    }

    cancel(event) {
        this.profileForm.reset();
    }

    submit(form) {
        let formData = new FormData(form);
        this.newCropper.getCroppedCanvas(this.croppedOptions).toBlob((blob) => {
            formData.append('profileImg', blob);
        });


    }

}
