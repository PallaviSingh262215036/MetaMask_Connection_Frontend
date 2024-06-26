const {expect}=require("chai");


describe("MyToken contract", function(){

let MyToken;
let myToken;
let owner;
let addr1;
let addr2;

beforeEach(async function(){

MyToken = await ethers.getContractFactory("MyToken");
[owner, addr1,addr2]=await ethers.getSigners();
myToken=await MyToken.deploy("MyToken","MTK",1000);

});

it("should have correct TokenName, TokenAbbrv and TotalSupply",async function(){

    expect(await myToken.TokenName()).to.equal("MyToken");
    expect(await myToken.TokenAbbrv()).to.equal("MTK");
    expect(await myToken.TotalSupply()).to.equal(1000);

})

it("should mint tokens correctly",async function(){
await myToken.Mint(addr1.address,100);
expect(await myToken.balances(addr1.address)).to.equal(100);
expect(await myToken.TotalSupply()).to.equal(1100);

});

it("should assign the total supply of tokens to the owner",async function(){
 const ownerBalance=await myToken.balances(owner.address);
 console.log("Total Supply:",myToken.TotalSupply());
 expect(ownerBalance).to.equal(1000);


})

it("should not mint tokens to zero address", async function () {
    await expect(myToken.Mint("0x0000000000000000000000000000000000000000", 100)).to.be.revertedWith("You are minting to Zero address");
  });

it("should burn tokens correctly", async function () {
    await myToken.Mint(addr1.address, 100);
    await myToken.burn(addr1.address, 50);
    expect(await myToken.TotalSupply()).to.equal(1050);
    expect(await myToken.balances(addr1.address)).to.equal(50);
  });

it("should not burn tokens from zero address", async function () {
    await expect(myToken.burn("0x0000000000000000000000000000000000000000", 100)).to.be.revertedWith("You are burning from Zero address");
  });

it("should not burn more tokens than balance", async function () {
    await myToken.Mint(addr1.address, 100);
    await expect(myToken.burn(addr1.address, 200)).to.be.revertedWith("Insufficient balance to burn");
  });

}
);


