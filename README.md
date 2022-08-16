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

### In the screen shots below, we see in order...
1. Successful compilation and deployment of all the contracts. 
2. Successful proposal to change the value of the Box contract
3. The proposalId populated in proposals.json file
4. Successful voting confirmation on the proposal
5. Successful execution which ulimately changed the value in the Box contract.