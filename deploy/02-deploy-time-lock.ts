import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { MIN_DELAY } from "../helper-hardhat-config";


const deployTimeLock: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    const { deploy, log } = deployments;
    const { deployer } = await getNamedAccounts();
    log("Deploying TimeLock...");

    const timeLock = await deploy("TimeLock", {
        from: deployer,
        //Remember TimeLock contract does take some arguments... minDelay, proposers, & executors. 
        //To assist with the arguments we are going to create a helper-hardhat-config.ts file.
        //As you can see proposers[] and executors[] we will leave blank
        args: [MIN_DELAY, [], []],
        log: true,
    });
};

export default deployTimeLock;