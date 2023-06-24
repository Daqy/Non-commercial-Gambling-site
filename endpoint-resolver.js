require("dotenv").config();

const { mongodb } = require("./database.js");
const { localStore } = require("./localStore.js");
const { ObjectId } = require("mongodb");

const storage = () => {
  if (process.env.LOCAL) {
    console.log("this?");
    return localStore;
  } else {
    return mongodb;
  }
};

const endpoints = {
  async getUser(key, query) {
    return await storage().searchFor("users", {
      [key]: key === "_id" ? new ObjectId(query) : query,
    });
  },
  async createUser(userInfo) {
    const { insertedId } = await storage().create("users", userInfo);
    return { _userid: insertedId };
  },
  async updateUserClaim(userid) {
    const _date = new Date(Date.now());
    const time = _date.setDate(_date.getDate() + 1);

    return await storage().update("users", {
      id: new ObjectId(userid),
      key: "claimExpiresTimestamp",
      value: time,
    });
  },
  async getUserGames(userid) {
    return await storage().searchAllFor("games", {
      belongsTo: new ObjectId(userid),
    });
  },
  async getGame(id) {
    return await storage().searchFor("games", {
      _id: new ObjectId(id),
    });
  },
  async updateBalance(userid, balance) {
    return await storage().update("users", {
      id: new ObjectId(userid),
      key: "balance",
      value: balance,
    });
  },
  async updateClaimedGame(id) {
    return await storage().update("games", {
      id: new ObjectId(id),
      key: "hasClaimed",
      value: true,
    });
  },
  async getClicks(gameid) {
    return (await this.getGame(gameid)).clicks;
  },

  async addClick(gameid, click) {
    const clicks = await this.getClicks(gameid);
    clicks.push(click);
    return await storage().update("games", {
      id: new ObjectId(gameid),
      key: "clicks",
      value: clicks,
    });
  },
  async getNextClick(gameid) {
    return (await this.getGame(gameid)).nextClick;
  },
  async updateNextClick(gameid, click) {
    await storage().update("games", {
      id: new ObjectId(gameid),
      key: "nextClick",
      value: click,
    });

    return this.getNextClick(gameid);
  },
  async updateGameState(id, state, result) {
    await storage().update("games", {
      id: new ObjectId(id),
      key: "state",
      value: state,
    });
    await storage().update("games", {
      id: new ObjectId(id),
      key: "result",
      value: result,
    });
    return await this.getGame(id);
  },
  async getStake(id) {
    return (await this.getGame(id)).stake;
  },
  async updateGamePool(id, earned) {
    const pool = (await this.getGame(id)).pool;
    await storage().update("games", {
      id: new ObjectId(id),
      key: "pool",
      value: pool + earned,
    });
    return (await this.getGame(id)).pool;
  },
  async createGame(data) {
    data.belongsTo = new ObjectId(data.belongsTo);
    const { insertedId } = await storage().create("games", data);
    return { gameid: insertedId };
  },
  async addSession(token) {
    return await storage().create("sessions", { token });
  },
  async getSession(token) {
    return await storage().searchFor("sessions", { token: token });
  },
  async removeSession(token) {
    return await storage().delete("sessions", { token: token });
  },
};

module.exports.database = endpoints;
