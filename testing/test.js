const leModule = require("../output/index.js")

async function run() {
    const client = await leModule.createClient(null, null, "https://secrets.extensivlyon.coffee")
    const privateKey = client.secretKeyHex
    const publicKey = client.publicKeyHex
    console.log("successfully created the client!")

    const mySecret = "The world is mine!"

    await client.setSecret("mySecret", mySecret)
    const retrievedSecret = await client.getSecret("mySecret")
    
    console.log(retrievedSecret)

}




run()