import * as Vault74Registry from '@/contracts/interfaces/Vault74Registry.json';
import config from '@/config/config';
import Ethereum from '@/classes/Ethereum';

const ethereum = new Ethereum('user-provided');
const address = config.registry[config.network.chain];

// Helper functions to interact with the Vault74Registry
export default {
  /** @function
   * @name getContract
   * @returns returns a contract instance of the registry
   */
  getContract() {
    const contract = (window.web3) ?
      new window.web3.eth.Contract(Vault74Registry.abi, address) :
      ethereum.getContract(Vault74Registry.abi, address);
    contract.options.data = Vault74Registry.data.bytecode.object;
    return contract;
  },
  /** @function
   * @name createDwellerId
   * @argument _username username to set for the inital vaule on contract
   * @argument account account to send the transaction from
   * @argument tx callback executed on first transaction
   * @argument done callback executed on first confirmation
   */
  createDwellerId(_username, account, tx, done) {
    const username = ethereum.utils.fromAscii(_username);
    const contract = this.getContract();
    contract.methods.createDweller(username)
      .send({
        from: account,
        gas: 4700000,
      })
      .once('transactionHash', tx)
      .once('confirmation', done);
  },
  /** @function
   * @name getDwellerContract
   * @argument account account to send the transaction from
   * @return returns the dweller contract address for a specific account
   */
  async getDwellerContract(account) {
    const contract = this.getContract();
    const dwellerAddress = await contract.methods.getDwellerId(account).call();
    return dwellerAddress;
  },
};
