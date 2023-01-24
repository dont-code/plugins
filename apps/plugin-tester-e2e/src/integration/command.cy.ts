import { getToolbar } from "../support/app.po";
import { MainComponent } from '@dontcode/sandbox';

describe('commands', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display updated name', () => {
    getToolbar().should('contain.text','Plugin Tester');
    cy.findNgComponent('dontcode-sandbox-main').then((comp: MainComponent) => {
      comp.appName = 'Testing Name';
      cy.applyChanges(comp);
      getToolbar().should('contain.text','Testing Name');
    });
  });
});
