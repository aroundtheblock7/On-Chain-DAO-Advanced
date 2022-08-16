import { ethers, network } from "hardhat"
import {
    FUNC,
    NEW_STORE_VALUE,
    PROPOSAL_DESCRIPTION,
    MIN_DELAY,
    developmentChains,
} from "../helper-hardhat-config"
import { moveBlocks } from "../utils/move-blocks"
import { moveTime } from "../utils/move-time"

export async function queueAndExecute() {
    //In GovernorTimeLockController.sol contract we see function queue...
    //... which takes exact same inputs as function propose
    //To get those exact values we need to import them at the top of this file 
    const args = [NEW_STORE_VALUE];
    const box = await ethers.getContract("Box");
    const encodedFunctionCall = box.interface.encodeFunctionData(FUNC, args);
    const descriptionHash = ethers.utils.keccak256(ethers.utils.toUtf8Bytes(PROPOSAL_DESCRIPTION)
    );

    const governor = await ethers.getContract("GovernorContract");
    console.log("Queueing...")
    const queueTx = await governor.queue(
        [box.address], 
        [0], 
        [encodedFunctionCall], 
        descriptionHash
    );
    await queueTx.wait(1);

    //So at this point we are queued up but remember there is a delay that allows people to get out
    // So we are going to speed up blocks with moveBlocks
    // But we also need to moveTime so we will create a "move-time.ts" file under utils and import at top
    // Also we need to import MIN_DELAY var at top we are getting from helper-hard-config,ts
    // Again, if we were on a real chain we'd just wait but since we're on a local host we have to move blocks & time

    if (developmentChains.includes(network.name)) {
        await moveTime(MIN_DELAY + 1) //we are doing +1 just to be safe 
        await moveBlocks(1) //move 1 block
    }
    console.log("Executing...")
    // this will fail on a testnet because you need to wait for the MIN_DELAY!
    const executeTx = await governor.execute(
        [box.address],
        [0],
        [encodedFunctionCall],
        descriptionHash
    )
    await executeTx.wait(1);
    //Finally we will see if the new Box value has been updated 
    const boxNewValue = await box.retrieve();
    console.log(`New Box value: ${boxNewValue.toString()}`);
}

queueAndExecute()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error)
        process.exit(1)
    })
