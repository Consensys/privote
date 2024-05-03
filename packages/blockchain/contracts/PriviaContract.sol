// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "./Verifier.sol";

contract PrivoteContract is Verifier {
    string public trustedPartyKey;

    constructor(string memory _trustedPartyKey) {
        trustedPartyKey = _trustedPartyKey;
    }

    struct Player {
        string publicKey;
    }

    struct Privote {
        uint256 id;
        address owner;
        string title;
        string description;
        string[] choices;
        uint8 maxPlayers;
    }

    struct Vote {
        string voter;
        string encryptedVote;
    }

    struct Result {
        string choice;
        uint8 votes;
    }

    mapping(uint256 => Privote) public privotes;
    mapping(uint256 => bool) public isClosed;
    mapping(uint256 => string) public voters;
    mapping(uint256 => bool) public nullifiers;
    mapping(uint256 => Vote[]) public votes;
    mapping(uint256 => Result[]) public results;

    uint256 public privoteCount = 0;

    event PrivoteCreated(Privote newPrivote);
    event VoterRegistered(Privote privote, string voterPublicKey);
    event VoteReceived(Privote privote);
    event ResultsPublished(uint256 id, Result[] results);

    function create(
        string memory title,
        string memory description,
        string[] memory choices
    ) public {
        Privote storage newPrivote = privotes[privoteCount];
        newPrivote.id = privoteCount;
        newPrivote.title = title;
        newPrivote.description = description;
        newPrivote.owner = msg.sender;
        newPrivote.choices = choices;

        isClosed[privoteCount] = false;

        privoteCount++;

        emit PrivoteCreated(newPrivote);
    }

    // function registerPlayer(uint256 id, string memory playerPublicKey) public {
    //     Privote storage Privote = Privotes[id];
    //     Privote.players.push(Player({publicKey: playerPublicKey}));
    //     emit PlayerRegistered(Privote, playerPublicKey);
    // }

    function submitVote(
        uint256 id,
        string memory voter,
        string memory encryptedVote
    ) public {
        // check if ballot exists
        // check if option exists
        // verify zkp on the vote

        require(isClosed[id] == false, "Privote is closed");

        Vote memory newVote = Vote({encryptedVote: encryptedVote, voter: voter});

        votes[id].push(newVote);

        emit VoteReceived(privotes[id]);
    }

    function getPrivotes() public view returns (Privote[] memory) {
        Privote[] memory result = new Privote[](privoteCount);
        for (uint256 i = 0; i < privoteCount; i++) {
            result[i] = privotes[i];
        }
        return result;
    }

    function getPrivote(uint256 id) public view returns (Privote memory) {
        return privotes[id];
    }

    function getVotesByPrivote(
        uint256 id
    ) public view returns (Vote[] memory) {
        return votes[id];
    }

    function publishResults(
        Verifier.Proof memory proof,
        uint[12] memory input,
        uint256 privoteId,
        Result[] memory result
    ) public {
        require(
            privotes[privoteId].owner == msg.sender,
            "Privote is not owned by the caller"
        );

        bool isVerified = verifyTx(proof, input);
        if (!isVerified) {
            revert("Invalid proof");
        }

        for (uint i = 0; i < result.length; i++) {
            results[privoteId].push(result[i]);
        }
        emit ResultsPublished(privoteId, result);

        isClosed[privoteId] = true;
    }

    function getResultsByPrivote(
        uint256 id
    ) public view returns (Result[] memory) {
        require(isClosed[id] == true, "Privote is not closed");
        return results[id];
    }
}
