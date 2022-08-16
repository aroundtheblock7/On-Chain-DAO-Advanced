import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { ethers } from "hardhat";

//The Box contract is the contract that we want to govern over. 

const deployBox: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying Box...");
    const box = await deploy("Box", {
        from: deployer,
        args: [],
        log: true
    })
    //Right now our deployer account has deployed this, not our TimeLock. 
    //So we want to transfer the Box's ownership over to our Governance contract...
    const timeLock = await ethers.getContract("TimeLock");
    //Because this is known as a "Box deployment" we first need to get the box contract object. 
    const boxContract = await ethers.getContractAt("Box", box.address)
    const transferOwnerTx = await boxContract.transferOwnership(
        timeLock.address
    );
    await transferOwnerTx.wait(1);
    log("Successful Deployment!!!")
};
export default deployBox;