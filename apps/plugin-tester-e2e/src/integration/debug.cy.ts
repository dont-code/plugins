import {
  clickAutoComplete,
  getHeaderMenu,
  getPageTitle,
  getSendButton,
  getStep,
  getSubMenu,
  getSubMenus,
  getSubMenuWithText,
  getToolbar,
  getValueTextArea,
  selectPopupChoice,
  selectPopupChoiceWithText,
  selectType
} from "../support/app.po";

describe('Debug', () => {
  beforeEach(() => {
    /*cy.getService(ChangeProviderService).then ((service:ChangeProviderService) => {
      console.log('stubbing');
      cy.stub(service, 'receiveCommands', () => {
        console.log('stubbed');
      });
    });*/
    cy.visit('/');
  });

  it('should enable application name change', () => {
    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
    getToolbar().should('contain.text','Plugin Tester');
    getSubMenu(3).should ('contain.text', 'Dev');
    getSubMenu(3).click();    // Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoice(1); // Change App Name
    getSendButton ().click();
    getToolbar().should('contain.text','New Name');

  });
  it('should add Entity Menu', () => {
    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click();// Move to dev page

    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoiceWithText("Change Entity A Name"); // Create Entity name
    getValueTextArea().clear().type("NewItem");
    getSendButton().click();
    getHeaderMenu(4).should('contain.text', 'Application Menu');
    getSubMenuWithText( 'NewItem').click();
    getPageTitle().should('contain.text',"NewItem");
  });


  it('should manage move and delete', () => {
    cy.intercept('GET','/assets/dev/templates.json').as('LoadTemplate');
    getSubMenuWithText('Dev').click();// Move to dev page

    // Creates A,B,C

    cy.wait('@LoadTemplate');
    clickAutoComplete("template");
    selectPopupChoiceWithText("Change Entity A Name"); // Create Entity name
    getValueTextArea().clear().type("A Name");
    getSendButton().click();

    clickAutoComplete("template");
    selectPopupChoiceWithText("Create Empty Entity"); // Create Entity
    getStep().clear().type("creation/entities/b")
    getValueTextArea ().clear().type ("{{}\"name\":\"B Name\"}");
    getSendButton ().click();

    clickAutoComplete("template");
    selectPopupChoiceWithText("Create Empty Entity"); // Create Entity
    getStep().clear().type("creation/entities/c")
    getValueTextArea ().clear().type ("{{}\"name\":\"C Name\"}");
    getSendButton ().click();

    assertEntityMenu ('A Name','B Name', 'C Name');

      // Move B before A
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    getSendButton ().click();

    assertEntityMenu ('B Name','A Name', 'C Name');

    // Move C before A
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    getStep().clear().type("creation/entities/c")
    getValueTextArea ().clear().type ("a");
    getSendButton ().click();

    assertEntityMenu ('B Name','C Name', 'A Name');

    // Move B at the end
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    getStep().clear().type("creation/entities/b")
    getValueTextArea ().clear();
    getSendButton ().click();

    assertEntityMenu ('C Name', 'A Name','B Name');

    // Delete B
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    selectType("DELETE");
    getValueTextArea ().clear();
    getSendButton ().click();

    assertEntityMenu ('C Name', 'A Name');
    // Delete C
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    getStep().clear().type("creation/entities/c")
    selectType("DELETE");
    getValueTextArea ().clear();
    getSendButton ().click();

    assertEntityMenu ('A Name');

    // Delete A
    clickAutoComplete("template");
    selectPopupChoiceWithText("Move Entity b");
    getStep().clear().type("creation/entities/a")
    selectType("DELETE");
    getValueTextArea ().clear();
    getSendButton ().click();

    getSubMenus().should("have.length", 4);
  });

  function assertEntityMenu(first: string, second?: string, third?: string) {
    getSubMenu(5).should('contain.text', first);
    if (second)
      getSubMenu(6).should('contain.text', second);
    if( third)
      getSubMenu(7).should('contain.text', third);
  }
});
