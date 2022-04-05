import * as fac from "../output/index.js"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function run() {
    const client = await fac.createClient(null, null, "https://localhost:6999")
    const privateKey = client.secretKeyHex
    const publicKey = client.publicKeyHex
    console.log("successfully created the client!")

    const mySecret = "The world is mine!"

    await client.setSecret("mySecret", mySecret)
    const retrievedSecret = await client.getSecret("mySecret")
    
    console.log(retrievedSecret)

}




run()