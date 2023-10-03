import React, { useState, useEffect } from "react";

import { Web3Modal } from "@web3modal/wagmi/dist/types/src/client";
import { ethers } from "ethers";

import { CrowdFundingABI, CrowdFundingAddress } from "./contants";

const fetchContract = (signerOrProvider) =>
  new ethers.Contract(CrowdFundingAddress, CrowdFundingABI, signerOrProvider);
export const CrowdFundingContext = React.createContext();
export const CrowdFundingPrivider = ({ children }) => {
  const title = "CrowdFunding";
  const [currentAccount, setCurrentAccount] = useState("");
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
};
