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
  async updateMany(_collection, _data) {
    try {
      return await client
        .db(process.env.DB_NAME)
        .collection(_collection)
        .updateMany(
          {},
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
};

// export const database = endpoints;
module.exports.mongodb = endpoints;
