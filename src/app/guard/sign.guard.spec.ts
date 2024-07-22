import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signGuard } from './sign.guard';

describe('signGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
