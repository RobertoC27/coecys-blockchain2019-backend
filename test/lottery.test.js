const Lottery = artifacts.require('Lottery');

contract('Lottery', accounts => {
  let instance, nuevo;
  
  before(async () => {
    instance = await Lottery.deployed();
    nuevo = await Lottery.new({from: accounts[1]})
    
  });

  it('Should record owner', async () => {
    let storedOwner = await instance.owner.call();
    assert.equal(storedOwner, accounts[0], 'failed storing')
  });

  it('should allow players to enter with minimum amount', async () => {
    await instance.enterLottery({from: accounts[0], value: web3.utils.toWei('1', 'ether')});
    // console.log(await web3.eth.getBalance(accounts[0]));
  });
  
  it('allows multiple players', async() => {
    const prevBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[1]), 'ether');
    
    await Promise.all([
      instance.enterLottery({from: accounts[2], value: web3.utils.toWei('1', 'ether')}),
      instance.enterLottery({from: accounts[1], value: web3.utils.toWei('1', 'ether')}),
      instance.enterLottery({from: accounts[3], value: web3.utils.toWei('1', 'ether')})
    ])
    const newBalance = web3.utils.fromWei(await web3.eth.getBalance(accounts[1]), 'ether');

    assert(newBalance < prevBalance)

  });

  it('records players', async () => {
    let firstPlayer = await instance.players.call(0);
    assert.equal(firstPlayer, accounts[0]);
  });

  it('picks winner', async () => {
    
    await Promise.all([
      nuevo.enterLottery({from: accounts[0], value: web3.utils.toWei('1', 'ether')}),
      nuevo.enterLottery({from: accounts[1], value: web3.utils.toWei('1', 'ether')}),
      nuevo.enterLottery({from: accounts[2], value: web3.utils.toWei('1', 'ether')})
    ])
    await nuevo.pickWinner({from: accounts[1]});
    
  });
})