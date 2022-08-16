import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import { VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE } from "../helper-hardhat-config";

const deployGovernorContract: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    const { getNamedAccounts, deployments } = hre;
    //we add "get" here to deployments which also us to "get" addresses of contracts deployed
    const { deploy, log, get } = deployments;
    const { deployer } = await getNamedAccounts();
    //Additionally we need the GovernanceToken and the TimeLock contract so..
    const governanceToken = await get("GovernanceToken");
    const timeLock = await get("TimeLock");
    log("Deploying governor")
    const governorContract = await deploy("GovernorContract", {
        //If we look at the GovernorContract we see all the arguments the constructor takes which must be listed here under args:
        // We also need to make sure the variables are put in our helper-hardhat-config.ts and add them as imports at the top of the page here
        from: deployer,
        args: [governanceToken.address, timeLock.address, VOTING_DELAY, VOTING_PERIOD, QUORUM_PERCENTAGE],
        log: true,
    });
};
export default deployGovernorContract;