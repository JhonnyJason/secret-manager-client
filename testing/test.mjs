import * as fac from "../output/index.js"

// process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = 0;

//==========================================================================

const serverURL = "https://secrets-dev.dotv.ee"
const log = console.log
function olog(arg) { log(JSON.stringify(arg, null, 4)) } 

//==========================================================================
async function run() {

    await testAuthCodes()
    // await testClosureSimple()
    // await testClosureDateMany()
    // await testClosureDateSubSpace()
    // await testGetNodeId()

    // await testNotificationHooks1()
    // await testNotificationHooks1Fail()
    // await testNotificationHooksAll()
    // await testNotificationHooksSubSpace()
    
    // await testSecretSharing()
    // await testSharingThenDenying()

    process.exit()

    // testing all simple usecases
    // var client = null;
    // //test client creation
    // client = await create1ReadyClient()
    // await tryPrintingSecretSpaceFor(client)
    // // process.exit()

    // var secretId = "super-secret"
    // await setSecretFor(client, secretId, "I actually don't know it myself.")
    // await tryPrintingSecretSpaceFor(client)
    // await printSecretFor(client, secretId)
    // // process.exit()

    // await deleteSecretFor(client, secretId)
    // await tryPrintingSecretSpaceFor(client)
    // await printSecretFor(client, secretId)

    // await client.eraseFromServer()
    // await tryPrintingSecretSpaceFor(client)
    // process.exit()    

    // await createClientInvalid()
    // log("> Success: creating invalid Clients failed correctly!\n")
    // process.exit()


    const { cA, cB, cC } = await create3Clients()
    log("> Success: created the 3 clients!\n")

    var mySecret = "The world is mine!"
    //test setting and getting secret
    // await setSecretFor(cA, "mySecret", mySecret)
    await cA.acceptSecretsFrom(cB.id)
    await tryPrintingSecretSpaceFor(cA)
    // process.exit()

    await cA.stopAcceptingSecretsFrom(cB.id)
    await tryPrintingSecretSpaceFor(cA)
    process.exit()

    // await cA.acceptSecretsFrom(cC.id)
    // await cC.shareSecretTo(cA.id, "mySecret", mySecret)
    // await tryPrintingSecretSpaceFor(cA)

    // var retrievedSecret = await cA.getSecretFrom(cC.id, "mySecret")
    // console.log(retrievedSecret)
    // await cC.deleteSharedSecret(cA.id, "mySecret")
    // await tryPrintingSecretSpaceFor(cA)

    // retrievedSecret = await cA.getSecretFrom(cC.id, "mySecret")
    // console.log(retrievedSecret)
    
    // process.exit()
    

    // await setSecretFor(cB, "mySecret", mySecret)
    // await setSecretFor(cC, "mySecret", mySecret)

    // const secretA = await getSecretFrom(cA, "mySecret")
    // const secretB = await getSecretFrom(cB, "mySecret")
    // const secretC = await getSecretFrom(cC, "mySecret")


    // const mySecret = "The world is mine!"
    // //test setting and getting secret
    // await setSecretFor(cA, "mySecret", mySecret)
    // await setSecretFor(cB, "mySecret", mySecret)
    // await setSecretFor(cC, "mySecret", mySecret)

    // const secretA = await getSecretFrom(cA, "mySecret")
    // const secretB = await getSecretFrom(cB, "mySecret")
    // const secretC = await getSecretFrom(cC, "mySecret")

    // if(secretA == mySecret && secretB == mySecret && secretC == mySecret) {
    //     log("Success: set and retrieved the secrets.")
    // } else {
    //     log("Error: Retrieved secret did not match stored secret")
    //     die()
    // }

    // //test creating same client with the keys
    // const secretKey = cA.secretKeyHex
    // const publicKey = cA.publicKeyHex
    // const sameClient = await fac.createClient(secretKey, publicKey, "https://localhost:6999")
    // log("Success: created the same client!")

    // //test retrieving the same secret of the same client
    // const sameRetrievedSecret = await getSecretFrom(sameClient, "mySecret")
    
    // if(mySecret == sameRetrievedSecret) {
    //     log("Success: retrieved same secret!")
    // } else {
    //     log("Error: Same retrieved secret did not match stored secret")
    //     die()
    // }

    // //test getting secret space
    // const secretSpace = await getSecretSpaceFrom(cA)
    // const spaceKeys = Object.keys(secretSpace)

    // log(spaceKeys)
    // if(spaceKeys.includes("mySecret")) {
    //     log("Success: retrieved the secretSpace")
    // } else {
    //     log("Error: Retrieved secretSpace did not contain mySecret!")
    //     die()
    // }

    // //test deleting secret
    // await deleteSecretFor(cA,"mySecret")
    // const secretSpaceDeleted = await getSecretSpaceFrom(cA)
    // const spaceKeysDeleted = Object.keys(secretSpaceDeleted)

    // log(spaceKeysDeleted)
    // if(spaceKeysDeleted.includes("mySecret")) {
    //     log("Error: mySecret was still available after deleting!")
    //     die()
    // } else {
    //     log("Success: deleted mySecret!")
    // }
    // const missingSecret = await getSecretSpaceFrom(cA, "mySecret") 


    // //test removing nodeId for client
    // await eraseClient(cC)



    //test sharing secret to other client
    // const otherClient = await fac.createClient(privateKey, publicKey, "https://localhost:6999")
    // const otherPrivateKey = client.secretKeyHex
    // const otherPublicKey = client.publicKeyHex

    // log("successfully created the other client!")

    // test retrieving the shared secret from other client

}

