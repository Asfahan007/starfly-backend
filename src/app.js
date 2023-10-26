const express = require('express');
const mongoose = require("mongoose");
const { v4: uuidv4 } = require('uuid');
const app = express();
const dotenv = require('dotenv')
dotenv.config()
mongoose.set("strictQuery", false);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


const Customer = require('./models/customerModel')

const auth = require('./auth')
app.use('/auth', auth);

const uploadRouter = require('./upload');
app.use(uploadRouter)

const addPost = require('./post');
app.use(addPost)

const PORT = process.env.PORT || 3001;

//mongoose schema
// const customer = new Customer({
//     name: 'Asfahan',
//     industry: 'Trisys'
// })

// app.get('/', (req, res) => {
//     res.send("Welcome");
// });

// app.get('/api/customer', async (req, res) => {
//     const result = await Customer.find()
//     res.json(result);
// });

// app.post('/api/customer', async (req, res) => {
//     try {
//         const customer = new Customer(req.body)
//         await customer.save();
//         res.status(201).json(customer)
//     }
//     catch (e) {
//         res.status(400).json(e.message)
//     }
// });

// app.get('/api/customer/:id', async (req, res) => {
//     //    res.json(req.query) get the 
//     try {
//         const { id: customerId } = req.params
//         const customer = await Customer.findById(customerId)
//         console.log(customer)
//         if (customer) {
//             res.status(200).json(customer)
//         } else {
//             res.status(404).json({ error: 'Not found' })
//         }
//     } catch (e) {
//         res.status(404).json({ error: "user not found" })
//     }
// });

// // app.put('/api/customer/:id', async (req, res) => {

// // });

// app.post('/api', (req, res) => {
//     const uid = uuidv4();
//     const responseObj = {
//         ...req.body,
//         id: uid,
//     };
//     res.send(responseObj);
// });

// app.post('/', (req, res) => {
//     res.send("Hello from post req");
// });

// app.js

const start = async () => {
    try {
        await mongoose.connect(process.env.URL);
        app.listen(PORT, () => {
            console.log("app listen on port", PORT);
        });
    } catch (e) {
        console.log("error in connection", e);
    }
};

start();
