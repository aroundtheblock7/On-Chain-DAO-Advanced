//Reference docs here for support... https://github.com/wighawag/hardhat-deploy#typescript-support
//When using hardhat-deploy these are the 2 things we need to import...
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { DeployFunction } from 'hardhat-deploy/types';
import { ethers } from 'hardhat';

//const deployGovernanceToken is of type "DeployFunction"
const deployGovernanceToken: DeployFunction = async function (
    hre: HardhatRuntimeEnvironment
) {
    //first we need an account to deploy this so we set that up here. 
    // note we are getting this vars (getNamedAccounts, deployments, network) from our HardhatRunTimeEnviornment...
    //... which is being updated from hardhat deploy
    // getNamedAccounts is a way for us to get accounts from our hardhat.config.ts right into our deploy script
    const { getNamedAccounts, deployments } = hre;
    //Note "deployments" object comes with both a "deploy" function and "log" function!
    const { deploy, log } = deployments;
    // Here we are grabbing from our hardhat.config.ts the "deployer" account which is set to use default 0 account
    const { deployer } = await getNamedAccounts();
    log("Deploying Governance Token...");
    const governanceToken = await deploy("GovernanceToken", {
        from: deployer,
        args: [],
        log: true,
        // waitConfirmations: If you want to autoverify stuff you can do taht here but we're not using here.
    });
    // verify (check the github repo to see how to autoverify). We could do that here if we want.
    log(`Deployed governance token to address ${governanceToken.address}`)

    await delegate(governanceToken.address, deployer);
    log("Delegated!")
};
// When we initally deploy our GovernanceToken contract, no one has voting power yet because no one has the token delegated to them
// So what we want to do is delegate this token to our deployer. So we want to create a delegate function here  to facilitate this...
const delegate = async (governanceTokenAddress: string, delegatedAccount: string) => {
    //as long as we have import { ethers } from 'hardhat' at the top of file here we can use ethers.getContractAt 
    const governanceToken = await ethers.getContractAt(
        "GovernanceToken",
        governanceTokenAddress
    );
    // Now that we have our GovernanceToken contract we can do the following...
    // If we look at the ERC20Votes contract which is inherited by our GovernanceToken we see it has a function called "numCheckpoints"
    // numCheckpoints shows us how many checkpoints a particular account has (here it is our delegatedAccount).
    // The reason this is important is when people do a vote, they do it off some "checkpoints". And anytime you transfer or delegate a token...
    // ...we call the moveVotingPower function which writes the checkoint. It basically says...at checkpoint "x" here is what everyone has for voting powers 
    const tx = await governanceToken.delegate(delegatedAccount);
    await tx.wait(1);
    //This will shows us the number of checkpoints we have. If we see 0 when we run "yarn hardhat deploy" know we haven't delegated correctly. Should be at least 1. 
    console.log(`Checkpoints ${await governanceToken.numCheckpoints(delegatedAccount)}`)
};

export default deployGovernanceToken;