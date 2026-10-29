const catalog = require('./pages/catalog.page');
const checkout = require('./pages/checkout.page');
const orders = require('./pages/orders.page');

// Тут можна використати Тест Дата Білдер або fixtures (cypress/fixtures) замість inline тестових даних.
const contact = {
  name: 'Олександр Тестовий',
  email: 'test@example.test',
  address: 'Київ, вул Тестова, 12',
};
const productName = 'Бездротові навушники «Орбіта»';
const expressTotals = {subtotal: 240000, discount: 24000, shipping: 15000, total: 231000};

// Можна створити окремий об'єкт для керування потоком оформлення замовлення (checkout flow)\
function prepareCheckout(payment) {
  catalog.collection.scrollIntoView();
  catalog.product(productName).should('be.visible');
  catalog.addProductToCart(productName);
  catalog.toast.should('be.visible').and('have.text', 'Товар додано до кошика');
  catalog.cartCount.should('have.text', '1');
  catalog.openCart();
  checkout.dialog.should('be.visible');
  checkout.lines.should('have.length', 1).and('contain', productName);
  checkout.lines.find('[data-testid^="quantity-"]').should('have.text', '1');
  catalog.waitForQuote();

  checkout.applyCoupon('WELCOME10');
  catalog.waitForQuote().its('response.body')
    .should('include', {subtotal: 240000, discount: 24000, shipping: 0, total: 216000});

  checkout.selectDelivery('express');
  checkout.delivery.should('have.value', 'express');
  catalog.waitForQuote().its('response.body').should('include', expressTotals);
  checkout.fillContacts(contact);
  checkout.selectPayment(payment);
  checkout.payment.should('have.value', payment);
  checkout.assertTotals();
}

describe('Checkout regression', () => {
  // Можна це переробити у кастомну команду, наприклад cy.openShop(), щоб уникнути повторення коду
  beforeEach(() => {
    cy.intercept('POST', '**/api/workspaces').as('workspace');
    cy.intercept('GET', '**/api/orders*').as('orders');
    catalog.watchCheckout();
    catalog.visit();
    cy.wait('@workspace').its('response.statusCode').should('equal', 201);
    catalog.cartCount.should('have.text', '0');
  });

  // Можна додатково використати data-driven підхід для різних сценаріїв оплати.
  it('creates a confirmed order when payment is approved', () => {
    prepareCheckout('approved');
    checkout.submit();

    //Можна додатково створити шар верифікації (наприклад, orderVerification.assertConfirmed(order))
    cy.wait('@checkout').then(({request, response}) => {
      expect(response.statusCode).to.equal(201);
      expect(request.body).to.include({...contact, coupon: 'WELCOME10', delivery: 'express', payment: 'approved'});
      const order = response.body.order ?? response.body;
      expect(order.status).to.equal('confirmed');
      expect(order.totals).to.include(expressTotals);
      expect(order.id).to.be.a('string').and.not.be.empty;
      expect(order.created_at).to.be.a('string').and.not.be.empty;

      const orderDate = new Date(order.created_at).toLocaleDateString('uk-UA');
      orders.cards.should('have.length', 1).first().within(() => {
        cy.get('h3').should('have.text', `Замовлення №${order.id.slice(0, 8)}`);
        cy.get('p').first().should(($summary) => {
          const text = $summary.text().replace(/\s+/g, ' ');
          expect(text).to.include(orderDate);
          expect(text).to.include('2 310,00 грн');
        });
        cy.get('.order-id').should('contain.text', order.id);
      });
    });

    cy.wait('@orders');
    orders.cards.should('contain', 'Підтверджено');
    catalog.cartCount.should('have.text', '0');
  });

  it('preserves the cart when payment is declined', () => {
    prepareCheckout('declined');
    checkout.submit();

    cy.wait('@checkout').its('response.statusCode').should('equal', 402);
    checkout.error.should('be.visible').and('have.text', '402 · Тестовий платіж відхилено');
    checkout.lines.should('have.length', 1).and('contain', productName);
    catalog.cartCount.should('have.text', '1');

    checkout.close();
    orders.open();
    cy.wait('@orders').its('response.body.items').should('deep.equal', []);
    orders.list.should('contain', 'Замовлень не знайдено');
  });
});