//==========================================================================
//#region testcase
async function testAuthCodes() {
    var client = null;
    var publicAuthCode = "deadbeefcafebabedeadbeefcafebabedeadbeefcafebabedeadbeefcafebabe"
    var serverId = null
    var authCode = null
    var closureDate = Date.now() + (1000 * 30)


    client = await create1ReadyClient(closureDate)

    serverId = await client.getServerId(publicAuthCode)

    log("returned Server Id: " + serverId)

    await client.acceptSecretsFrom(serverId)
    await client.generateAuthCodeFor("openSecretSpace")
    authCode = await client.getSecretFrom(serverId, "openSecretSpaceAuthCode")    
    olog({authCode})

    client = await create1ReadyClient(closureDate, authCode)
    await tryPrintingSecretSpaceFor(client)

}

async function testClosureDateSimple() {
    var client = null;
    var closureDateNow = Date.now()
    var closureDatePlus15S = closureDateNow + (1000 * 15)

    client = await tryCreating1ReadyClientWithClosureDate(closureDateNow)
    // await tryPrintingSecretSpaceFor(client)
    
    client = await tryCreating1ReadyClientWithClosureDate(closureDatePlus15S)
    await tryPrintingSecretSpaceFor(client)

    await waitMS(17000)
    await tryPrintingSecretSpaceFor(client)

}

async function testClosureDateMany() {
    var client0 = null;
    var client1 = null;
    var client2 = null;
    var client3 = null;
    var closureDateNow = Date.now()
    var closureDatePlus15S = closureDateNow + (1000 * 15)
    var closureDatePlus25S = closureDateNow + (1000 * 25)
    var closureDatePlus222S = closureDateNow + (1000 * 222)

    client0 = await tryCreating1ReadyClientWithClosureDate(closureDateNow)    
    client1 = await tryCreating1ReadyClientWithClosureDate(closureDatePlus15S)
    client2 = await tryCreating1ReadyClientWithClosureDate(closureDatePlus25S)
    client3 = await tryCreating1ReadyClientWithClosureDate(closureDatePlus222S)

    await tryPrintingSecretSpaceFor(client0)
    await tryPrintingSecretSpaceFor(client1)
    await tryPrintingSecretSpaceFor(client2)
    await tryPrintingSecretSpaceFor(client3)

    await waitMS(17000)

    await tryPrintingSecretSpaceFor(client0)
    await tryPrintingSecretSpaceFor(client1)
    await tryPrintingSecretSpaceFor(client2)
    await tryPrintingSecretSpaceFor(client3)

    await waitMS(17000)

    await tryPrintingSecretSpaceFor(client0)
    await tryPrintingSecretSpaceFor(client1)
    await tryPrintingSecretSpaceFor(client2)
    await tryPrintingSecretSpaceFor(client3)

    await waitMS(217000)

    await tryPrintingSecretSpaceFor(client0)
    await tryPrintingSecretSpaceFor(client1)
    await tryPrintingSecretSpaceFor(client2)
    await tryPrintingSecretSpaceFor(client3)

}

async function testClosureDateSubSpace() {
    var client = null;
    var sharer = null;

    var closureDate = Date.now() + (1000 * 300)
    var closureDateSubSpace = Date.now() + (1000 * 30)
    client = await create1ReadyClient(closureDate)
    sharer = await create1ReadyClient(closureDate)
    
    await client.acceptSecretsFrom(sharer.id, closureDateSubSpace)

}

