// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.20;


import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";


contract MultisigFactory {
 
  event NewMultisigVault(address indexed _contract);
  
    function deployWallet (address[] memory _owners, uint8 _required) external  {
        address wallet = address(new MultisigVault(_owners, _required));
        
        emit NewMultisigVault(wallet);
     }

}



contract Multisig is IERC721Receiver {
  address[] public owners;
  uint8 immutable required;
  mapping(address => bool) private isOwner;


  struct Transaction {
      uint value;
      address to;
      bytes data;
      uint txNumber;
      bool isToken;
      bool isNFT;
      address token;
    }
//Editional data for Token send

  Transaction[] private transactions;

  uint private txCounter;  
  mapping(uint => mapping(address => bool)) private allowances;  
  mapping(uint => uint8) public approvals;
  mapping(uint => bytes32) public txHashData;


    constructor (
      address[] memory _owners,
      uint8 _required
    ) {

      require(_required <= _owners.length, "wrong amount of signers");
      
      for(uint8 i; i < _owners.length; ++i) {
          address account = _owners[i];

          if(account == address(0)) { 
          revert WrongAddressError(account);
        }
          require(!isOwner[account], "address not unique");

          isOwner[account] = true;
          owners.push(account);
      }

      transactions.push(Transaction({
         value: 0,
         to: address(this),
         data: bytes("genesis"),
         txNumber: 0,
         isToken: false,
         isNFT: false, 
         token: address(0)
    }));
      required = _required;
      approvals[0] = 99;

    }

    receive() external payable {
      emit Deposit(msg.sender, msg.value);
    }

    modifier onlyOwner() {
      if(!isOwner[msg.sender]) {
        revert NotAnOwnerError(msg.sender);
      }
        _;
    }

    modifier isExist(uint _txId) {
      if(txHashData[_txId] == bytes32(0)) {
        revert TxNotExistError(_txId);
      }
        _;
    }

    modifier isApproved (uint _Id) {
        if(approvals[_Id] != required) {
          revert NotEnoughApprovalsError(_Id, required);
      }
        _;  
    }


    event Deposit(address account, uint value);
    event Approve(address owner, uint txId);
    event Transfer(uint indexed _txId, address _to, uint value);
    event Revoke(uint indexed _txId);  


    error NotEnoughApprovalsError(uint _txId, uint8 _required);
    error WrongAddressError(address account);
    error InsufficientBalanceError(uint value);
    error NotAnOwnerError(address account);
    error TxNotExistError(uint _txId);
    error TxFailedError(address _token);


    function onERC721Received(address operator, address from, uint256 tokenId, bytes calldata data) external pure returns(bytes4) {
      return IERC721Receiver.onERC721Received.selector;
    }

    function etherBalance() public view returns(uint) {
      return address(this).balance;
    }

    function ERC20Balance (address _token) public view returns(uint) {
        if (_token == address(0)) {
          revert WrongAddressError(_token);
        }
      (bool success, bytes memory balance) = _token.staticcall(
        abi.encodeWithSignature("balanceOf(address)", address(this)));
        
        if(!success) { revert TxFailedError(_token); }

      uint res = abi.decode(balance, (uint));
      return res;
    }

    function ERC721Balance (address _token) public view returns(uint) {
        if (_token == address(0)) {
          revert WrongAddressError(_token);
        }
      (bool success, bytes memory balance) = _token.staticcall(
        abi.encodeWithSignature("balanceOf(address)", address(this)));
      
       if(!success) { revert TxFailedError(_token); }

      uint _balance = abi.decode(balance, (uint));

      return _balance;
    } 

    function createTx(
      uint _value,
      address _to,
      bytes memory _data,
      bool _isToken,
      bool _isNFT,
      address _token
     ) external onlyOwner {
      
      if(!_isToken) {
        if(_value > etherBalance()) { revert InsufficientBalanceError(_value); }
       } 
       else {
        if(_value > ERC20Balance(_token) ||
        _value > ERC721Balance(_token)) 
        { revert InsufficientBalanceError(_value); }
        
        }
        
        if (_to == address(0) &&
        _token == address(0)) {
          revert WrongAddressError(address(0));
        } 

        txCounter++;
        transactions.push(Transaction({
           value: _value,
           to: _to,
           data: _data,
           txNumber: txCounter,
           isToken: _isToken,
           isNFT: _isNFT,  
           token: _token
        }));
      
      bytes32 txHash_ = keccak256(abi.encodePacked(_value, _to, _data, txCounter, _isToken, _isNFT, _token));
      txHashData[txCounter] = txHash_;  
    }

    function approveTx (uint _txId) external onlyOwner isExist(_txId) {
      require(!allowances[_txId][msg.sender], "already approved");
            
            allowances[_txId][msg.sender] = true;
            approvals[_txId] += 1;

      emit Approve(msg.sender, _txId);
    }

    function submitTx(uint _txId) public onlyOwner isExist(_txId) isApproved(_txId) {
      Transaction memory txData = transactions[_txId];
      
      approvals[_txId] = 0;
      txHashData[_txId] = bytes32(0);
        
        if(txData.isToken) {

        _submitTxToken(txData.token, txData.to, txData.value, txData.isNFT);

      } else {

          (bool ok, ) = txData.to.call{value: txData.value}(txData.data);
            require(ok, "Tx failed");

      }
      
      delete transactions[_txId];

      emit Transfer(_txId, txData.to, txData.value);  
  }

    function revokeTx (uint _txId) external onlyOwner isExist(_txId) isApproved(_txId) {
        
        approvals[_txId] = 0;
        txHashData[_txId] = bytes32(0);
        delete transactions[_txId];

        emit Revoke(_txId);   
  }

  function _submitTxToken(
    address _token,
    address _to, 
    uint _value,
    bool _isNFT
    ) internal {
      if(!_isNFT) {
        (bool ok, ) = _token.call(abi.encodeWithSignature("transfer(address,uint256)", _to, _value));
         if(!ok) { revert TxFailedError(_token); }
        
      } else {
        (bool ok, ) = _token.call(abi.encodeWithSignature("transferFrom(address,address,uint256)", address(this), _to, _value));
        if(!ok) { revert TxFailedError(_token); }
      
      }  

    }
}
