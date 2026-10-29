module.exports = {
  get dialog() { return cy.get('#bag-dialog'); },
  get lines() { return cy.get('#bag-items [data-cart-line]'); },
  get error() { return cy.get('#checkout-error'); },
  get delivery() { return cy.get('#delivery'); },
  get payment() { return cy.get('#payment'); },
  get totals() { return cy.get('#totals > div'); },
  get couponInput() { return cy.get('#coupon'); },
  assertTotals() {
    const expected = [
      ['Товари', '2 400,00 грн'],
      ['Знижка', '−240,00 грн'],
      ['Доставка', '150,00 грн'],
      ['Разом', '2 310,00 грн'],
    ];

    return this.totals.should(($rows) => {
      const actual = Array.from($rows, (row) => (
        Array.from(row.querySelectorAll('span'), (span) => span.textContent.replace(/\s+/g, ' ').trim())
      ));
      expect(actual).to.deep.equal(expected);
    });
  },
  applyCoupon(code) {
    this.couponInput.clear().type(code);
    return cy.get('#apply-coupon').click();
  },
  selectDelivery(value) { return this.delivery.select(value); },
  fillContacts({name, email, address}) {
    cy.get('#customer-name').clear().type(name);
    cy.get('#email').clear().type(email);
    return cy.get('#address').clear().type(address);
  },
  selectPayment(value) { return this.payment.select(value); },
  submit() { return cy.get('[data-testid="place-order"]').should('be.enabled').click(); },
  close() { return cy.get('[data-close="bag-dialog"]').click(); },
};
