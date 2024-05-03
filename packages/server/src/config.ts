export const config = {

      contract: {
        address: "0x5fbdb2315678afecb367f032d93f642f64180aa3" as `0x${string}`,
        abi: [
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "_trustedPartyKey",
                "type": "string"
              }
            ],
            "stateMutability": "nonpayable",
            "type": "constructor"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "choices",
                    "type": "string[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "maxPlayers",
                    "type": "uint8"
                  }
                ],
                "indexed": false,
                "internalType": "struct PrivoteContract.Privote",
                "name": "newPrivote",
                "type": "tuple"
              }
            ],
            "name": "PrivoteCreated",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "indexed": false,
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "choice",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "votes",
                    "type": "uint8"
                  }
                ],
                "indexed": false,
                "internalType": "struct PrivoteContract.Result[]",
                "name": "results",
                "type": "tuple[]"
              }
            ],
            "name": "ResultsPublished",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "choices",
                    "type": "string[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "maxPlayers",
                    "type": "uint8"
                  }
                ],
                "indexed": false,
                "internalType": "struct PrivoteContract.Privote",
                "name": "privote",
                "type": "tuple"
              }
            ],
            "name": "VoteReceived",
            "type": "event"
          },
          {
            "anonymous": false,
            "inputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "choices",
                    "type": "string[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "maxPlayers",
                    "type": "uint8"
                  }
                ],
                "indexed": false,
                "internalType": "struct PrivoteContract.Privote",
                "name": "privote",
                "type": "tuple"
              },
              {
                "indexed": false,
                "internalType": "string",
                "name": "voterPublicKey",
                "type": "string"
              }
            ],
            "name": "VoterRegistered",
            "type": "event"
          },
          {
            "inputs": [
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "string[]",
                "name": "choices",
                "type": "string[]"
              }
            ],
            "name": "create",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "getPrivote",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "choices",
                    "type": "string[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "maxPlayers",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct PrivoteContract.Privote",
                "name": "",
                "type": "tuple"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "getPrivotes",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "uint256",
                    "name": "id",
                    "type": "uint256"
                  },
                  {
                    "internalType": "address",
                    "name": "owner",
                    "type": "address"
                  },
                  {
                    "internalType": "string",
                    "name": "title",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "description",
                    "type": "string"
                  },
                  {
                    "internalType": "string[]",
                    "name": "choices",
                    "type": "string[]"
                  },
                  {
                    "internalType": "uint8",
                    "name": "maxPlayers",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct PrivoteContract.Privote[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "getResultsByPrivote",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "choice",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "votes",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct PrivoteContract.Result[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              }
            ],
            "name": "getVotesByPrivote",
            "outputs": [
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "voter",
                    "type": "string"
                  },
                  {
                    "internalType": "string",
                    "name": "encryptedVote",
                    "type": "string"
                  }
                ],
                "internalType": "struct PrivoteContract.Vote[]",
                "name": "",
                "type": "tuple[]"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "isClosed",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "nullifiers",
            "outputs": [
              {
                "internalType": "bool",
                "name": "",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "privoteCount",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "privotes",
            "outputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "address",
                "name": "owner",
                "type": "address"
              },
              {
                "internalType": "string",
                "name": "title",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "description",
                "type": "string"
              },
              {
                "internalType": "uint8",
                "name": "maxPlayers",
                "type": "uint8"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "X",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "Y",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct Pairing.G1Point",
                    "name": "a",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256[2]",
                        "name": "X",
                        "type": "uint256[2]"
                      },
                      {
                        "internalType": "uint256[2]",
                        "name": "Y",
                        "type": "uint256[2]"
                      }
                    ],
                    "internalType": "struct Pairing.G2Point",
                    "name": "b",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "X",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "Y",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct Pairing.G1Point",
                    "name": "c",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct Verifier.Proof",
                "name": "proof",
                "type": "tuple"
              },
              {
                "internalType": "uint256[12]",
                "name": "input",
                "type": "uint256[12]"
              },
              {
                "internalType": "uint256",
                "name": "privoteId",
                "type": "uint256"
              },
              {
                "components": [
                  {
                    "internalType": "string",
                    "name": "choice",
                    "type": "string"
                  },
                  {
                    "internalType": "uint8",
                    "name": "votes",
                    "type": "uint8"
                  }
                ],
                "internalType": "struct PrivoteContract.Result[]",
                "name": "result",
                "type": "tuple[]"
              }
            ],
            "name": "publishResults",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "results",
            "outputs": [
              {
                "internalType": "string",
                "name": "choice",
                "type": "string"
              },
              {
                "internalType": "uint8",
                "name": "votes",
                "type": "uint8"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "id",
                "type": "uint256"
              },
              {
                "internalType": "string",
                "name": "voter",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "encryptedVote",
                "type": "string"
              }
            ],
            "name": "submitVote",
            "outputs": [],
            "stateMutability": "nonpayable",
            "type": "function"
          },
          {
            "inputs": [],
            "name": "trustedPartyKey",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "components": [
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "X",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "Y",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct Pairing.G1Point",
                    "name": "a",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256[2]",
                        "name": "X",
                        "type": "uint256[2]"
                      },
                      {
                        "internalType": "uint256[2]",
                        "name": "Y",
                        "type": "uint256[2]"
                      }
                    ],
                    "internalType": "struct Pairing.G2Point",
                    "name": "b",
                    "type": "tuple"
                  },
                  {
                    "components": [
                      {
                        "internalType": "uint256",
                        "name": "X",
                        "type": "uint256"
                      },
                      {
                        "internalType": "uint256",
                        "name": "Y",
                        "type": "uint256"
                      }
                    ],
                    "internalType": "struct Pairing.G1Point",
                    "name": "c",
                    "type": "tuple"
                  }
                ],
                "internalType": "struct Verifier.Proof",
                "name": "proof",
                "type": "tuple"
              },
              {
                "internalType": "uint256[12]",
                "name": "input",
                "type": "uint256[12]"
              }
            ],
            "name": "verifyTx",
            "outputs": [
              {
                "internalType": "bool",
                "name": "r",
                "type": "bool"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "voters",
            "outputs": [
              {
                "internalType": "string",
                "name": "",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          },
          {
            "inputs": [
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
              }
            ],
            "name": "votes",
            "outputs": [
              {
                "internalType": "string",
                "name": "voter",
                "type": "string"
              },
              {
                "internalType": "string",
                "name": "encryptedVote",
                "type": "string"
              }
            ],
            "stateMutability": "view",
            "type": "function"
          }
        ] as const,
      },
      privia: {
        numOfChoices: 4,
        numOfQuestionsPerPrivia: 2,
      },
      privateKey: "90197137217573993317494816277450930684290259600254987370957769071777113640955",
      publicKey: "72251106076818869248830037749385029093792099102295083766556238720983311266199"
}