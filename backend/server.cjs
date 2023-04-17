const express = require('express');
const cors = require('cors')
const algosdk = require('algosdk');
const crypto = require('crypto'); //for encrypting and decrypting data


//create server;
const app = express();

app.use(cors());
app.use(express.json())

//initializa server
app.listen(3000,()=>console.log('Server started on port 3000'));








async function sendVote(chosenCandidate, voterId){
    const token = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; // your API token
    const port = ''; // algod server port
    const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; // algod server address
    const algodClient = new algosdk.Algodv2(token, algodServer, port); // api client set up for algodServer
    
    const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'; // indexer server address for querying the blockchain i.e to retrieve transaction details
    const indexerClient = new algosdk.Indexer(token, indexerServer, port); //api client set up for indexServer
    
    //Mnemonic in order to generate the same mainAccount each time
    const mnemonic = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool';
    const mainAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log("Main account address: ", mainAccount.addr);
    
    //Account addresses for the candidates to whom voters will vote
    const candidateAccountAddresses = {0:'3WAUHLNF7C4H7MYU2D5AUPBMPQFYP7AICOZJKM2JPPHG4CWVLRSPBVZMMU',
                                        1:'HGK4JWYTA3ZTQSBWW22PN4F3JL7GTWVH6GH7ECPOXT4HJNIG3TUB4O432M',
                                        2:'Z4TKPDBH3KGAADVR77HRBKMHAMHDDS75WJSO67EPJNPNLR5TMW5UHYPCX4',
                                        3:'YN4QCUYMG7GM6OLGTYRJKO4E2U5MNAPVISNS4GQGABPWRXMM6A3H2F6AXA'}
    
    //Links to the account pages on algo explorer for inspection and testing
    //Main account: https://testnet.algoexplorer.io/address/6DBVPHKM72R63CT7HQDOUSRQFHHACVNFJZDK4AUTK4EEGUV4FHBA3DWWXA
    //Candidate  1: https://testnet.algoexplorer.io/address/HGK4JWYTA3ZTQSBWW22PN4F3JL7GTWVH6GH7ECPOXT4HJNIG3TUB4O432M
    //Candidate  2: https://testnet.algoexplorer.io/address/3WAUHLNF7C4H7MYU2D5AUPBMPQFYP7AICOZJKM2JPPHG4CWVLRSPBVZMMU
    //Candidate  3: https://testnet.algoexplorer.io/address/Z4TKPDBH3KGAADVR77HRBKMHAMHDDS75WJSO67EPJNPNLR5TMW5UHYPCX4
    //Candidate  4: https://testnet.algoexplorer.io/address/YN4QCUYMG7GM6OLGTYRJKO4E2U5MNAPVISNS4GQGABPWRXMM6A3H2F6AXA
    
    
    
    //Create accounts used for testing
    function generateAccount(count){
        let accounts = [];
        for(i=0; i<count; i++){   
            accounts.push(algosdk.generateAccount());
            console.log("Account address: ", accounts[i].addr);
        }
        return accounts;
    }
    
    //Pulls transaction details from the blockchain using the indexerClient
    async function getTransactionDetails(mainAccount){
        const transactionsDetails = (await indexerClient.lookupAccountTransactions(mainAccount.addr).do());
        return transactionsDetails; 
    }
    
    
    //Checks whether voter has voted based off of data pulled by getTransactionDetails
    async function hasVoted(mainAccount, voterId) {
        //Generate the encrypted voter id for the voter we want to check for validity
        const possibleVoterTransactionNote = generateTransactionNote(voterId, false);
        return getTransactionDetails(mainAccount).then((transactionsDetails)=>{
            //transactionsDetails is a json object containing a list of transactions made by the account at transactionDetails.transactions
            const transactions = transactionsDetails['transactions'];
            let transactionNotes = [];
            //Add the transaction note for each transaction to our list which we will use to verify validity
            for(transaction of transactions){
                transactionNotes.push(transaction.note);
            }
            return transactionNotes;
        
        }).catch((error)=>{
            console.error("Error getting transaction details ", error);
        })
        .then((transactionNotes)=>{
            for (let txn of transactionNotes) {
                //check whether there is a transacton note equal to the one for the voter we are checking
                if (txn === possibleVoterTransactionNote) {
                    return true;
                }
            }
            return false;
        })
    }
    
    //Encrypt and return voter id, this is what will be stored in the transaction note for each valid/successful transaction(vote)
    //The algorand network only accepts transaction notes in the Uint8Array format so uint is used to specify whether the function is being called to generate the transaction note to send to the algorand network or to check validity
    function generateTransactionNote(voterId, uint) {
        const hash = crypto.createHash('sha512');
        hash.update(Buffer.from(voterId));
        if(uint){
            //to be sent to the blockchain
            return new Uint8Array(hash.digest());
        }
        else{
            //to be used to test validity of a voter
            return hash.digest().toString('base64');
        }
    }
    //Pseudo function that checks if the voter is registered by pulling from the national government database
    function registrationValid(voterId){return true;}
    if(!registrationValid(voterId)){
        console.error(`Voter with id ${voterId} is not a registered voter`);
        return false;
    }
    const candidateAccountAddress = candidateAccountAddresses[chosenCandidate]
    voterId = voterId.toString();//to handle cases where voterId is passed as an int since the encrypter only accepts strings
    //Check for voter validity, if valid make the transaction(vote) and return true otherwise return false
    if (!await hasVoted(mainAccount, voterId)){
        //set up the transaction parameters
        let params = await algodClient.getTransactionParams().do();
        let txn = {
            "from": mainAccount.addr,
            "to": candidateAccountAddress,
            "fee": 1,
            "amount": 10, // 1 algo or 1 vote
            "firstRound": params.firstRound,
            "lastRound": params.lastRound,
            "genesisID": params.genesisID,
            "genesisHash": params.genesisHash,
            "note": generateTransactionNote(voterId, true),
        };
        let signedTxn = algosdk.signTransaction(txn, mainAccount.sk);//sign transaction using mainAccount's secret key
        let sendTx = await algodClient.sendRawTransaction(signedTxn.blob).do();//send the transaction to the algorand network
        console.log("Transaction: " + sendTx.txId);
        return true;
    }
    else{console.error(`Voter with id ${voterId} has already voted!!!`);
        return false;}
}


