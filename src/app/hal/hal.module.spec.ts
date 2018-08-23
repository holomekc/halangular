import { HalModule } from './hal.module';

describe('HalModule', () => {
  let halModule: HalModule;

  beforeEach(() => {
    halModule = new HalModule();
  });

  it('should create an instance', () => {
    expect(halModule).toBeTruthy();
  });
});
