const stripe = require('stripe')("sk_test_51NJwzHCdB1SDHMEBWu6PgNGwbhIgfraJts571PpZEVMLYSTR6pJOBEmsA4MxRmTAvMEjXyIeotTAiDsfUdzgeHEc00vUxjPSlI");
const express = require('express');
const router = express.Router();

router.post('/', async (req, res) => {
  const {totalAmount} = req.body;
    // console.log("ressss", req.body)
  try {
    // Sample item data (replace with your actual data)
    const transformedItem = {
        price_data: {
          currency: 'usd',
          product_data: {
            images: ["https://i.imgur.com/tPJJzSO.png"],
            name: "pics",
          },
          unit_amount: Number(totalAmount)* 100,
        },
        // description: item.description,
        quantity: 1,
      };

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [transformedItem],
      mode: 'payment',
      success_url: 'http://localhost:3000/Cart',
      cancel_url: 'http://localhost:3000/Cart',
    });

    res.json({ id: session.id });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
