import { TestBed } from '@angular/core/testing';

import { PendingChangesGuardService } from './pending-changes-guard.service';

describe('PendingChangesGuardService', () => {
  let service: PendingChangesGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PendingChangesGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
