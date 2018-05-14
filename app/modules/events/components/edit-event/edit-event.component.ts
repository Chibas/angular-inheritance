import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {EventsService} from '../../../../services/events.service';
import {AlertService} from '../../../../services/alert.service';
import {Bounds, CropperSettings, ImageCropperComponent} from '../../../../components/cropper';
import {CanvasToImage} from '../../../../helpers/canvastoimage';
import {DatePipe} from '@angular/common';

@Component({
    selector: 'app-edit-event',
    templateUrl: './edit-event.component.html',
    styleUrls: ['./edit-event.component.sass']
})
export class EditEventComponent implements OnInit {

    id: number;
    post: any = null;

    value;

    background: any;
    logo: any;

    backgroundCropper: CropperSettings;
    logoCropper: CropperSettings;

    croppedWidth: number;
    croppedHeight: number;

    eventForm: FormGroup;

    csrf_token: string;
    csrf: string;

    canvas: any;

    Errors = [];

    @ViewChild('cropper', undefined) cropper: ImageCropperComponent;

    constructor(private eventService: EventsService,
                private alertService: AlertService,
                private activateRoute: ActivatedRoute,
                private router: Router,
                public fb: FormBuilder,
                private datePipe: DatePipe) {
        this.id = +this.activateRoute.snapshot.paramMap.get('id');


        // FIRST CROPPER SETTINGS
        this.backgroundCropper = new CropperSettings();
        this.backgroundCropper.width = 215;
        this.backgroundCropper.height = 108;
        this.backgroundCropper.croppedWidth = 645;
        this.backgroundCropper.croppedHeight = 322;
        this.backgroundCropper.canvasWidth = 645;
        this.backgroundCropper.canvasHeight = 322;
        this.backgroundCropper.minWidth = 10;
        this.backgroundCropper.minHeight = 10;
        this.backgroundCropper.rounded = false;
        this.backgroundCropper.keepAspect = true;
        this.backgroundCropper.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.backgroundCropper.cropperDrawSettings.strokeWidth = 2;

        this.background = {};

        // SECOND CROPPER
        this.logoCropper = new CropperSettings();
        this.logoCropper.width = 128;
        this.logoCropper.height = 134;
        this.logoCropper.croppedWidth = 132;
        this.logoCropper.croppedHeight = 138;
        this.logoCropper.canvasWidth = 132;
        this.logoCropper.canvasHeight = 138;
        this.logoCropper.minWidth = 10;
        this.logoCropper.minHeight = 10;
        this.logoCropper.rounded = false;
        this.logoCropper.keepAspect = true;
        this.logoCropper.cropperDrawSettings.strokeColor = 'rgba(255,255,255,1)';
        this.logoCropper.cropperDrawSettings.strokeWidth = 2;

        this.logo = {};
    }

    ngOnInit() {
        this.csrf_token = document.querySelector('meta[name="csrf-token"]').getAttribute('content');
        this.csrf = document.querySelector('meta[name="csrf-param"]').getAttribute('content');
        this.activateRoute.data
            .subscribe((data: { post }) => {
                this.post = data.post;
                this.value = this.post.amount;
            });

        this.eventForm = this.fb.group({
            'name': new FormControl(this.post.name, [Validators.required, Validators.minLength(5)]),
            'date_at': new FormControl(this.post.date_at, Validators.required),
            'logo': new FormControl(''),
            'background': new FormControl(''),
            'location': new FormControl(this.post.location.description, [Validators.required, Validators.minLength(10)]),
            'location_description': new FormControl(this.post.location.name, [Validators.required, Validators.minLength(10)]),
            'amount': new FormControl(this.value, [Validators.required]),
            'contact_info': new FormControl(this.post.contact_info, [Validators.required, Validators.minLength(5)]),
            'description': new FormControl(this.post.description, [Validators.required, Validators.minLength(40)])
        });

    }


    submit(_form) {
        this.editItem(_form);
    }

    private editItem(_form) {
        this.Errors = [];
        let form = new FormData();

        form.append(this.csrf, this.csrf_token);
        form.append('EventForm[name]', _form.value.name);
        form.append('EventForm[amount]', _form.value.amount);
        form.append('EventForm[description]', _form.value.description);
        form.append('EventForm[contact_info]', _form.value.contact_info);
        form.append('EventForm[location]', _form.value.location);
        form.append('EventForm[location_description]', _form.value.location_description);
        form.append('EventForm[date_at]', this.datePipe.transform(_form.value.date_at, 'MM/dd/yyyy hh:mm a'));

        if (this.logo.image) {
            let image = new CanvasToImage(this.logo.image);
            let file = image.dataURItoBlob();
            form.append('EventForm[logo]', file, 'logo.jpeg');
        }
        if (this.background.image) {
            let image = new CanvasToImage(this.background.image);
            let file = image.dataURItoBlob();
            form.append('EventForm[background]', file, 'background.jpeg');
        }

        this.processing(true);
        this.eventService
            .editItem(this.id, form)
            .subscribe(
                data => {
                    if (data.result === true) {
                        this.alertService.alert('Your Event was updated successfully!', true);
                        this.router.navigate(['event/' + this.id]);
                    } else {
                        console.log(data.errors);
                        if (data.errors.error) {
                            this.alertService.alert(data.errors.error, false);
                        } else {
                            const errors = data.errors.EventForm;
                            for (let error in errors) {
                                this.Errors[error] = errors[error];
                            }
                        }
                    }
                    this.processing(false);
                },
                error => {
                    console.log(error);
                    this.alertService.alert(error.toString(), false);
                    this.processing(false);
                }
            );

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
        this.eventForm.reset();
        this.router.navigate(['/events']);
    }

}
