// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Token is ERC20 {
    constructor() ERC20("Test", "TST") {
    }

    function mint(address account, uint256 amount) public {
        _mint(account, amount);
    }

    struct Message {
        uint256 id;
        address sender;
        string text;
    }

    mapping(uint256 => Message) messages;

    event MessageAdded(uint256 id, address user, string text);
    event MessageDeleted(uint256 id, address user);

    uint256 private curId = 0;

    function addMessage(string memory text) public {
        messages[curId] = Message(curId, msg.sender, text);
        emit MessageAdded(curId++, msg.sender, text);
    }

    function deleteMessage(uint256 id) public {
       require(
            messages[id].sender == msg.sender,
            "user can only delete his own messages"
        );
        delete messages[id];
        emit MessageDeleted(id, msg.sender);
    }
}
