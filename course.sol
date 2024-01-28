// SPDX-License-Identifier: GPL-3.0
 pragma solidity =0.8.23;
import "hardhat/console.sol";

library StringComparer {
  function compare(string memory str1, string memory str2) public pure returns (bool) {
    return keccak256(abi.encodePacked(str1)) == keccak256(abi.encodePacked(str2));
  }
}

interface Living {
  function eat(string memory food) external returns (string memory);
}

contract HasName {
  string internal _name;

  constructor(string memory name) {
    _name = name;
  }
}

abstract contract Animal is Living {
  function eat(string memory food) pure virtual public returns (string memory) {
    return string.concat(
      "Animal eats ", food
    );
  }

  function sleep() pure virtual public returns (string memory) {
    return "Z-z-z-z-z....";
  }

  function speak() pure virtual public returns (string memory) {
    return "...";
  }
}

abstract contract Herbivore is Animal, HasName {

  string constant PLANT = "plant";

  modifier eatOnlyPlant(string memory food)  {
    require(StringComparer.compare(food, PLANT), "Can only eat plant food");
    _;
  }

  function eat(string memory food) pure virtual override public eatOnlyPlant(food) returns (string memory) {
    return super.eat(food);
  }

}

contract Cow is Herbivore {
  constructor(string memory name) HasName(name) {
  }

  function speak() pure override public returns (string memory) {
    return "Mooo";
  }
}

contract Horse is Herbivore {
  constructor(string memory name) HasName(name) {
  }

  function speak() pure override public returns (string memory) {
    return "Igogo";
  }
}

contract Farmer {
  function feed(address animal, string memory food) pure public returns (string memory) {
    return Animal(animal).eat(food);
  }

  function call(address animal) pure public returns (string memory){
    return Animal(animal).speak();
  }
}

abstract contract MeatEaters is Animal, HasName {
    string constant Meat = 'meat';
        modifier eatOnlyMeat (string memory food ) {
            require(StringComparer.compare(food, Meat), "Eat only meat");
            _;
        }
    function eat(string memory food) pure override  public eatOnlyMeat(food) returns (string memory) {
    return string.concat(
      "Animal eats ", food
    );
  }
}

contract Wolf is MeatEaters  {
    constructor(string memory name) HasName(name) {}
function speak() pure override  public returns (string memory) {
    return "Awoo";
  }
}
abstract contract Omnivores is Animal, HasName {
    string constant Meat = "meat";
    string constant Plant = "plant";
        modifier MeatAndPlant (string memory food) {
            require(StringComparer.compare(food, Meat) || 
            StringComparer.compare(food, Plant), "Eats everything, except chocolate)");
            _;
        }
    function eat(string memory food) pure override  public MeatAndPlant(food) returns (string memory) {
    return string.concat(
      "Animal eats ", food
    );
   }
}  

contract Dog is Omnivores {
    constructor(string memory name) HasName(name) {}
    
    
    function speak() pure override  public returns (string memory) {
    return "Woof";
    }
}