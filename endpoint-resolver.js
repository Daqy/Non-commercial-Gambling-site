require("dotenv").config();

const { constants } = require("./constants.js");
const { mongodb } = require("./database.js");
const { localStore } = require("./localStore.js");
const { ObjectId } = require("mongodb");

const storage = () => {
  if (process.env.LOCAL) {
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
  async getGames(gameType = "minesweeper", options) {
    return await storage().searchAllFor("games", { gameType, ...options });
  },
  async getUserGames(userid, gameType = "minesweeper") {
    const creator = await storage().searchAllFor("games", {
      belongsTo: new ObjectId(userid),
      gameType,
    });

    return creator.length > 0
      ? creator
      : await storage().searchAllFor("games", {
          "opponent.id": new ObjectId(userid),
          gameType,
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

  async addClick(gameid, click, gameType = "minesweeper") {
    if (gameType === "minesweeper") {
      const clicks = await this.getClicks(gameid);
      clicks.push(click);
      return await storage().update("games", {
        id: new ObjectId(gameid),
        key: "clicks",
        value: clicks,
      });
    } else {
      const game = await this.getGame(gameid);
      if (game.belongsTo.toString() === click.userid) {
        const clicks = game.clicks;

        const keys = Object.keys(game.opponent.ships);
        let clickInShip = false;
        for (const key of keys) {
          if (game.opponent.ships[key].includes(click.clickNumber)) {
            clickInShip = true;
          }
        }

        clicks[click.clickNumber] = clickInShip;
        return await storage().update("games", {
          id: new ObjectId(gameid),
          key: "clicks",
          value: clicks,
        });
      }

      const clicks = game.opponent.clicks;

      const keys = Object.keys(game.ships);
      let clickInShip = false;
      for (const key of keys) {
        console.log(key, game.ships[key]);

        if (game.ships[key].includes(click.clickNumber)) {
          clickInShip = true;
        }
      }

      clicks[click.clickNumber] = clickInShip;
      return await storage().update("games", {
        id: new ObjectId(gameid),
        key: "opponent.clicks",
        value: clicks,
      });
    }
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
  async updateGameType() {
    await storage().updateMany("games", {
      key: "gameType",
      value: "minesweeper",
    });
  },
  async addToGame(gameid, options) {
    options.state = constants.PREP;
    await Promise.all([
      Object.keys(options).forEach(async (element) => {
        await storage().update("games", {
          id: new ObjectId(gameid),
          key: element,
          value: options[element],
        });
      }),
    ]);
    return true;
  },
  async updateGameState(id, state, result, gameType = "minesweeper") {
    await storage().update("games", {
      id: new ObjectId(id),
      key: "state",
      value: state,
    });
    if (gameType === "minesweeper" || result === constants.CLAIMED) {
      await storage().update("games", {
        id: new ObjectId(id),
        key: "result",
        value: result,
      });
      await storage().update("games", {
        id: new ObjectId(id),
        key: "opponent.result",
        value: constants.LOST,
      });
    } else {
      await storage().update("games", {
        id: new ObjectId(id),
        key: "result",
        value: result,
      });
      await storage().update("games", {
        id: new ObjectId(id),
        key: "opponent.result",
        value: constants.CLAIMED,
      });
    }
    return await this.getGame(id);
  },
  async updateTurn(id, userid) {
    const game = await this.getGame(id);

    await storage().update("games", {
      id: new ObjectId(id),
      key: "turn",
      value:
        game.turn.toString() === userid && game.belongsTo.toString() === userid
          ? game.opponent.id
          : game.belongsTo,
    });
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
