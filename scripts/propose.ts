import {
    NEW_STORE_VALUE,
    FUNC,
    PROPOSAL_DESCRIPTION,
    developmentChains,
    VOTING_DELAY,
    proposalsFile,
} from "../helper-hardhat-config";
import { ethers, network } from "hardhat";
import { moveBlocks } from "../utils/move-blocks";
import * as fs from "fs";

//Here we are calling the propose function in box contract with the arguments it takes.
//Note thatwe have to encode the data hence the encodeFunctionData
export async function propose(args: any[], functionToCall: string, proposalDescription: string) {
    const governor = await ethers.getContract("GovernorContract")
    const box = await ethers.getContract("Box")
    //Now we want to look at the Governor.sol contract and see the inputs the propsal function takes
    const encodedFunctionCall = box.interface.encodeFunctionData(
        functionToCall,
        args
    );
    //console log will return us the bytes of the encoded data 
    console.log(`Proposing ${functionToCall} on ${box.address} with ${args}`)
    console.log(`Proposing Description: \n ${proposalDescription}`)
    const proposeTx = await governor.propose(
        [box.address],
        [0],
        //encodedFunctionCall is the bytes data argument
        [encodedFunctionCall],
        proposalDescription
    );
    //In Governor.sol we see the propose function has this proposalId that we need. The function also emits...
    //... an event with the proposalId. So we need the propsalId for later on when we go to vote so can refect that here...
    const proposeReceipt = await proposeTx.wait(1);

    //If we are on a local blockchain like Hardhat, no on is actually minging blocks so we have no way to track time
    // So to assist with this we can set developmentChains variable in the helper-hardhat-config file
    // along with the move-blocks.ts file in the utils folder. 
    //These 3 thing along with the if statment below allows us to move blocks and adjust time forward if on hardhat
    if (developmentChains.includes(network.name)) {
        await moveBlocks(VOTING_DELAY + 1);
    }

    //Here we get the events from the propsal receipt. This is how we get the proposalId from the event!
    //There are other ways to get events in hardhat too but we will use this method here.
    //Remember too that we created a proposals.json file too to hkeep track of the proposalId's 
    //We also add a "proposalsFile" variable in helper-hardat-config.ts and import at top of file here
    const proposalId = proposeReceipt.events[0].args.proposalId;
    //Now that we have a way to store all the proposals we can spit them out here
    //With the utf8 we need to do "yarn add fs" to add it to node modules and import at top of file here
    let proposals = JSON.parse(fs.readFileSync(proposalsFile, "utf8"));
    //when we save these proposals we will reference its chainId with each one.
    proposals[network.config.chainId!.toString()].push(proposalId.toString());
    fs.writeFileSync(proposalsFile, JSON.stringify(proposals));
}
//Both NEW_STORE_VALUE and FUNC need to be added to the helper-hardhat-config.ts file 
//Also import both variables at top from helper-hardhat-config.ts file
propose([NEW_STORE_VALUE], FUNC, PROPOSAL_DESCRIPTION)
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
