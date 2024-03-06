const { time, loadFixture } = require('@nomicfoundation/hardhat-toolbox/network-helpers');
const { anyValue } = require('@nomicfoundation/hardhat-chai-matchers/withArgs');
const { expect } = require('chai');
const { ethers } = require('hardhat');
const abiForHorse = require('../artifacts/contracts/Homework.sol/Horse.json');
const abiForFarmer = require('../artifacts/contracts/Homework.sol/Farmer.json');
const abiForDog = require('../artifacts/contracts/Homework.sol/Dog.json');
const { Block, Contract, ConstructorFragment } = require('ethers');
const tokens = (n) => {
  return ethers.parseEther(n.toString(), 'ether');
};
describe('Horse and Farmer', async function Deploying() {
  const signer = ethers.getSigner();
  let horseContract;
  let farmerContract;
  const horseName = 'SuperHorse';
  beforeEach(async function () {
    const Library = await ethers.getContractFactory('StringComparer', { signer: signer[0] });
    const lib = await Library.deploy();
    const horseFactory = await ethers.getContractFactory('Horse', {
      signer: signer[0],
      libraries: {
        StringComparer: await lib.getAddress(),
      },
    });
    const farmerFactory = await ethers.getContractFactory('Farmer');
    horseContract = await horseFactory.deploy(horseName);
    farmerContract = await farmerFactory.deploy();
  });
  it('Horse has the correct name', async function () {
    console.log(await horseContract._name_());
    expect(await horseContract._name_()).to.be.equal(horseName); //
  });
  it('Horse can sleep', async function () {
    const sleep = await horseContract.sleep();
    expect('Z-z-z-z-z....').to.be.eq(sleep);
  });
  it('Horse can eat plant', async function () {
    const eatPlant = await horseContract.eat('plant');
    await expect(eatPlant).not.to.be.revertedWith('Can only eat plant food');
  });
  it('Horse cannot eat meat, not-food or plastic', async function () {
    await expect(horseContract.eat('plastic')).to.be.revertedWith('Can only eat plant food');
    await expect(horseContract.eat('meat')).to.be.revertedWith('Can only eat plant food');
    await expect(horseContract.eat('not-food')).to.be.revertedWith('Can only eat plant food');
  });
  it('Farmer can call Horse, Horse responds correctly', async function () {
    const callHorse = await farmerContract.call(horseContract.getAddress());
    expect(callHorse).to.be.eq('Igogo');
  });
  it('Farmer can feed Horse with plant', async function () {
    const feedHorse = await farmerContract.feed(horseContract.getAddress(), 'plant');
    expect(feedHorse).to.be.equal('Animal eats plant');
  });
  it('Farmer cannot feed Horse with anything else', async function () {
    await expect(farmerContract.feed(horseContract.getAddress(), 'meat')).to.be.revertedWith('Can only eat plant food');
  });
});
describe('Dog and Farmer', function () {
  const signer = ethers.getSigner();
  let farmerContract;
  let dogContract;
  const dogName = 'SuperDog';
  beforeEach(async function () {
    const Library = await ethers.getContractFactory('StringComparer', { signer: signer[0] });
    const lib = await Library.deploy();
    const farmerFactory = await ethers.getContractFactory('Farmer');
    farmerContract = await farmerFactory.deploy();
    const dogFactory = await ethers.getContractFactory('Dog', {
      signer: signer[0],
      libraries: {
        StringComparer: await lib.getAddress(),
      },
    });
    dogContract = await dogFactory.deploy(dogName);
  });
  it('Dog has the correct name', async function () {
    console.log(await dogContract._name_());
    expect(await dogContract._name_()).to.be.equal(dogName); //
  });
  it('Dog can sleep', async function () {
    expect(await dogContract.sleep()).to.be.equal('Z-z-z-z-z....');
  });
  it('Dog can eat plant', async function () {
    expect(await dogContract.eat('plant')).to.be.equal('Animal eats plant');
  });
  it('Dog can eat meat', async function () {
    expect(await dogContract.eat('meat')).to.be.eq('Animal eats meat');
  });
  it('Dog cannot eat not-food, plastic, chocolate', async function () {
    await expect(dogContract.eat('plastic')).to.be.revertedWith('Eats everything, except chocolate)');
    await expect(dogContract.eat('chocolate')).to.be.revertedWith('Eats everything, except chocolate)');
    await expect(dogContract.eat('not-food')).to.be.revertedWith('Eats everything, except chocolate)');
  });
  it('Farmer can call Dog, Dog responds correctly', async function () {
    const dogAddr = await dogContract.getAddress();
    expect(await farmerContract.call(dogAddr)).to.be.eq('Woof');
  });
  it('Farmer can feed Dog with meat, plant', async function () {
    const dogAddr = await dogContract.getAddress();
    await expect(farmerContract.feed(dogAddr, 'meat')).not.to.be.revertedWith('Eats everything, except chocolate)');
    await expect(farmerContract.feed(dogAddr, 'plant')).not.to.be.revertedWith('Eats everything, except chocolate)');
  });
  it('Farmer cannot feed Dog with ”not-food”, ”plastic” and anything else', async function () {
    const dogAddr = await dogContract.getAddress();
    await expect(farmerContract.feed(dogAddr, 'not-food')).to.be.revertedWith('Eats everything, except chocolate)');
    await expect(farmerContract.feed(dogAddr, 'plastic')).to.be.revertedWith('Eats everything, except chocolate)');
    await expect(farmerContract.feed(dogAddr, 'else')).to.be.revertedWith('Eats everything, except chocolate)');
  });
});
