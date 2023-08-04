import dotenv from 'dotenv';
import express from 'express'
import midtransClient from 'midtrans-client'
dotenv.config();

const router = express.Router()

router.post("/process-trx", async (req, res) => {
    try {
      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: process.env.SERVER_KEY,
        clientKey: process.env.CLIENT_KEY
      });
  
      const parameter = {
        transaction_details: {
          order_id: req.body.order_id,
          gross_amount: req.body.total
        },
        customer_details: {
          first_name: req.body.name
        }
      };
  
      // Create a transaction using Snap API
      const transaction = await snap.createTransaction(parameter);
  
      const dataPayment = {
        response: JSON.stringify(transaction)
      };
      const token = transaction.token;
      
      res.status(200).json({ message: 'Transaction processed successfully', dataPayment, token });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  });
  



export default router


