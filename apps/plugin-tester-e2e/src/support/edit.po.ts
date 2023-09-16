export const getTableHeader = (name:string) => cy.get('th[id="header-'+name+'"]');
export const getButtonWithName = (name:string) => cy.get('button[name="'+name+'"]');
export const getInputWithName = (name:string) => cy.get('input[ng-reflect-name="'+name+'"], input[name="'+name+'"]');
export const getCheckWithName = (name:string) => cy.get('p-checkbox[ng-reflect-name="'+name+'"]');

export const getTabWithName = (name:string) => cy.get('a[role="tab"] > span').contains(name);
export const getListRow = (row:number) => cy.get('table > tbody > :nth-child('+row+')');
export const getListRowWithText = (text:string) => cy.get('table > tbody > tr').contains('tr', text);
export const getColumn = (row:Cypress.Chainable, num:number) => row.find(':nth-child('+num+')');

export const getDropdownWithName = (name:string) => cy.get('p-dropdown[ng-reflect-name="'+name+'"], p-dropdown[name="'+name+'"]');
export const getDropdownFilter = () => cy.get('input[class*="p-dropdown-filter"]');
export const getDropdownListItemWithName = (content: string) => cy.get('.p-dropdown-item').contains(content);
export const getImageWithClass = (clazz:string) => cy.get('img[class*="'+clazz+'"]');
export const getLinkWithUrl = (url:string) => cy.get ('a[href="'+url+'"]')

export const getRatingWithName = (name:string, rate:number) => cy.get('p-rating[ng-reflect-name="'+name+'"] > .p-rating >:nth-child('+rate+'), p-rating[name="'+name+'"] > .p-rating > :nth-child('+rate+')');
export const getRating = (rate:number) => cy.get('.p-rating > :nth-child('+rate+') > .p-rating-icon, .p-rating > :nth-child('+rate+')');
export const getDatePicker = (dayOfMonth:string) => cy.get('table[class*="p-datepicker-calendar"] > tbody > tr').contains('td', dayOfMonth);
