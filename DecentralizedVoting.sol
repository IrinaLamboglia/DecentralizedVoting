// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

contract DecentralizedVoting {

    struct Candidate {
        string name;
        uint256 voteCount;
    }

    address public owner;
    bool public votingOpen;
    string public electionName;

    Candidate[] public candidates;
    mapping(address => bool) public hasVoted;

    event Voted(address indexed voter, uint256 candidateIndex);
    event VotingStarted();
    event VotingEnded();

    modifier onlyOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto");
        _;
    }

    modifier whenOpen() {
        require(votingOpen, "La votacion esta cerrada");
        _;
    }

    constructor(string memory _electionName, string[] memory _candidateNames) {
        owner = msg.sender;
        electionName = _electionName;
        votingOpen = false;
        for (uint256 i = 0; i < _candidateNames.length; i++) {
            candidates.push(Candidate({ name: _candidateNames[i], voteCount: 0 }));
        }
    }

    function startVoting() public onlyOwner {
        votingOpen = true;
        emit VotingStarted();
    }

    function endVoting() public onlyOwner {
        votingOpen = false;
        emit VotingEnded();
    }

    function vote(uint256 candidateIndex) public whenOpen {
        require(!hasVoted[msg.sender], "Ya votaste en esta eleccion");
        require(candidateIndex < candidates.length, "Candidato invalido");
        hasVoted[msg.sender] = true;
        candidates[candidateIndex].voteCount++;
        emit Voted(msg.sender, candidateIndex);
    }

    function getCandidateCount() public view returns (uint256) {
        return candidates.length;
    }

    function getCandidate(uint256 index) public view returns (string memory name, uint256 voteCount) {
        require(index < candidates.length, "Indice invalido");
        return (candidates[index].name, candidates[index].voteCount);
    }

    function getWinner() public view returns (string memory winnerName, uint256 winnerVotes) {
        require(!votingOpen, "La votacion sigue abierta");
        uint256 maxVotes = 0;
        uint256 winnerIndex = 0;
        for (uint256 i = 0; i < candidates.length; i++) {
            if (candidates[i].voteCount > maxVotes) {
                maxVotes = candidates[i].voteCount;
                winnerIndex = i;
            }
        }
        return (candidates[winnerIndex].name, candidates[winnerIndex].voteCount);
    }
}