async function fetchElectionResults(){
    const token = {"X-API-Key": 'oMT938ZN9cacKTcIUlfQZ28sN6lyJCaS3lv2zYXF'}; // your API token
    const port = ''; // algod server port
    const algodServer = 'https://testnet-algorand.api.purestake.io/ps2'; // algod server address
    const algodClient = new algosdk.Algodv2(token, algodServer, port); // api client set up for algodServer
    
    const indexerServer = 'https://testnet-algorand.api.purestake.io/idx2'; // indexer server address for querying the blockchain i.e to retrieve transaction details
    const indexerClient = new algosdk.Indexer(token, indexerServer, port); //api client set up for indexServer
    
    //Mnemonic in order to generate the same mainAccount each time
    const mnemonic = 'perfect faint onion powder citizen chuckle lesson life used donkey spike must tonight night visit voice floor fitness rare elevator twenty bracket corn about pool';
    const mainAccount = algosdk.mnemonicToSecretKey(mnemonic);
    console.log("Main account address: ", mainAccount.addr);
    
    //Account addresses for the candidates to whom voters will vote
    const candidateAccountAddresses = ['3WAUHLNF7C4H7MYU2D5AUPBMPQFYP7AICOZJKM2JPPHG4CWVLRSPBVZMMU',
                                        'HGK4JWYTA3ZTQSBWW22PN4F3JL7GTWVH6GH7ECPOXT4HJNIG3TUB4O432M',
                                        'Z4TKPDBH3KGAADVR77HRBKMHAMHDDS75WJSO67EPJNPNLR5TMW5UHYPCX4',
                                        'YN4QCUYMG7GM6OLGTYRJKO4E2U5MNAPVISNS4GQGABPWRXMM6A3H2F6AXA']

    const transactionsDetails = await indexerClient.lookupAccountTransactions(mainAccount.addr).do();
        const transactions = transactionsDetails['transactions'];
        const paymentTransactions = [];
        for(const transaction of transactions){
            const paymentTransaction = transaction['payment-transaction'];
            paymentTransactions.push(paymentTransaction);
        }
        const receivers = [];
        for(const paymentTransaction of paymentTransactions){
            if(!(paymentTransaction === undefined)){
                receivers.push(paymentTransaction.receiver);
            }
        }
        const candidateVoteCounts = [];
        for(const candidateAccountAddress of candidateAccountAddresses){
            let voteCount = 0;
            receivers.forEach((elementReceivers)=>{
                if(candidateAccountAddress==elementReceivers){
                    voteCount+=1;
                }
            })
            candidateVoteCounts.push(voteCount);
        }
        const uhuru = {name:'uhuru', votes:candidateVoteCounts[0]};
        const ruto = {name: 'ruto', votes:candidateVoteCounts[1]};
        const raila = {name: 'raila', votes:candidateVoteCounts[2]};
        const wajakoya = {name: 'wajakoya', votes:candidateVoteCounts[3]};
        let candidatesMap = [];
        candidatesMap.push(uhuru);
        candidatesMap.push(raila);
        candidatesMap.push(ruto);
        candidatesMap.push(wajakoya);
        return candidatesMap;
    }

const results = fetchElectionResults();
results.then((results)=>{
    console.log(results);
})

app.post('/confirmVoter',(req,res)=>{
    const data = req.body;
    const voterid = data.id;
    res.send({allowed:true});

});

app.post('/vote',async(req,res)=>{
    const data = req.body;
    console.log('id is',data.id)

    const voteHappened = await sendVote(data.chosen,data.id);

    console.log('is user allowed',voteHappened)

    if(voteHappened){
        res.send({allowed:true});
    }
    else{
        res.send({allowed:false})
    }
});

app.post('/results',async(req,res)=>{
    const votesResults = await fetchElectionResults();
    res.send(votesResults);
})
