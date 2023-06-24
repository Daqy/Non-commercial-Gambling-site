require("dotenv").config();

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = process.env.DB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function connect() {
  try {
    await client.connect();
  } catch (errors) {
    console.log(errors);
  }
}

connect();

const endpoints = {
  async searchFor(_collection, _query) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .findOne(_query);
    } catch (error) {
      console.log(error);
    }
  },
  async searchAllFor(_collection, _query) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .find(_query)
        .toArray();
    } catch (error) {
      console.log(error);
    }
  },
  async create(_collection, _data) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .insertOne(_data);
    } catch (error) {
      console.log(error);
    }
  },
  async update(_collection, _data) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .updateOne(
          { _id: _data.id },
          {
            $set: {
              [_data.key]: _data.value,
            },
          }
        );
    } catch (error) {
      console.log(error);
    }
  },
  async delete(_collection, _query) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .deleteOne(_query);
    } catch (error) {
      console.log(error);
    }
  },
  async ping() {
    try {
      await client.db("admin").command({ ping: 1 });
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB!"
      );
    } catch (error) {
      console.log(error);
    }
  },
  // async getUser(key, query) {
  //   return await this.searchFor("users", {
  //     [key]: key === "_id" ? new ObjectId(query) : query,
  //   });
  // },
  // async createUser(userInfo) {
  //   const { insertedId } = await this.create("users", userInfo);
  //   return { _userid: insertedId };
  // },
  // async getUserGames(userid) {
  //   return this.searchAllFor("games", {
  //     belongsTo: new ObjectId(userid),
  //   });
  // },
  // async getGame(id) {
  //   return this.searchFor("games", {
  //     _id: new ObjectId(id),
  //   });
  // },
  // async updateBalance(userid, balance) {
  //   return this.update("users", {
  //     id: new ObjectId(userid),
  //     key: "balance",
  //     value: balance,
  //   });
  // },
  // async updateClaimedGame(id) {
  //   return this.update("games", {
  //     id: new ObjectId(id),
  //     key: "hasClaimed",
  //     value: true,
  //   });
  // },
  // async getClicks(gameid) {
  //   return (await this.getGame(gameid)).clicks;
  // },
  // async addClick(gameid, click) {
  //   const clicks = await this.getClicks(gameid);
  //   clicks.push(click);
  //   return await this.update("games", {
  //     id: new ObjectId(gameid),
  //     key: "clicks",
  //     value: clicks,
  //   });
  // },
  // async getNextClick(gameid) {
  //   return (await this.getGame(gameid)).nextClick;
  // },
  // async updateNextClick(gameid, click) {
  //   await this.update("games", {
  //     id: new ObjectId(gameid),
  //     key: "nextClick",
  //     value: click,
  //   });

  //   return this.getNextClick(gameid);
  // },
  // async updateGameState(id, state, result) {
  //   await this.update("games", {
  //     id: new ObjectId(id),
  //     key: "state",
  //     value: state,
  //   });
  //   await this.update("games", {
  //     id: new ObjectId(id),
  //     key: "result",
  //     value: result,
  //   });
  //   return await this.getGame(id);
  // },
  // async getStake(id) {
  //   return (await this.getGame(id)).stake;
  // },
  // async updateGamePool(id, earned) {
  //   const pool = (await this.getGame(id)).pool;
  //   await this.update("games", {
  //     id: new ObjectId(id),
  //     key: "pool",
  //     value: pool + earned,
  //   });
  //   return (await this.getGame(id)).pool;
  // },
  // async createGame(data) {
  //   data.belongsTo = new ObjectId(data.belongsTo);
  //   const { insertedId } = await this.create("games", data);
  //   return { gameid: insertedId };
  // },
  // async addSession(token) {
  //   return this.create("sessions", { token });
  // },
  // async getSession(token) {
  //   return this.searchFor("sessions", { token: token });
  // },
  // async removeSession(token) {
  //   return this.delete("sessions", { token: token });
  // },
};

// export const database = endpoints;
module.exports.mongodb = endpoints;
