import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";
import { ADDRESS_ZERO } from "../helper-hardhat-config";

const setupContracts: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    //we want to attach the "deployer" to the TimeLock contract here so we can call functions from the deployer account 
    const governanceToken = await ethers.getContract("GovernanceToken", deployer)
    const timeLock = await ethers.getContract("TimeLock", deployer);
    const governor = await ethers.getContract("GovernorContract", deployer);

    log("Setting up roles...");
    //Remember we are setting this up so only the Governor can send things to the TimeLock
    //Thing of the TimeLock as the President that makes everything gets sent to to be executed.
    //If we look at the TimeLockController contract we see it all the diff roles (admin, proposer, executor, etc)
    //There are diff bytes32 hashes associated with each role
    //By default our deployer account is the TIMELOCK_ADMIN_ROLE but we don't want this...
    // ... we don't want anyone with power of this TimeLock because we don't want any centralization
    // So what we can do is get the roles here and "fix" them. 

    const proposerRole = await timeLock.PROPOSER_ROLE();
    const executorRole = await timeLock.EXECUTOR_ROLE();
    const adminRole = await timeLock.TIMELOCK_ADMIN_ROLE();
    //We"Fix" the role setup by making the governor the only one that can do anything. We pass in governor.address
    //Remember once governor.address tells the time lock to do something TimeLock will wait before the period to be up before it does anything
    const proposerTx = await timeLock.grantRole(proposerRole, governor.address);
    await proposerTx.wait(1);
    //While we want the governor.address to be the only one to propose roles to TimeLock after they have been voted on...
    //... the exector role can be anyone, so we can set that to default address(0);
    //So we are giving the exectuorRole to address 0 which is no one, but actually everyone! So anyone can execute.
    const executorTx = await timeLock.grantRole(executorRole, ADDRESS_ZERO);
    await executorTx.wait(1);
    // Right now our deployer account owns the TimeLock Controller, thats how we've been doign these transactions...
    //...The deployer acount is hte one thats been calling grantRole and interacting with the TimeLock & TImeLockController
    //.. But we don't want that forever, just wanted it to start the project, now we want to revoke that role
    const revokeTx = await timeLock.revokeRole(adminRole, deployer);
    await revokeTx.wait(1);
    // After this is revoked no one owns timelock controller and so its impossible for anyone to anything with TineLock
};
export default setupContracts