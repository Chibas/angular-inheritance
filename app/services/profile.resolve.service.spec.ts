import { TestBed, inject } from '@angular/core/testing';

import { ProfileResolve } from './profile.resolve.service';

describe('ProfileResolve', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProfileResolve]
    });
  });

  it('should be created', inject([ProfileResolve], (service: ProfileResolve) => {
    expect(service).toBeTruthy();
  }));
});
