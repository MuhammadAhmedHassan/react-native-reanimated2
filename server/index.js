import bodyParser from 'body-parser';
import express from 'express';
import Stripe from 'stripe';
import env from 'dotenv';
import fs from 'fs';
env.config({path: './server/.env'});

const stripePublishableKey = process.env.STRIPE_PUBLISHABLE_KEY || '';
const stripeSecretKey = process.env.STRIPE_SECRET_KEY || '';
const customer_id = 'cus_N5nVvcpETht2A4';

const app = express();

app.use((req, res, next) => {
  bodyParser.json()(req, res, next);
});

app.get('/stripe-key', (_, res) => {
  return res.send({publishableKey: stripePublishableKey});
});

app.get('/create-customer', async (req, res) => {
  const customer = await getCustomer();
  res.send(customer);
});

app.post('/create-payment-intent', async (req, res) => {
  const {
    email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`,
    currency,
    request_three_d_secure,
    payment_method_types = [],
  } = req.body;

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  // Create customer on new login
  // const customer = await stripe.customers.create({email});
  const customer = await stripe.customers.retrieve('cus_N5nVvcpETht2A4');

  const paymentMethods = await stripe.paymentMethods.list({
    customer: customer.id,
    type: 'card',
  });

  const params = {
    amount: 5000,
    currency,
    customer: customer.id,
    payment_method_options: {
      card: {
        request_three_d_secure: request_three_d_secure || 'automatic',
      },
    },
    payment_method_types: payment_method_types,
  };

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      ...params,
      payment_method: paymentMethods.data[0].id,
      off_session: 'one_off', // true
      confirm: true,
    });
    return res.send({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    return res.send({
      error: error.raw.message,
    });
  }
});

app.post('/payment-sheet-setup-intent', async (req, res) => {
  const {
    email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`,
    payment_method_types = [],
  } = req.body;

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const setupIntent = await stripe.setupIntents.create({
    ...{customer: customer.id, payment_method_types},
  });

  return res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
  });
});

app.post('/payment-sheet', async (req, res) => {
  const {email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`} =
    req.body;

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
    typescript: true,
  });

  // Create customer on new login
  // const customer = await stripe.customers.create({email});
  // const customer = await stripe.customers.retrieve('cus_N5nVvcpETht2A4');
  const customer = await getCustomer();

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2022-11-15'},
  );

  // const setupIntent = await stripe.setupIntents.create({
  //   customer: customer.id,
  // });

  const paymentIntent = await stripe.paymentIntents.create({
    amount: 5099,
    currency: 'usd',
    payment_method_types: ['card' /*'link'*/],
    customer: customer.id,
  });

  // const oneProperty = await stripe.products.retrieve('prod_N5nGrHxk63UHzM');

  // await stripe.checkout.sessions.create({
  //   mode: 'payment',
  //   payment_method_types: ['card'],
  //   line_items: [{price: oneProperty.default_price, quantity: 1}],
  //   payment_intent_data: {setup_future_usage: 'off_session'},
  //   customer: customer.id,
  //   success_url: 'http://brokerfreerealproperty/success.html',
  //   cancel_url: 'http://brokerfreerealproperty/cancel.html',
  // });

  return res.json({
    // setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer.id,
    paymentIntent: paymentIntent.client_secret,
  });
});

app.post('/payment-sheet-subscription', async (req, res) => {
  const {email = `test${Math.floor(Math.random() * 9999) + 1}@domain.com`} =
    req.body;

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2020-08-27',
    typescript: true,
  });

  const customer = await stripe.customers.create({email});

  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer.id},
    {apiVersion: '2020-08-27'},
  );
  const PRICE_ID = '<YOUR PRICE ID HERE>';
  const subscription = await stripe.subscriptions.create({
    customer: customer.id,
    items: [{price: PRICE_ID}],
    trial_period_days: 3,
  });

  if (typeof subscription.pending_setup_intent === 'string') {
    const setupIntent = await stripe.setupIntents.retrieve(
      subscription.pending_setup_intent,
    );

    return res.json({
      setupIntent: setupIntent.client_secret,
      ephemeralKey: ephemeralKey.secret,
      customer: customer.id,
    });
  } else {
    throw new Error(
      'Expected response type string, but received: ' +
        typeof subscription.pending_setup_intent,
    );
  }
});

app.post('/payment-sheet-try', async (req, res) => {
  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
    typescript: true,
  });

  // Use an existing Customer ID if this is a returning customer.
  // const customer = await stripe.customers.create();
  const ephemeralKey = await stripe.ephemeralKeys.create(
    {customer: customer_id /*customer.id*/},
    {apiVersion: '2020-03-02'},
  );
  const setupIntent = await stripe.setupIntents.create({
    customer: customer_id, // customer.id,
  });
  res.json({
    setupIntent: setupIntent.client_secret,
    ephemeralKey: ephemeralKey.secret,
    customer: customer_id, // customer.id,
    publishableKey: stripePublishableKey,
  });
});

app.listen(5000, () => console.log(`Node server listening on port ${5000}!`));

async function getCustomer() {
  const filePath = './server/customer.json';
  const data = await fs.promises.readFile(filePath, 'utf-8');

  if (data.trim().length > 0) {
    const customer = JSON.parse(data);
    console.log(customer);
    return customer;
  }

  const stripe = new Stripe(stripeSecretKey, {
    apiVersion: '2022-11-15',
    typescript: true,
  });

  const customer = await stripe.customers.create({
    email: 'bingo007@yopmail.com',
    name: 'Bingo',
  });

  await fs.promises.writeFile(filePath, JSON.stringify(customer));
  return customer;
}
