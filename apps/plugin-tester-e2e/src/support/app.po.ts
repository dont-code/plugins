export const getToolbar = () => cy.get('.p-toolbar');
export const getMainMenu = () => cy.get('#mainMenu');
export const getHeaderMenu = (pos:number) => cy.get("#mainMenu > .grid > .col > .ng-trigger > .p-menu-list > :nth-child("+pos+")");
export const getSubMenu = (pos:number) => cy.get("#mainMenu > .grid > .col > .ng-trigger > .p-menu-list > :nth-child("+pos+") > .p-menuitem-link");
export const getSubMenuWithText = (text:string) => cy.get("#mainMenu > .grid > .col > .ng-trigger > .p-menu-list").contains(text);
export const getSubMenus = () => cy.get("#mainMenu > .grid > .col > .ng-trigger > .p-menu-list > *");
export const getPageTitle = () => cy.get('h1');

export const clickAutoComplete = (name:string) => cy.get("#"+name+" > .p-autocomplete > .p-autocomplete-dropdown").click();
export const selectPopupChoice = (pos:number) => cy.get(".p-autocomplete-items > :nth-child("+pos+")").click();
export const selectPopupChoiceWithText = (text:string) => cy.get(".p-autocomplete-items").contains(text).click();
export const getSendButton = () => cy.get("#sendButton");
export const getValueTextArea = () => cy.get("#value");
export const getStep = () => cy.get("#step > .p-autocomplete > .p-autocomplete-input");
export const selectType = (type:string) => {
  cy.get("#type").click();
  cy.get("[ng-reflect-label="+type+"] > .p-dropdown-item").click();
  }

