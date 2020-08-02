import { AppPipe } from './app.pipe';

describe('AppPipe', () => {
  it('create an instance', () => {
    const pipe = new AppPipe();
    expect(pipe).toBeTruthy();
  });
});
