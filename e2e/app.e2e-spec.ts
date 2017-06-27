import { APPWORKSPage } from './app.po';

describe('appworks App', () => {
  let page: APPWORKSPage;

  beforeEach(() => {
    page = new APPWORKSPage();
  });

  it('should display welcome message', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('Welcome to app!!');
  });
});
