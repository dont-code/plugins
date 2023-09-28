import {clickAutoComplete, getSendButton, getSubMenuWithText, selectPopupChoiceWithText} from "../support/app.po";
import {
  getButtonWithName,
  getCheckWithName,
  getColumn,
  getDropdownFilter,
  getDropdownListItemWithName,
  getDropdownWithName,
  getInputWithName,
  getListRowWithText,
  getTableHeader,
  getTabWithName
} from "../support/edit.po";

describe('Edit', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  beforeEach(() => cy.forceDeleteIndexedDbStorage(TEST_DB_NAME));

  const TEST_DB_NAME="Dont-code Plugin Tester";
  it ('should display list', () => {
      cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
      getSubMenuWithText('Dev').click();// Move to dev page

      cy.wait('@LoadTemplate');
      clickAutoComplete("template");
      selectPopupChoiceWithText("Create Complete Entity A"); // Create Entity name
      getSendButton().click();
      getSubMenuWithText( 'A Name').click();

      getTableHeader('id').should('contain.text', "id");
      getTableHeader('check').should('contain.text', "check");
      getTableHeader('count').should('contain.text', "count");

      getButtonWithName ('new').click();
      getInputWithName('id').type('ID1');
      getCheckWithName('check').click();
      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-id"]').should('be.visible');
      getListRowWithText ( "ID1");

      getButtonWithName ('new').click();
      getInputWithName('id').type('ID2');
      getInputWithName('count').type('2');
      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-id"]').should('be.visible');
      getListRowWithText ("ID2");

      getListRowWithText ("ID1").click();
      getInputWithName('id').clear().type('NEWID1');

      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');
      cy.get('th[id="header-id"]').should('be.visible');
      getListRowWithText ( "NEWID1");

      getSubMenuWithText('Dev').click();// Move to dev page
      getSubMenuWithText('A Name').click();// Returns to list page
      getListRowWithText( "NEWID1");

      // Delete ID2
      getListRowWithText ("ID2").click();
      getButtonWithName('delete').click();
      // It should have automatically switched back to the list, however I can't test that ID2 is gone.
      getListRowWithText( "NEWID1");
  });

  it ('should manage currency & money', () => {
      cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
      getSubMenuWithText('Dev').click();// Move to dev page

      cy.wait('@LoadTemplate');
      clickAutoComplete("template");
      selectPopupChoiceWithText("International Bookstore"); // Create Entity name
      getSendButton().click();
      getSubMenuWithText( 'Book').click();

      getButtonWithName ('new').click();
      getInputWithName('Name').type('Book 1');
      getInputWithName('USD').type('1234');
      getInputWithName('EUR').type('4321');
      getInputWithName('Other').type('2121');
      getDropdownWithName('currencyCode').click('right');
      getDropdownFilter().type ('canadi');
      getDropdownListItemWithName('Canadian Dollar - CAD').click();
      getDropdownWithName('ConvertTo').click();
      getDropdownFilter().type ('peso');
      getDropdownListItemWithName('Cuban Peso - CUP').click();
      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Name"]').should('be.visible');
      getListRowWithText ( "Book 1");
      getListRowWithText ( FormatUtils.generateMoney(1234,"USD"));
      getListRowWithText (FormatUtils.generateMoney(2121,"CAD"));
      getListRowWithText ("CUP");

      getButtonWithName ('new').click();
      getInputWithName('Name').type('Book 2');
      getInputWithName('USD').type('5678');
      getInputWithName('EUR').type('8765');
      getInputWithName('Other').clear().type('9090');
      getDropdownWithName('currencyCode').click('right');
      getDropdownFilter().clear().type ('canadi');
      getDropdownListItemWithName('Canadian Dollar - CAD').click();
        // Check the list is updated without saving
      //getButtonWithName ('save').click();

      getTabWithName ('List').click();
      getListRowWithText (FormatUtils.generateMoney(1234, "USD"));
      getListRowWithText (FormatUtils.generateMoney(8765, "EUR"));
      getListRowWithText (FormatUtils.generateMoney(9090, "CAD"));

      getListRowWithText ("Book 2").click();
      getListRowWithText ("Book 2").click();
      getInputWithName('EUR').clear().type('9870');
      getDropdownWithName('currencyCode').click('right');
      getDropdownFilter().type ('dinar');
      getDropdownListItemWithName('Algerian Dinar - DZD').click();

      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Name"]').should('be.visible');
      getListRowWithText (FormatUtils.generateMoney(4321, "EUR"));
      getListRowWithText ( FormatUtils.generateMoney(9090, "DZD"));

      getSubMenuWithText('Dev').click();// Move to dev page
      getSubMenuWithText('Book').click();// Returns to list page
      getListRowWithText ( FormatUtils.generateMoney(9870, "EUR"));
      getListRowWithText ( FormatUtils.generateMoney(9090, "DZD"));
      getListRowWithText ( "CUP");
      getListRowWithText( FormatUtils.generateMoney(4321,"EUR")).click(); // Move to edit
      getInputWithName('EUR').clear(); // Empty the amount
      getButtonWithName ('save').click();
      getButtonWithName ('save').should('be.enabled');

      cy.get('th[id="header-Name"]').should('be.visible');
      getColumn (getListRowWithText(FormatUtils.generateMoney(1234, "USD")), 3).should ("be.empty");


  });
});

export class FormatUtils {
  public static generateMoney (amount:number, currencyCode:string): string {
    let ret= Intl.NumberFormat (navigator.language, {style:'currency', currency:currencyCode}).format(amount);

    // Replace nbsps with space
    ret = ret.replace ("\u00a0", " ");
    ret = ret.replace ("\u202F", " ");
 /*   const chars=[];
    for (let i=0;i<ret.length;i++) {
      chars.push(ret.charCodeAt(i));
    }
    console.log("Checked:",ret, ...chars);*/
    return ret;
  }
}
