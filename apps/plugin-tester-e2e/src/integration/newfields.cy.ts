import {clickAutoComplete, getSendButton, getSubMenuWithText, selectPopupChoiceWithText} from "../support/app.po";
import {
  getButtonWithName,
  getCheckWithName,
  getDatePicker,
  getImageWithClass,
  getInputWithName,
  getLinkWithUrl,
  getListRowWithText,
  getRating,
  getRatingWithName
} from "../support/edit.po";

const TEST_DB_NAME="Dont-code Plugin Tester";
describe('New fields', () => {
  beforeEach(() => cy.visit('/'));
  beforeEach(() => cy.forceDeleteIndexedDbStorage(TEST_DB_NAME));

  it('should display images and url',  () => {
    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
    // First load the Task Manager app
    getSubMenuWithText('Dev').click();// Move to dev page
    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoiceWithText("Recipe Collection");
    getSendButton().click();
    getSubMenuWithText( 'Recipe').click();

    getButtonWithName ('new').click();
    getInputWithName('Name').type('Test Recipe');
    getInputWithName('Image').type ('https://www.dont-code.net/assets/images/favicons/logo.png');
    getInputWithName('Link').type ('https://test.dont-code.net');
    getRatingWithName ('Stars', 4).click();
    getButtonWithName ('save').click();
    getButtonWithName ('save').should('be.enabled');

    cy.get('th[id="header-Name"]').should('be.visible');
//    getTabWithName ('List').click();
    getListRowWithText ( "Test Recipe");
    getImageWithClass ('inline-image').should ('have.attr', 'src', 'https://www.dont-code.net/assets/images/favicons/logo.png');
    getLinkWithUrl ('https://test.dont-code.net');
    getRating ( 3).should('have.class', 'pi-star-fill');
    getRating ( 4).should('have.class', 'pi-star');


  });

  it('should support date and time', () => {

    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
      // First load the Task Manager app
    getSubMenuWithText('Dev').click();// Move to dev page
    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoiceWithText("Task Manager Application"); // Create Entity name
    getSendButton().click();
    getSubMenuWithText( 'Test Task').click();

    getButtonWithName ('new').click();
    getInputWithName('Name').type('First Task');
    getInputWithName('Due Date').type('05/05/2004{enter}');
    getCheckWithName('Done').click();
    getButtonWithName ('save').click();
    getButtonWithName ('save').should('be.enabled');

    cy.get('th[id="header-Name"]').should('be.visible');
    //getTabWithName ('List').click();
    getButtonWithName ('new').click();
    getInputWithName('Name').type('Second Task');
    getInputWithName('Due Date').click();
    getDatePicker ("16").click();
    getButtonWithName ('save').click();
    getButtonWithName ('save').should('be.enabled');

    cy.get('th[id="header-Name"]').should('be.visible');
//    getTabWithName ('List').click();
    getListRowWithText(DateUtils.generateShortDate(new Date (2004, 4, 5)));

  });



});

export class DateUtils {
  static formatter = Intl.DateTimeFormat(navigator.language, { day:'2-digit', month:'2-digit', year:'numeric'});

  public static generateShortDate (dateToTest:Date): string {
    return DateUtils.formatter.format(dateToTest);
  }
}
