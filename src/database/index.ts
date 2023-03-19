import mongoose, { Connection } from "mongoose";

export default function newDatabase(user: string, pass: string, host: string, database: string): Promise<Connection> {
    return new Promise((resolve) => {

        const uri = `mongodb+srv://${user}:${pass}@${host}/${database}?retryWrites=true&w=majority`
        const connection = mongoose.createConnection(uri)

        connection.on("connected", () => {
            console.log('SERVIDOR MONGODB CONNECTADO')
            resolve(connection)
        })

        connection.on("closed", () => {
            console.log('SERVIDOR MONGODB FECHADO')
        })

        connection.on("error", (err) => {
            console.log('SERVIDOR MONGODB TEVE ERRO', err)
        })
    })
}