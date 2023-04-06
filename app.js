import express from "express"
import dotenv from 'dotenv'
import { connectCockroach, disconnectCockroach } from './db/cockroachConn.js';

dotenv.config({path: "./config/config.env"})

const app = express()
const port = process.env.PORT

let server;

const start = async () => {
    await connectCockroach((err) =>{
        if (!err){
            server = app.listen(port, () =>{
                console.log(`App running on ${port}`)
            })
        } else {
            console.error(err)
        }
    })
}

const stop = () =>{
    console.log("closing server")
    server.close(() =>{
        disconnectCockroach()
        console.log("server closed")
        process.exit(0)
    })
}

start()

process.on("SIGINT", stop)

process.on("SIGTERM", stop)

// import pg from "pg"
// const { Client } = pg

// const client = new Client(process.env.DATABASE_URL);

// (async () => {
//   await client.connect();
//   try {
//     const results = await client.query("SELECT NOW()");
//     console.log(results);
//   } catch (err) {
//     console.error("error executing query:", err);
//   } finally {
//     client.end();
//   }
// })();