async function testSecretSharing() {
    var client = null;
    var sharer = null;

    var closureDate = Date.now() + (1000 * 30)
    client = await create1ReadyClient(closureDate)
    sharer = await create1ReadyClient(closureDate)
    
    await client.acceptSecretsFrom(sharer.id)

    var secretId = "sharedSecret"
    var secret = "Super Secret"
    await sharer.shareSecretTo(client, secretId, secret)

    var foundSecret = await client.getSecretFrom(sharer, secretId)
    
    if(foundSecret == secret) {
        log("secret sharing successful!")
    } else {
        throw new Error("error ontestSecretSharing!\n foundSecret '"+foundSecret+"' did not match secret '"+secret+"'")
    } 
}

async function testSharingThenDenying() {
    var client = null;
    var sharer = null;

    var closureDate = Date.now() + (1000 * 30)
    client = await create1ReadyClient(closureDate)
    sharer = await create1ReadyClient(closureDate)
    
    await client.acceptSecretsFrom(sharer.id)

    var secretId = "sharedSecret"
    var secret = "Super Secret"
    await sharer.shareSecretTo(client, secretId, secret)

    var foundSecret = await client.getSecretFrom(sharer, secretId)
    
    if(foundSecret == secret) {
        log("secret sharing successful!")
    } else {
        throw new Error("error ontestSecretSharing!\n foundSecret '"+foundSecret+"' did not match secret '"+secret+"'")
    }

    await client.stopAcceptingSecretsFrom(sharer.id)


    await sharer.shareSecretTo(client, secretId, secret)

}

async function testNotificationHooksSubSpace() {
    var client = null;
    var sharer = null;

    var closureDate = Date.now() + (1000 * 30)
    client = await create1ReadyClient(closureDate)
    sharer = await create1ReadyClient(closureDate)
    
    await client.acceptSecretsFrom(sharer.id)

    await sharer.shareSecretTo(client, "sharedSecret", "Super Secret")
    
    var type = "log"
    var targetId = "subSpaces."+sharer.id
    var notifyURL = "https://citysearch.weblenny.at/citysearch"

    var addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
    
    var id1 = addResponse.id

    type = "event onDelete"
    targetId = "subSpaces."+sharer.id+".sharedSecret"
    notifyURL = "https://citysearch.weblenny.at/citysearch"

    addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
    
    var id2 = addResponse.id

    var deleteResponse = await client.deleteNotificationHook(id1)
    olog({deleteResponse})

    deleteResponse = await client.deleteNotificationHook(id2)
    olog({deleteResponse})

    await tryPrintingSecretSpaceFor(client)
    
}

async function testNotificationHooks1() {
    var client = null;
    var closureDate = Date.now() + (1000 * 20)

    client = await create1ReadyClient(closureDate)

    var type = "log"
    var targetId = "this"
    var notifyURL = "https://citysearch.weblenny.at/citysearch"
    
    var addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
}

async function testNotificationHooks1Fail() {
    var client = null;
    var closureDate = Date.now() + (1000 * 20)

    client = await create1ReadyClient(closureDate)

    var type = "log"
    var targetId = "this"
    var notifyURL = "https://citysearch.weblenny.at/aafaf"
    
    var addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
}

async function testNotificationHooksAll() {
    var client = null;
    var closureDate = Date.now() + (1000 * 30)

    client = await create1ReadyClient(closureDate)

    var type = "log"
    var targetId = "this"
    var notifyURL = "https://citysearch.weblenny.at/citysearch"
    
    var addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
    
    var id1 = addResponse.id

    notifyURL = "https://citysearch.weblenny.at/stringsearch"
    addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
    var id2 = addResponse.id

    var getResponse = await client.getNotificationHooks(targetId)
    olog({getResponse})

    type = "event onSet"
    targetId = "secrets.notifyOnSet"
    notifyURL = "https://citysearch.weblenny.at/stringsearch"

    await setSecretFor(client, "notifyOnSet", "I will notify on set :-)")
    addResponse = await client.addNotificationHook(type, targetId, notifyURL)
    olog({addResponse})
    var id3 = addResponse.id

    await tryPrintingSecretSpaceFor(client)
    
    getResponse = await client.getNotificationHooks(targetId)
    olog({getResponse})

    var deleteResponse = await client.deleteNotificationHook(id1)
    olog({deleteResponse})

    deleteResponse = await client.deleteNotificationHook(id2)
    olog({deleteResponse})

    deleteResponse = await client.deleteNotificationHook(id3)
    olog({deleteResponse})

    await tryPrintingSecretSpaceFor(client)

}

