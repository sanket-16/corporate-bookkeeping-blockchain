// SPDX-License-Identifier: UNLICENSED

pragma solidity ^0.8.24;

contract ExpenseTracker {
    string public name;
    int256 public balance = 0;

    struct Transaction {
        address owner;
        string name;
        string description;
        uint createdAt;
        int64 amount;
    }

    Transaction[] public transactions;
    address[] public approvedAddresses;

    constructor() {
        name = "Bookkeeping  App";
        approvedAddresses.push(0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266);
        approvedAddresses.push(0xfb93Fed359293e1796a3601235227BCD195e2468);
    }

    // Read function
    function transactionCount() public view returns (uint256) {
        return transactions.length;
    }

    function getTransactions(
        uint _startDate,
        uint _endDate
    ) public view returns (Transaction[] memory) {
        require(
            _startDate <= _endDate,
            "Start date must be before or equal to end date"
        );

        uint count = transactions.length;
        uint resultCount = 0;

        for (uint i = 0; i < count; i++) {
            if (
                transactions[i].createdAt >= _startDate &&
                transactions[i].createdAt <= _endDate
            ) {
                resultCount++;
            }
        }

        Transaction[] memory resultTransactions = new Transaction[](
            resultCount
        );
        uint currentIndex = 0;

        for (uint i = 0; i < count; i++) {
            if (
                transactions[i].createdAt >= _startDate &&
                transactions[i].createdAt <= _endDate
            ) {
                resultTransactions[currentIndex] = transactions[i];
                currentIndex++;
            }
        }

        return resultTransactions;
    }

    function getRecentTransactions()
        public
        view
        returns (Transaction[] memory)
    {
        uint count = transactions.length;
        uint startIndex;

        if (count > 5) {
            startIndex = count - 5;
        } else {
            startIndex = 0;
        }

        Transaction[] memory recentTransactions = new Transaction[](
            count - startIndex
        );

        for (uint i = 0; i < recentTransactions.length; i++) {
            recentTransactions[i] = transactions[startIndex + i];
        }

        return recentTransactions;
    }

    function addTransaction(
        string memory _name,
        string memory _description,
        uint _date,
        int64 _amount
    ) public returns (bool) {
        transactions.push(
            Transaction({
                owner: msg.sender,
                name: _name,
                description: _description,
                createdAt: _date,
                amount: _amount
            })
        );
        balance += _amount;

        return true;
    }

    function getAddresses() public view returns (address[] memory) {
        return approvedAddresses;
    }

    function getAddressApproval() public view returns (bool) {
        for (uint i = 0; i < approvedAddresses.length; i++) {
            if (approvedAddresses[i] == msg.sender) {
                return true;
            }
        }
        return false;
    }

    function addAddress() public returns (address[] memory) {
        for (uint i = 0; i < approvedAddresses.length; i++) {
            if (msg.sender == approvedAddresses[i]) {
                approvedAddresses.push(msg.sender);
                return approvedAddresses;
            }
        }
        return approvedAddresses;
    }
}
