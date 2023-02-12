const { expect } = require("chai");
const { ethers } = require("hardhat");

const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token contract", function () {
  async function deployTokenFixture() {
    const Token = await ethers.getContractFactory("Token");
    const [signer] = await ethers.getSigners();

    const hardhatToken = await Token.deploy();

    await hardhatToken.deployed();

    return { Token, hardhatToken, signer };
  }

  describe("Deployment", function () {
    it("Should mint tokens and assign to the signer", async function () {
      const { hardhatToken, signer } = await loadFixture(deployTokenFixture);

      await hardhatToken.mint(signer.address, 100)

      const signerBalance = await hardhatToken.balanceOf(signer.address);
      expect(signerBalance).to.equal(100);
      expect(await hardhatToken.totalSupply()).to.equal(signerBalance);
    });
  });
});
