require('dotenv').config();

const express = require("express")
const app = express()
const port = 3000

// app.get("/products", (req, res) => {
//     // res.send([
//     //     { productCode: 1, productName: 'Maybeline Foundation', productPrice: 19000 },
//     //     { productCode: 2, productName: '3CE Cushion', productPrice: 150000 },
//     //     { productCode: 3, productName: 'Longlasting cushion', productPrice: 210000 },
//     // ]);
//     Product.find({})
//     .then(data => res.json(data))
//     .catch(err => res.status(500).json({error: err.message}))
// });

//Enable CORS
const cors = require('cors')
app.use(cors());

// Parsing data (from client)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

//Import Routes 
const exampleRoute = require("./routes/example.router")
app.use("/", exampleRoute);

app.listen(port, () => {
    console.log(`My server listening on port: ${port}
        `);
});