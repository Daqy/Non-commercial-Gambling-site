const { AResult } = require("./AResult.js");
const { __Storage } = require("./storage.js");
const {
  DefaultResolver,
  BalanceResolver,
  UpdateBalanceResolver,
  CreateGameResolver,
  CreateUserResolver,
  UsernameResolver,
  UpdateStateResolver,
  BombCountResolver,
  GetRewardResolver,
  GetGameStake,
  PotentialResolver,
  StateResolver,
} = require("./endpoint-resolver.js");

const _Storage = new __Storage();

const endpoints = {
  getUserbalance(id = undefined) {
    return new AResult(_Storage.getUserBalance(id), new BalanceResolver());
  },
  getUsername(id = undefined) {
    return new AResult(_Storage.getUsername(id), new UsernameResolver());
  },
  getGameInfo(id = undefined, auth = undefined) {
    return new AResult(_Storage.getGame(id, auth), new DefaultResolver());
  },
  getBombLocation(id = undefined, auth = undefined) {
    return new AResult(
      _Storage.getBombLocation(id, auth),
      new DefaultResolver()
    );
  },
  getPotential(id = undefined, auth = undefined) {
    return new AResult(
      _Storage.getGamePotential(id, auth),
      new PotentialResolver()
    );
  },
  getBombCount(id = undefined, auth = undefined) {
    return new AResult(
      _Storage.getBombCount(id, auth),
      new BombCountResolver()
    );
  },
  getGameState(id = undefined, auth = undefined) {
    return new AResult(_Storage.getGameState(id, auth), new StateResolver());
  },
  getGameStake(id = undefined, auth = undefined) {
    return new AResult(_Storage.getGameStake(id, auth), new GetGameStake());
  },
  getClickCount(id = undefined, auth = undefined) {
    return new AResult(_Storage.getClickCount(id, auth), new DefaultResolver());
  },
  getNextReward(id = undefined, auth = undefined) {
    return new AResult(
      _Storage.getNextReward(id, auth),
      new GetRewardResolver()
    );
  },
  UpdateClickCount(id = undefined, auth = undefined) {
    return new AResult(
      _Storage.UpdateClickCount(id, auth),
      new DefaultResolver()
    );
  },
  createGame(game = undefined) {
    return new AResult(_Storage.addGame(game), new CreateGameResolver());
  },
  createUser(user = undefined) {
    return new AResult(_Storage.addUser(user), new CreateUserResolver());
  },
  updateBalance(id = undefined, balanceChange = 0) {
    return new AResult(
      _Storage.updateBalance(id, balanceChange),
      new UpdateBalanceResolver()
    );
  },
  updateState(id = undefined, auth = undefined, state = "ongoing") {
    return new AResult(
      _Storage.updateState(id, auth, state),
      new UpdateStateResolver()
    );
  },
};

module.exports.fromServer = () => {
  return endpoints;
};
