import React, { useState, useEffect } from "react";

import { ethers } from "ethers";

import { CrowdFundingABI, CrowdFundingAddress } from "./contants";
import { data } from "autoprefixer";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);
export const CrowdFundingContext = React.createContext();
export const CrowdFundingPrivider = ({ children }) => {
  const title = "CrowdFunding";
  const [currentAccount, setCurrentAccount] = useState("");
  const [openError, setOpenError] = useState(false);
  const [error, setError] = useState("");
  const createCampaign = async (campagin) => {
    const { title, description, amount, deadline } = campagin;
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);

    console.log("current account", currentAccount);

    try {
      const transaction = await contract.createCampaign(
        currentAccount,
        title,
        description,
        ethers.utils.parseUnits(amount, 18),
        new Date(deadline).getTime()
      );
      await transaction.wait();
      console.log("contract Success", transaction);
    } catch (error) {
      console.log("contract error", error);
    }
  };
  const getCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);
    const campaigns = await contract.getCampaigns();
    console.log("campaigns", campaigns);
    const parsedCampaigns = campaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      pId: i,
    }));
    return parsedCampaigns;
  };
  const getUserCampaigns = async () => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const allCampaigns = await contract.getCampaigns();
    const accounts = await window.ethereum.request({ method: "eth_accounts" });
    const currentAccount = accounts[0];
    const userCampaigns = allCampaigns.filter(
      (campaign) => campaign.owner === currentAccount
    );
    const userData = userCampaigns.map((campaign, i) => ({
      owner: campaign.owner,
      title: campaign.title,
      description: campaign.description,
      target: ethers.utils.formatEther(campaign.target.toString()),
      deadline: campaign.deadline.toNumber(),
      amountCollect: ethers.utils.formatEther(
        campaign.amountCollect.toString()
      ),
      pId: i,
    }));
    return userData;
  };
  const donate = async (pid, amount) => {
    const web3modal = new Web3Modal();
    const connection = await web3modal.connect();
    const provider = new ethers.providers.Web3Provider(connection);
    const signer = provider.getSigner();
    const contract = fetchContract(signer);
    const campaignData = await contract.donateToCampaign(pid, {
      value: ethers.utils.pasreEther(amount, 18),
    });
    await campaignData.wait();
    location.reload();
    return campaignData;
  };

  const getDonate = async (pid) => {
    const provider = new ethers.providers.JsonRpcProvider();
    const contract = fetchContract(provider);

    const donations = await contract.getDonations(pid);
    const numberOfDonations = donations[0].length;

    const parsedDonation = [];

    for (let i = 0; i < numberOfDonations; i++) {
      parsedDonation.push({
        donor: donations[0][i],
        donaion: ethers.utils.formatEther(donations[1][i].toString()),
      });
    }
    return parsedDonation;
  };

  const checkIfWalletIsConnected = async () => {
    try {
      if (!window.ethereum) {
        return setOpenError(true), setError("No wallet detected");
      }
      const accounts = await window.ethereum.request({
        method: "eth_accounts",
      });
      if (accounts.length) {
        setCurrentAccount(accounts[0]);
      } else {
        console.log("No account found");
      }
    } catch (error) {
      console.log("error", error);
    }
  };
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);
  const connectWallet = async () => {
    try {
      if (!window.ethereum) {
        return console.log("No wallet detected");
      }
      const account = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setCurrentAccount(account[0]);
    } catch (error) {
      console.log("error", error);
    }
  };
  return (
    <CrowdFundingContext.Provider
      value={{
        title,
        currentAccount,
        connectWallet,
        createCampaign,
        getCampaigns,
        getUserCampaigns,
        donate,
        getDonate,
        connectWallet,
      }}
    >
      {children}
    </CrowdFundingContext.Provider>
  );
};