async function testGetNodeId() {
    var client = null;
    var closureDate = Date.now() + (1000 * 10)

    var wrongAuthCode = "deadbeefcafebabedeadbeefcafebabedeadbeefcafebabedeadbeefcafebabb"
    var invalidAuthCode = "asd"
    var correctAuthCode = "deadbeefcafebabedeadbeefcafebabedeadbeefcafebabedeadbeefcafebabe"
    
    
    client = await create1ReadyClient(closureDate)
    var serverId = await client.getServerId(correctAuthCode)
    
    log("Succes: getServerId returned "+serverId)
}
//#endregion

//==========================================================================
//#region helper functions
//==========================================================================
function die() {
    log("Critical Error -> controlled death commencing!")
    process.exit()
}

async function waitMS(ms) {
    await  new Promise((resolve) => setTimeout(resolve, ms))
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
async function tryPrintingSecretSpaceFor(client) {
    log("-> tryPrintingSecretSpaceFor§")
    try {
        var space = await client.getSecretSpace()
        olog(space)
    } catch(error) {
        log(error.message)
        return
    }
}

//==========================================================================
async function printSecretFor(client, secretId) {
    log("-> printSecretFor§")
    try {
        var secret = await client.getSecret(secretId)
        log(secret)
    } catch(error) {
        log(error.message)
        return
    }
}

//==========================================================================
async function create1ReadyClient(closureDate, authCode) {
    log("-> create1ReadyClient§")
    try {
        // var serverURL = "https://localhost:6999"
        var options = { serverURL }

        if(closureDate)
            options.closureDate = closureDate
        if(authCode)
            options.authCode = authCode

        var c = fac.createClient(options)
        await c.ready
        return c
    } catch(error) {
        log('  > "'+error.message+'"')
        die()
    }
}

//==========================================================================
async function tryCreating1ReadyClientWithClosureDate(closureDate) {
    log("-> tryCreate1ReadyClientWithClosureDate§")
    try {
        // var serverURL = "https://localhost:6999"
        var options = { serverURL, closureDate }
        var c = fac.createClient(options)
        await c.ready
        return c
    } catch(error) {
        log('  > "'+error.message+'"')
    }
}

//==========================================================================
async function create3Clients() {
    log("-> create3Clients§")
    try {
        // var serverURL = "https://localhost:6999"
        var options = { serverURL }
        var cA = fac.createClient(options)
        var cB = fac.createClient(options)
        var cC = fac.createClient(options)
        await Promise.all([cA.ready, cB.ready, cC.ready]) 
        return {cA, cB, cC}
    } catch(error) {
        log('  > "'+error.message+'"')
        die()
    }
}

async function createClientInvalid() {
    log("-> createClientInvalid§")
    const valid = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    const validB = "deadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"
    const invalidA = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbee"
    const invalidB = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeez"
    const authCode = "0xdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeefdeadbeef"

    // var serverURL = "https://localhost:6999"
    var options = { serverURL, authCode }
    options.secretKeyHex = valid


    try { //the publicKey invalidA
        options.publicKeyHex = invalidA
        let c = fac.createClient(options)
        console.log(c.ready)
        await c.ready
        log("> Error: create client with publicKey invalidA did not throw an Exception!")
        die()
    } catch(error) {
        log('  we used invalid key length and got an error')
        log('  - "' + error.message + '"')
    }

    try { //the publicKey invalidB
        options.publicKeyHex = invalidB
        let c = fac.createClient(options)
        await c.ready
        log("> Error: create client with publicKey invalidB did not throw an Exception!")
        die()
    } catch(error) {
        log('  we used non-hex-charcters and got an error')
        log('  - "' + error.message + '"')        
    }

    try { //the publicKey is nonfit
        options.publicKeyHex = validB
        let c =  fac.createClient(options)
        await c.ready
        log("> Error: create client with nonfit publicKey did not throw an Exception!")
        die()
    } catch(error) {
        log('  we used deadbeef for pub and secret key and got an error')
        log('  - "' + error.message + '"')
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

//#endregion

//==========================================================================
run()
