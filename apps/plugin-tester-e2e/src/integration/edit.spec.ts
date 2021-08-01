import {clickAutoComplete, getSendButton, getSubMenuWithText, selectPopupChoiceWithText} from "../support/app.po";
import {
  getButtonWithName,
  getCheckWithName, getDropdownFilter, getDropdownListItemWithName, getDropdownWithName,
  getInputWithName, getListRow, getListRowWithText,
  getTableHeader,
  getTabWithName
} from "../support/edit.po";

describe('Edit', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it ('should display list', () => {
    cy.clearPreviewUIDbCollection('A Name').then (() => {
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

      getTabWithName ('List').click();
      getListRowWithText ( "ID1");

      getButtonWithName ('new').click();
      getInputWithName('id').type('ID2');
      getInputWithName('count').type('2');
      getButtonWithName ('save').click();

      getTabWithName ('List').click();
      getListRowWithText ("ID2");

      getListRowWithText ("ID1").click();
      getInputWithName('id').clear().type('NEWID1');

      getButtonWithName ('save').click();
      getListRowWithText ( "NEWID1");

      getSubMenuWithText('Dev').click();// Move to dev page
      getSubMenuWithText('A Name').click();// Returns to list page
      getListRowWithText( "NEWID1");

      // Delete ID2
      getListRowWithText ("ID2").click();
      getButtonWithName('delete').click();
      // It should have automatically switched back to the list, however I can't test that ID2 is gone.
      getListRowWithText( "NEWID1");
    },(reason) => {
      console.log ("Erreur", reason);
    });
  });

  it ('should manage currency & money', () => {
    cy.clearPreviewUIDbCollection('Book').then (() => {
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
      getDropdownWithName('currencyCode').click();
      getDropdownFilter().type ('canadi');
      getDropdownListItemWithName('Canadian Dollar - CAD').click();
      getDropdownWithName('ConvertTo').click();
      getDropdownFilter().type ('peso');
      getDropdownListItemWithName('Cuban Peso - CUP').click();
      getButtonWithName ('save').click();

      getTabWithName ('List').click();
      getListRowWithText ( "Book 1");
      getListRowWithText ( "$1,234");
      getListRowWithText ("CA$2,121");
      getListRowWithText ("CUP");

      getButtonWithName ('new').click();
      getInputWithName('Name').type('Book 2');
      getInputWithName('USD').type('5678');
      getInputWithName('EUR').type('8765');
      getInputWithName('Other').type('9090');
      getDropdownWithName('currencyCode').click();
      getDropdownFilter().type ('canadi');
      getDropdownListItemWithName('Canadian Dollar - CAD').click();
      //getButtonWithName ('save').click();

      getTabWithName ('List').click();
      getListRowWithText ("$1,234");
      getListRowWithText ("€8,765");
      getListRowWithText ("CA$9,090");

      getListRowWithText ("Book 2").click();
      //getListRowWithText ("Book 2").click();
      getInputWithName('EUR').clear().type('9870');
      getDropdownWithName('currencyCode').click();
      getDropdownFilter().type ('dinar');
      getDropdownListItemWithName('Algerian Dinar - DZD').click();

      getButtonWithName ('save').click();
      getListRowWithText ("€4,321");
      getListRowWithText ( "DZD9,090");

      getSubMenuWithText('Dev').click();// Move to dev page
      getSubMenuWithText('Book').click();// Returns to list page
      getListRowWithText( "€4,321");
      getListRowWithText ( "€9,870");
      getListRowWithText ( "DZD9,090");
      getListRowWithText ( "CUP");

    },(reason) => {
      console.log ("Erreur", reason);
    });
  });
});
