module.exports = {
  open() { return cy.get('[data-nav="orders"]').click(); },
  get cards() { return cy.get('#orders-list [data-testid="order-card"]'); },
  get list() { return cy.get('#orders-list'); },
};
