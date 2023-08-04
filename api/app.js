import express from 'express'
import cors from 'cors'
import bodyParser from 'body-parser'
import routerPayment from './routes/Payment.js'


const app = express()

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: true}))

app.use('/payment', routerPayment )


export default app
