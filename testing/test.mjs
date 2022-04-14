import * as fac from "../output/index.js"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

async function run() {
    //test client creation
    const client = await fac.createClient(null, null, "https://localhost:6999")
    const privateKey = client.secretKeyHex
    const publicKey = client.publicKeyHex
    console.log("successfully created the client!")

    const mySecret = "The world is mine!"

    //test setting and getting secret
    await client.setSecret("mySecret", mySecret)
    const retrievedSecret = await client.getSecret("mySecret")
    
    if(mySecret == retrievedSecret) {
        console.log("successfully retrieved secret!")
    } else {
        throw new Error("Retrieved secret did not match stored secret")
    }


    //test creating same client with the keys
    const sameClient = await fac.createClient(privateKey, publicKey, "https://localhost:6999")
    console.log("successfully created the same client!")

    //test retrieving the same secret of the same client
    const sameRetrievedSecret = await sameClient.getSecret("mySecret")
    
    if(mySecret == sameRetrievedSecret) {
        console.log("successfully retrieved same secret!")
    } else {
        throw new Error("Same retrieved secret did not match stored secret")
    }

    //test getting secret space
    const secretSpace = await client.getSecretSpace()
    const spaceKeys = Object.keys(secretSpace)

    console.log(spaceKeys)
    if(spaceKeys.includes("mySecret")) {
        console.log("successfully retrieved the secretSpace")
    } else {
        throw new Error("Retrieved secretSpace did not contain mySecret!")
    }

    //test deleting secret
    await client.deleteSecret("mySecret")
    const secretSpaceDeleted = await client.getSecretSpace()
    const spaceKeysDeleted = Object.keys(secretSpaceDeleted)

    console.log(spaceKeysDeleted)
    if(spaceKeysDeleted.includes("mySecret")) {
        throw new Error("mySecret was still available after deleting!")
    } else {
        console.log("successfully deleted mySecret!")
    }


    const missingSecret = await client.getSecret("mySecret") 


    //test sharing secret to other client
    const otherClient = await fac.createClient(privateKey, publicKey, "https://localhost:6999")
    const otherPrivateKey = client.secretKeyHex
    const otherPublicKey = client.publicKeyHex

    console.log("successfully created the other client!")

    // test retrieving the shared secret from other client






}




run()