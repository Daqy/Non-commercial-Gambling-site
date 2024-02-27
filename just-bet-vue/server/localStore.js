// const { db } = require("./store.json");
// const { json } = require("body-parser");
const fs = require("fs");

function readLocalStore() {
  try {
    return JSON.parse(fs.readFileSync("store.json"));
  } catch (error) {
    console.log(error);
  }
  return undefined;
}

//to do
// fs.writeFileSync('./newCustomer.json', jsonString)

const endpoints = {
  async searchFor(_collection, _query) {
    try {
      // return "failed";
      const db = readLocalStore();
      console.log();
      console.log(db);
      return db[_collection].filter((item) => {
        const itemKeys = Object.keys(item);
        const queryKeyts = Object.keys(_query).map((value) => {
          if (itemKeys.includes(value) && item[value] === _query[value]) {
            return item;
          } else {
            return undefined;
          }
        });

        return queryKeyts.reduce((prev, current) => {
          if (!(current && prev)) return [];
          return prev;
        });
        // item;
      })[0];
    } catch (error) {
      console.log(error);
    }
  },
  // async searchAllFor(_collection, _query) {
  //   try {
  //     return await client
  //       .db(process.env.DB_NAME)
  //       .collection(_collection)
  //       .find(_query)
  //       .toArray();
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // async create(_collection, _data) {
  //   try {
  //     return await client
  //       .db(process.env.DB_NAME)
  //       .collection(_collection)
  //       .insertOne(_data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // async update(_collection, _data) {
  //   try {
  //     return await client
  //       .db(process.env.DB_NAME)
  //       .collection(_collection)
  //       .updateOne(
  //         { _id: _data.id },
  //         {
  //           $set: {
  //             [_data.key]: _data.value,
  //           },
  //         }
  //       );
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
  // async delete(_collection, _query) {
  //   try {
  //     return await client
  //       .db(process.env.DB_NAME)
  //       .collection(_collection)
  //       .deleteOne(_query);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // },
};

// async function test() {
//   console.log(
//     await endpoints.searchFor("users", { token: "test", user: "klaidas" })
//   );
// }

// test();

module.exports.localStore = endpoints;
