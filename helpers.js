require("dotenv").config();
const abi = require("./stake.json");
const ethers = require("ethers");

const provider = new ethers.providers.JsonRpcProvider(
  "https://polygon-rpc.com/"
);
const signer = new ethers.Wallet(process.env.PV_KEY, provider);

const STAKE_ADDRESS = "0x8d528e98A69FE27b11bb02Ac264516c4818C3942";

const stakingContract = new ethers.Contract(STAKE_ADDRESS, abi, signer);

const getNFTContract = async () => {
  const NFTAddress = await stakingContract.cryptoUnicornsAddress();
  return new ethers.Contract(
    NFTAddress,
    [
      "function safeTransferFrom(address from, address to, uint256 tokenId, bytes _data)",
    ],
    signer
  );
};

const stakeNFT = async (tokenId) => {
  const NFT = await getNFTContract();

  await NFT.safeTransferFrom(
    await signer.getAddress(),
    STAKE_ADDRESS,
    tokenId,
    ethers.constants.HashZero
  );
};

const unstakeNFT = async (tokenId) => {
  const tx = await stakingContract.exitForest(tokenId);
  tx.wait();
};

module.exports = {
  provider,
  signer,
  STAKE_ADDRESS,
  stakingContract,
  getNFTContract,
  stakeNFT,
  unstakeNFT,
};
