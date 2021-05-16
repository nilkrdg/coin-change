# Coin Change API
<!-- TABLE OF CONTENTS -->
<details open="open">
  <summary>Table of Contents</summary>
  <ol>
    <li>
      <a href="#about-the-project">About The Project</a>
      <ul>
        <li><a href="#design-decisions">Design Decisions</a></li>
        <li><a href="#coin-api-methods">Coin API Methods</a></li>
        <li><a href="#coin-api-response-types">Coin API Response Types</a></li>
      </ul>
    </li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#requirements">Requirements</a></li>
        <li><a href="#installation">Installation</a></li>
      </ul>
    </li>
    <li>
        <a href="#usage">Usage</a>
        <ul>
            <li><a href="#coin-cli-commands">Coin CLI Commands</a></li>
        </ul>
    </li>
    <li>
        <a href="#test">Test</a>
    </li>
    <li>
        <a href="#further-work">Further Work</a>
    </li>
  </ol>
</details>


## About The Project

The project includes an API to calculate and keep Coin change for a vending machine and an interactive test harness to play with it.

### Design Decisions

The Coin API solves the following problems
1. Initialise the vending machine to a known state with given coins <br>
This solved by keeping coins in a HashMap in the Coin API. HashMap has complexity of O(1) for insertion and lookup. Because of this reason it is preferred.<br><br>
2. Register coins that have been deposited by a user <br>
Coins from a user added into machine coins whilst user coins also saved separately in an array. The reason to keep user coins sperately is to return them back in case of a request results with an error. Not enough change, not enough user coins to buy etc.<br><br>
3. Return the correct change to a user as coins when an order is received <br>
Although a classic HashMap doesn't keep the order, Object is used as a HashMap and the order is preserved in small to bigger coin types.
To be able to find least number of coins for a change the hashmap is iteratred in reverse order starting from the biggest coin or if the change amount is bigger starts from the change. The time complexity for getChange method is O(N), N is the number of coin types. 
The buy method returns the least amount of change if it is not possible to return change or user does not insert enough coins to buy, the method retuns error message and it returns all the coins user inserted by using insert method.
<br><br>

### Coin API Methods 

| Method            	| Operation                                                      	| Parameter        	| Response    	| Success        	| Error                       	|
|-------------------	|----------------------------------------------------------------	|------------------	|-------------	|----------------	|-----------------------------	|
| initialiseMachine 	| Initialises the machine with given coins.                      	| coins: Coin[]    	| CoinMessage 	|                	|                             	|
| reset             	| Resets all the API state.                                      	|                  	| CoinMessage 	|                	|                             	|
| registerUserCoins 	| Accepts user coins in the machine.                             	| coins: Coin[]    	| CoinMessage 	|                	|                             	|
| buy               	| Returns the correct change and removes coins from the machine. 	| amount: Number   	| CoinMessage 	| Returns change 	| Returns all user coins back 	|
| checkCoinAmount   	| Returns the amount of the specified coin.                      	| coinType: Number 	| CoinMessage 	|                	|                             	|
| printMachineCoins 	| Prints the contents of the machine.                            	|                  	| CoinMessage   |                	|                             	|

<br><br>

### Coin API Response Types 
The response type CoinMessage is an object that carries the following properties: <br>
```javascript
{
  result: 'Success' | 'Error',
  message: String,
  data: Coin[] | Number
}
```
The response type Coin is an object that has the following properties: <br>
```javascript
{
  type: Number
  amount: Number
}
```
## Getting Started

### Requirements

The project works on Node version 12.x and greater. Before installation make sure to have Node.js (>=12.0.0) installed.

### Installation

Run the following commands to install the project and start the Coin CLI.
```bash
git clone https://github.com/nilkrdg/coin-change.git

cd coin-change

npm install 

npm run start
```
## Usage

The project includes an interactive test harness (CLI). 

You can list all CLI commands:
```bash
help
```
You can list details of a CLI command:
```bash
help init
```

To initialise the machine:
```bash
init --coin-types 1,2,5 --coin-amounts 2,4,2
```
Output:
```
Success
Coins in the machine:
{ '1': 2, '2': 4, '5': 2 }
```
<br>

To initialise the machine with short form:
```bash
init -ct 1,2,5 -ca 2,4,2
```

To insert coins into the machine:
```bash
insert --coin-types 1,2,5 --coin-amounts 2,4,2
```
Output:
```
Success
Coins in the machine:
{ '1': 4, '2': 8, '5': 4 }
```
<br>

To insert coins into the machine with short form:
```bash
insert -ct 1,2,5 -ca 2,4,2
```
---
**NOTE**
Please be aware of the number of coin types and the number of coin amounts must be equal!

---
<br>


To buy a product and receive correct change:
```bash
buy --amount 10
```

To buy a product and receive correct change with short form:
```bash
buy -a 10
```
Output:
```
Success
Change:
[ { type: 5, amount: 2 } ]
Coins in the machine:
{ '1': 4, '2': 8, '5': 2 }
```

### Coin CLI Commands

| Command 	| Arguments                                          	| Arguments short form           	| Operation                                                                                       	|
|---------	|----------------------------------------------------	|--------------------------------	|-------------------------------------------------------------------------------------------------	|
| init    	| --coin-types Number[] <br> --coin-amounts Number[] 	| -ct Number[] <br> -ca Number[] 	| Initializes the machine with given coins.                                                       	|
| insert  	| --coin-types Number[] <br> --coin-amounts Number[] 	| -ct Number[] <br> -ca Number[] 	| Accepts user coins in the machine.                                                              	|
| buy     	| --amount Number                               	| -a Number                 	| Returns the correct change and removes coins from the machine.                                  	|
| coin    	| --type Number                                 	| -t Number                 	| Returns the amount of the specified coin.                                                       	|
| reset   	|                                                    	|                                	| Resets all the API state.                                                                       	|
| print   	|                                                    	|                                	| Prints all the coins in the machine.                                                            	|
| quit    	|                                                    	|                                	| Terminates the Coin CLI.                                                                        	|
| help    	|                                                    	|                                	| Prints the list of commands. If command name argument is present print the details of the command. 	|


<br><br>

## Test

Run the following command to execute tests:
```bash
npm test
```

<br><br>

## Further Work

* There is need to add tests for CLI and Parser modules.
* More cases should be covered by Coin Module tests.
* getChange method performance could be improved. Although getChange method time complexity is O(n), the performance reduces if the amount parameter is too big. 
