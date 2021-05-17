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
This is solved by keeping coins in a HashMap in the Coin API. HashMap has complexity of O(1) for insertion and lookup because of this reason it is preferred.<br><br>
2. Register coins that have been deposited by a user <br>
When the user inserts coins into the machine, the user coins are saved in an array in memory. The reason to keep the user coins seperate is to return them back in case a request results in an error (e.g. not enough coins for change, not enough user coins to buy etc.).<br><br>
3. Return the correct change to a user as coins when an order is received <br>
Although a classic HashMap doesn't keep the order, a JavaScript Object is used as a HashMap and the order is preserved in small to bigger coin types.
To be able to find least number of coins for change, the hashmap is iterated over in reverse order. The iteration starts from the biggest coin or if the change amount is bigger than all coin types, it starts from the change amount. The time complexity for the getChange method is O(N) where N is the number of coin types.
<br><br>
The buy method returns change using the least amount of coins. If there are not enough coins in the machine or the user does not insert enough coins to buy, the method returns an error message alongside all the coins the user inserted.
<br><br>

### Coin API Methods 

| Method            	| Operation                                                      	| Parameter        	| Response    	| Response Data   |
|-------------------	|----------------------------------------------------------------	|------------------	|-------------	|----------------	|
| initialiseMachine 	| Initialises the machine with the given coins.                   | coins: Coin[]    	| CoinResponse 	|      None       |
| reset             	| Resets the machine and all the API states.                      |       None        | CoinResponse 	|      None       | 
| registerUserCoins 	| Accepts user coins into the machine.                            | coins: Coin[]    	| CoinResponse 	|      None       |
| printUserCoins 	    | Prints user coins.                                              | None             	| CoinResponse 	|      None       |
| buy               	| Returns the correct change and removes coins from the machine. 	| amount: Number   	| CoinResponse 	| On Success: change <br> On Error: user coins |
| checkCoinAmount   	| Returns the amount of the specified coin.                      	| coinType: Number 	| CoinResponse 	| On Success: Coin amount |
| printMachineCoins 	| Prints the contents of the machine.                            	|         None      | CoinResponse   |      None       |

<br><br>

### Coin API Response Types 
The response type CoinResponse is an object that carries the following properties: <br>
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

The project works on Node version 12.x and greater. Before installation make sure to have [Node.js](https://nodejs.org/en/download/) (>=12.0.0) installed.

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
Coins inserted by user:
[ { type: 1, amount: 2 }, { type: 2, amount: 4 }, { type: 5, amount: 2 }]
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
| init    	| --coin-types Number[] <br> --coin-amounts Number[] 	| -ct Number[] <br> -ca Number[] 	| Initialises the machine with given coins.                                                       	|
| insert  	| --coin-types Number[] <br> --coin-amounts Number[] 	| -ct Number[] <br> -ca Number[] 	| Accepts user coins in the machine.                                                              	|
| buy     	| --amount Number                               	| -a Number                 	| Returns the correct change and removes coins from the machine.                                  	|
| coin    	| --type Number                                 	| -t Number                 	| Returns the amount of the specified coin.                                                       	|
| reset   	|                                                    	|                                	| Resets all the API state.                                                                       	|
| print   	|                                                    	|                                	| Prints all the coins in the machine.                                                            	|
| quit    	|                                                    	|                                	| Terminates the Coin CLI.                                                                        	|
| help    	|                                                    	|                                	| Prints the list of commands. If command name argument is present, prints the details of the command. 	|


<br><br>

## Test

Run the following command to execute tests:
```bash
npm test
```

<br><br>

## Further Work

* There is need to add tests for CLI module.
* More cases should be covered by Coin and Parser Module tests.
