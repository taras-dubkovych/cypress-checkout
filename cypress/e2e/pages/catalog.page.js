const catalogPage = {
  visit() {
    cy.intercept('GET', '**/api/products*').as('catalog');
    cy.visit('/');
    return cy.wait('@catalog').its('response.statusCode').should('equal', 200);
  },

  watchCheckout() {
    cy.intercept('POST', '**/api/quote').as('quote');
    cy.intercept('POST', '**/api/orders').as('checkout');
  },

  waitForQuote() {
    return cy.wait('@quote');
  },

  product(name) {
    return cy.contains('[data-testid^="product-"]', name);
  },

  addProductToCart(name) {
    return this.product(name).find('[data-add]').click();
  },

  openCart() {
    return cy.get('#open-cart').click();
  },

  get cartCount() {
    return cy.get('#cart-count');
  },

  get collection() {
    return cy.get('#collection');
  },

  get toast() {
    return cy.get('#toast');
  },
};

module.exports = catalogPage;
