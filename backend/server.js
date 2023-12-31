const express = require ('express');
const cors = require ('cors');
const dbConnect = require('./database');
const { PORT } = require('./config/index');
const router = require('./routes/index');
const errorHandler = require('./middlewares/erroeHandler');
const cookieParser = require('cookie-parser')
const corsOptions = {
    credentials:true,
    origin : ['http://localhost:3000']
}

const app = express()

app.use(cookieParser());
app.use(cors(corsOptions));
app.use(express.json());
app.use(router);


dbConnect();

app.use("/storage",express.static('storage'));

app.use(errorHandler);

app.listen(PORT,()=>{
    console.log(`app is running at port ${PORT}`);
})