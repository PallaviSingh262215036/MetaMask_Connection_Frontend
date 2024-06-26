async function main() {

const MyToken= await ethers.getContractFactory("MyToken");
console.log("Runned getcontractfactory");
const myToken = await MyToken.deploy("MyToken","MTK",1000);
await myToken.waitForDeployment();


console.log("MyToken deployed to:",myToken.target);

}

main()
.then(()=>process.exit(0))
.catch((error)=> {
 console.error(error);
 process.exit(1);

});