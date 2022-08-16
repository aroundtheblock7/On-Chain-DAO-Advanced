# On-Chain DAO (Advanced)

### In this project we build an on-chain DAO using hardhat, solidity, typescript, and Openzeppelin. The following contractsare used in this projet...
* We deploy an ERC20 token that we will use to govern our DAO.
* We deploy a Timelock contract that we will use to give a buffer between executing proposals will handle all the money, ownerships, etc
* We deploy our Governor contract. The Governance contract is in charge of proposals and such, but the Timelock executes!
* We deploy an example Box contract, which will be owned by our governance process! (aka, our timelock contract).
* We propose a new value to be added to our Box contract.
* We vote on that proposal.
* We then queue the proposal to be executed.
* Finally we execute it!

### To facilitate with deployment and scripts we used hardhat-deploy, helper-hardhat-config, typechain/hardhat, and a number of other modules using typescript. Our scripts files include making a proposal, voting on it, and queuing & exectuting it. Being that we are using hardhat's localhost to deploy this project and run scripts we had to also set up 2 seperate files in our utils folder that allow us to move-time and move-blocks which helps us simulate the time interval that must be met before executing a proposal that has been voted on. 

### To run deploy project and run scripts..
* yarn hardhat deploy
* yarn hardhat node (keep terminal open & running before running scripts below)
* yarn hardhat run scripts/propose.ts --network localhost
* yarn hardhat run scripts/vote.ts --network localhost
* yarn hardhat run queue-and-execute.ts --network localhost

### In the screen shots below, we see in order...
1. Successful compilation and deployment of all the contracts. 
2. Successful proposal to change the value of the Box contract (scripts/propose.ts)
3. The proposal-ID populated in proposals.json file through automation 
4. Successful voting confirmation on the proposal (scripts/vote.ts)
5. Successful execution which ulimately changed the value in the Box contract (scripts/queue-and-execute.ts)

<img width="1334" alt="Screen Shot 2022-08-15 at 12 12 21 AM" src="https://user-images.githubusercontent.com/81759076/184789927-f3e67780-5b22-4aa7-83a8-6431a2facc39.png">
<img width="1382" alt="Screen Shot 2022-08-15 at 10 26 22 AM" src="https://user-images.githubusercontent.com/81759076/184789950-26ee4290-0935-4cf6-8df4-e170dad186da.png">
<img width="1280" alt="Screen Shot 2022-08-15 at 5 42 12 PM" src="https://user-images.githubusercontent.com/81759076/184789967-1269f3a9-8c97-4385-be04-7f690d251bb6.png">
<img width="874" alt="Screen Shot 2022-08-15 at 7 09 03 PM" src="https://user-images.githubusercontent.com/81759076/184789991-57ce4400-0e3c-4ffe-98cd-af98bcef3099.png">
<img width="1201" alt="Screen Shot 2022-08-15 at 8 55 08 PM" src="https://user-images.githubusercontent.com/81759076/184790011-8419b20f-ad44-4dd6-8677-12860dedc1ad.png">
