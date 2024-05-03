// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

contract PriviaContractOld {
    struct Question {
        string title;
        string[] choices;
        string correctChoice; // encrypted index of the correct choice
    }

    struct Answer {
        string player;
        string encryptedAnswer;
    }

    struct Result {
        string player;
        uint8 score;
    }

    struct Privia {
        uint256 id;
        address owner;
        string title;
        string description;
        string trustedPartyKey;
        Question[] questions;
        string players;
        bool isClosed;
    }

    mapping(uint256 => Privia) public privias;
    mapping(bytes32 => bool) public nullifiers;
    mapping(uint256 => Answer[]) public priviaAnswers;
    mapping(uint256 => Result[]) public priviaResults;

    uint256 public priviaCount = 0;

    event PriviaCreated(Privia newPrivia);
    event AnswerReceived(Privia privia, string playerPublicKey, string answers);

    function create(
        string memory title,
        string memory description,
        Question[] memory questions,
        string memory trustedPartyKey
    ) public {
        Privia storage newPrivia = privias[priviaCount];
        newPrivia.id = priviaCount;
        newPrivia.title = title;
        for (uint i = 0; i < questions.length; i++) {
            newPrivia.questions.push(questions[i]);
        }
        newPrivia.description = description;
        newPrivia.trustedPartyKey = trustedPartyKey;
        newPrivia.owner = msg.sender;
        
        priviaCount++;

        emit PriviaCreated(newPrivia);
    }

    function answer(
        uint256 id,
        string memory playerPublicKey,
        string memory encryptedAnswer
    ) public {
        // check if ballot exists
        // check if option exists
        // verify zkp on the vote
        Answer[] storage answers = priviaAnswers[id];

        answers.push(
            Answer({player: playerPublicKey, encryptedAnswer: encryptedAnswer})
        );

        emit AnswerReceived(privias[id], playerPublicKey, encryptedAnswer);

        // if zkp is valid, update the merkle tree

        // if zkp is invalid, throw error
    }

    function getPrivias() public view returns (Privia[] memory) {
        Privia[] memory result = new Privia[](priviaCount);
        for (uint256 i = 0; i < priviaCount; i++) {
            result[i] = privias[i];
        }
        return result;
    }

    function getPrivia(uint256 id) public view returns (Privia memory) {
        return privias[id];
    }

    function getAnswersByPrivia(
        uint256 id
    ) public view returns (Answer[] memory) {
        return priviaAnswers[id];
    }

    function publishResults(uint256 id, Result[] memory result) public {
        // check if the privia is closed
        // check if the privia is owned by the caller
        // publish the results
        for (uint i = 0; i < result.length; i++) {
            priviaResults[id].push(result[i]);
        }
    }

    function getResultsByPrivia(
        uint256 id
    ) public view returns (Result[] memory) {
        return priviaResults[id];
    }
}
