# Hala-Blockchain-Voting-System
Welcome to the Hala blockchain voting system on the Algorand Network! Here's the readme to help you get started with using our system.

## Introduction
Hala is a secure and transparent blockchain voting system that allows voters to cast their votes for candidates on the Algorand Network. The system has a main account and candidate accounts for each vote cast, a transaction is made from the main account to the candidate account of the candidate who was voted for. 
To prevent fake votes, the system generates and attaches an encrypted voter ID to the transaction notes of each successful vote, this is what is used to validate votes.

## How Hala works

When a user wants to vote, they input their voter ID into the system.

<image src="https://raw.githubusercontent.com/SenZmaKi/Hala-Blockchain-Voting-System/master/screenshots/input-voter-id.jpeg">

The system then calls a pseudo function that compares the voter ID to the registered voter IDs in the Nation's respective organisation database

The user chooses their candidate of choice and submits

<image src="https://raw.githubusercontent.com/SenZmaKi/Hala-Blockchain-Voting-System/master/screenshots/choose-candidate.jpeg">

The system then encrypts the voter ID and checks if the encrypted voter ID is available in any of the transaction notes of any of the transactions made by the main account, these transactions are stored in the Algorand Block Chain Network. 

If the encrypted voter ID is already in the system, the system tells the voter that the voter ID has already been used and rejects the vote/transaction.

If the encrypted voter ID is not in the system, the system accepts the vote and casts the transaction to the Algorand Blockchain Network.

<image src="https://raw.githubusercontent.com/SenZmaKi/Hala-Blockchain-Voting-System/master/screenshots/succesful-vote.jpeg">

In terms of voter count, the votes are counted by how many number of transactions were made to which account by the main account. This is to prevent potential counting fake votes by counting transactions from the receiver accounts
<img src="https://raw.githubusercontent.com/DavidManga254/Hala-Voting-System/main/src/assets/WhatsApp%20Image%202023-04-16%20at%2018.32.11.jpg">

## Smart Contract
To handle cases where transactions are made to the candidate accounts outside our system, we have a smart contract that makes the candidate accounts reject transactions that aren't made from the main account. This ensures that all votes are accounted for and there is no tampering with the voting process.
The votes are also counted based on the number of transactions made by the main account to each candidate account instead of the balance of the candidate accounts.


## Installation
Clone the repository from github or in your terminal run

```git clone https://github.com/DavidManga254/Hala-Voting-System.git```

Navigate to the installation directory via your terminal then navigate to the directory named Hala and run

```npm install ```

To launch the front-end run navigate to the Hala directory and run

```npm run dev```
  
This will print a link, click this link to go the Hala Voting page after the following step

To launch the backend server, open a different terminal window and navigate to the Hala directory and run 

```cd backend```

Then run 

```node --experimental-modules server.cjs```

## Conclusion
The Hala blockchain voting system is a secure and transparent way for voters to cast their votes. With the use of encrypted voter IDs and a smart contract to ensure the validity of the votes, the system is designed to prevent fraudulent activities and ensure a fair and accurate election.

## Contributors

  David Manga<br></br>
<a  href="https://github.com/SenZmaKi"  target="_blank">Phidel Alvin</a>
