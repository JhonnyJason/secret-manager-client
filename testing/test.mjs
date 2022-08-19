import * as fac from "../output/index.js"

process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//==========================================================================
const log = console.log
function olog(arg) { log(JSON.stringify(arg, null, 4)) } 

//==========================================================================
async function run() {

    //test client creation
    const { cA, cB, cC } = await create3Clients()
    log("> Success: created the clients!\n")
    await createClientInvalid()
    log("> Success: creating invalid Clients failed correctly!\n")

    process.exit()


    const mySecret = "The world is mine!"
    //test setting and getting secret
    await setSecretFor(cA, "mySecret", mySecret)
    await setSecretFor(cB, "mySecret", mySecret)
    await setSecretFor(cC, "mySecret", mySecret)

    const secretA = await getSecretFrom(cA, "mySecret")
    const secretB = await getSecretFrom(cB, "mySecret")
    const secretC = await getSecretFrom(cC, "mySecret")

    if(secretA == mySecret && secretB == mySecret && secretC == mySecret) {
        log("Success: set and retrieved the secrets.")
    }else {
        log("Error: Retrieved secret did not match stored secret")
        die()
    }

    //test creating same client with the keys
    const secretKey = cA.secretKeyHex
    const publicKey = cA.publicKeyHex
    const sameClient = await fac.createClient(secretKey, publicKey, "https://localhost:6999")
    log("Success: created the same client!")

    //test retrieving the same secret of the same client
    const sameRetrievedSecret = await getSecretFrom(sameClient, "mySecret")
    
    if(mySecret == sameRetrievedSecret) {
        log("Success: retrieved same secret!")
    } else {
        log("Error: Same retrieved secret did not match stored secret")
        die()
    }


    //test getting secret space
    const secretSpace = await getSecretSpaceFrom(cA)
    const spaceKeys = Object.keys(secretSpace)

    log(spaceKeys)
    if(spaceKeys.includes("mySecret")) {
        log("Success: retrieved the secretSpace")
    } else {
        log("Error: Retrieved secretSpace did not contain mySecret!")
        die()
    }

    //test deleting secret
    await deleteSecretFor(cA,"mySecret")
    const secretSpaceDeleted = await getSecretSpaceFrom(cA)
    const spaceKeysDeleted = Object.keys(secretSpaceDeleted)

    log(spaceKeysDeleted)
    if(spaceKeysDeleted.includes("mySecret")) {
        log("Error: mySecret was still available after deleting!")
        die()
    } else {
        log("Success: deleted mySecret!")
    }
    const missingSecret = await getSecretSpaceFrom(cA, "mySecret") 


    //test removing nodeId for client
    await eraseClient(cC)



    //test sharing secret to other client
    // const otherClient = await fac.createClient(privateKey, publicKey, "https://localhost:6999")
    // const otherPrivateKey = client.secretKeyHex
    // const otherPublicKey = client.publicKeyHex

    // log("successfully created the other client!")

    // test retrieving the shared secret from other client






}

//==========================================================================
function die() {
    log("Critical Error -> controlled death commencing!")
    process.exit()
}

//==========================================================================
async function setSecretFor(client, secretId, secret) {
    log("-> setSecretFor§")
    try {
        await client.setSecret(secretId, secret)
    } catch(error) {
        log(error.message)
        die()
    }
}

//==========================================================================
async function deleteSecretFor(client, secretId, secret) {
    log("-> deleteSecretFor§")
    try {
        await client.deleteSecret(secretId, secret)
    } catch(error) {
        log(error.message)
    }
}

//==========================================================================
async function getSecretFrom(client, secretId) {
    log("-> getSecretFrom§")
    try {
        return await client.getSecret(secretId)
    } catch(error) {
        log(error.message)
        die()
    }
}

//==========================================================================
async function getSecretSpaceFrom(client) {
    log("-> getSecretSpaceFrom§")
    try {
        return await client.getSecretSpace()
    } catch(error) {
        log(error.message)
        return {}
    }
}

//==========================================================================
async function create3Clients() {
    log("-> create3Clients§")
    try {
        var cA = await fac.createClient(null, null, "https://localhost:6999")
        var cB = await fac.createClient(null, null, "https://localhost:6999")
        var cC = await fac.createClient(null, null, "https://localhost:6999")
        return {cA, cB, cC}
    } catch(error) {
        log(error.message)
        die()
    }
}

async function createClientInvalid() {
    log("-> createClientInvalid§")
    const valid = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    const validB = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    const invalidA = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbee"
    const invalidB = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeez"
    
    try { //the publicKey invalidA
        await fac.createClient(valid, invalidA, "https://localhost:6999")
        log("> Error: create client with publicKey invalidA did not throw an Exception!")
        die()
    } catch(error) {
        log('  - "' + error.message + '"')
        if(error.message ==  "Invalid key length!") {
            log("  Success: the publicKey invalidA threw correct error!")
        } else {
            log("> Error: the publicKey invalidA throw wrong error!")
            die()
        }
    }

    try { //the publicKey invalidB
        await fac.createClient(valid, invalidB, "https://localhost:6999")
        log("> Error: create client with publicKey invalidB did not throw an Exception!")
        die()
    } catch(error) {
        log('  - "' + error.message + '"')
        if(error.message ==  "Non-hex character in key!") {
            log("  Success: the publicKey invalidB threw correct error!")
        } else {
            log("> Error: the publicKey invalidB threw wrong error!")
            die()
        }
    }

    try { //the publicKey is nonfit
        await fac.createClient(valid, validB, "https://localhost:6999")
        log("> Error: create client with nonfit publicKey did not throw an Exception!")
        die()
    } catch(error) {
        log('  - "' + error.message + '"')
        if(error.message ==  "PublicKey does not fit secretKey!") {
            log("  Success: the nonfit publicKey threw correct error!")
        } else {
            log("> Error: the nonfit publicKey threw wrong error!")
            die()
        }
    }
    

}

//==========================================================================
async function eraseClient(client) {
    log("-> eraseClient§")
    try {
        await client.eraseFromServer()
    } catch(error) {
        log(error.message)
    }
}



//==========================================================================
run()
