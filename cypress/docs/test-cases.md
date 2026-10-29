Test case 00001
Priorty: Critical
Type: Regression

Title: Verify that user is able to create a new order

Preconditions:
Test site is reachable and can be opened: https://test-me.vzl.one/

Steps to reproduce:
1. Open https://test-me.vzl.one/ > verify that how page is opened
2. Scroll down to Наша колекція section
3. Click До кошика for product Бездротові навушники «Орбіта» > Verify the toast text is Товар додано до кошика and the cart counter is 1
4. Scroll to the top of the page
5. Click on cart button > Verify Cart is opened and the product quantity is 1
6. Fill in promo code WELCOME10 in Промокод field and click Застосувати > Verify code is applied and discount is 240 грн
7. Select Спосіб доставки as: Експрес 150 in Спосіб доставки field > Verify it is selected
8. Fill in Contact details:Ім'я та прізвище: Олександр Тестовий,Електронна пошта: test@example.test, Адреса доставки: Київ, вул Тестова, 12 
9. Select Успішна оплата value in Результат тестової оплати > Verify it is selected
10. Verify subtotal is 2 400 грн, discount is 240 грн, express delivery is 150 грн, and total is 2 310 грн
11. Click Оформити замовлення > Verify the displayed order number matches the created order, its amount is 2 310 грн, its date matches the created order, and status is Підтверджено
//-------------------------------------------------------------------------------------------------------------------------------------

Test case 00002
Priorty: Critical
Type: Regression

Title: Verify that order is declined if some issue with payment method is happened

Preconditions:
Test site is reachable and can be opened: https://test-me.vzl.one/

Steps to reproduce:
1. Open https://test-me.vzl.one/ > verify that how page is opened
2. Scroll down to Наша колекція section
3. Click До кошика for product Бездротові навушники «Орбіта» > Verify the toast text is Товар додано до кошика and the cart counter is 1
4. Scroll to the top of the page
5. Click on cart button > Verify Cart is opened and the product quantity is 1
6. Fill in promo code WELCOME10 in Промокод field and click Застосувати > Verify code is applied and discount is 240 грн
7. Select Спосіб доставки as: Експрес 150 in Спосіб доставки field > Verify it is selected
8. Fill in Contact details:Ім'я та прізвище: Олександр Тестовий,Електронна пошта: test@example.test, Адреса доставки: Київ, вул Тестова, 12 
9. Select Відхилена оплата value in Результат тестової оплати > Verify it is selected
10. Verify subtotal is 2 400 грн, discount is 240 грн, express delivery is 150 грн, and total is 2 310 грн
11. Click Оформити замовлення > Verify that order is declined and error messabe appeared: 402 · Тестовий платіж відхилено