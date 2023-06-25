require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const https = require("https").Server(app);
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPSPORT || 8000;
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

// const { fromServer } = require("./endpoint-handler.js");
// const { database } = require("./database.js");
const { database } = require("./endpoint-resolver.js");
// const { localStore } = require("./localStore.js");
const auth = require("./middleware/auth.js");
const { constants } = require("./constants.js");

// const SnowflakeId = require("snowflake-id").default;

// const snowflake = new SnowflakeId({
//   offset: (2020 - 1970) * 31536000 * 1000,
// });

// const cookieConfig = {
//   secure: true,
//   httpOnly: true,
//   sameSite: "lax",
// };

// app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.static(__dirname + "/dist/assets"));

app.use(
  cors({
    // origin: "http://127.0.0.1:5174",
    // origin: "http://86.6.5.217",
    origin: "https://daqy.dev",
  })
);

app.post("/api/auth", auth, async (req, res) => {
  const token =
    req.body.token ||
    req.query.token ||
    req.params.token ||
    req.headers["x-access-token"] ||
    req.cookies.token;
  res.status(200).send({ token });
});

app.post("/api/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!(username && password && email)) {
      return res.status(400).send("All input are required");
    }

    const userExist = await database.getUser("email", email);
    if (userExist) {
      return res.status(409).send("User Already Exist. Please Login");
    }

    const encryptedPassword = await bcrypt.hash(password, 10);

    // Create user in our database
    const { _userid } = await database.createUser({
      username,
      email: email.toLowerCase(),
      password: encryptedPassword,
      balance: 100,
      claimExpiresTimestamp: 0,
    });

    const token = jwt.sign({ _userid, username }, process.env.TOKEN_KEY, {
      expiresIn: "1h",
    });

    await database.addSession(token);

    return res
      .cookie("token", token, { httpOnly: true })
      .status(201)
      .json({ token });
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input are required");
    }
    if (!username.includes("@")) {
      res.status(400).send("cannot login with username");
    }
    const user = await database.getUser(
      username.includes("@") ? "email" : "username",
      username
    );

    if (!(user && (await bcrypt.compare(password, user.password)))) {
      return res.status(400).send("Invalid Credentials");
    }
    // Create token
    const token = jwt.sign(
      { _userid: user._id, username: user.username },
      process.env.TOKEN_KEY,
      {
        expiresIn: "1h",
      }
    );
    await database.addSession(token);

    return res
      .cookie("token", token, { httpOnly: true })
      .status(200)
      .send({ token });
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/logout", async (req, res) => {
  try {
    const token =
      req.body.token ||
      req.query.token ||
      req.params.token ||
      req.headers["x-access-token"];

    if (!(await database.getSession(token))) {
      return res.status(400).send("failed to find session");
    }
    const removed = await database.removeSession(token);

    if (removed.deletedCount > 0) {
      return res.status(200).clearCookie("token").send("logout");
    }
    return res.status(400).send("failed to logout");
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/hello-world", auth, (req, res) => {
  res.status(200).send("Welcome 🙌");
});

app.get("/api/get-user", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    res.status(200).send({
      username: user.username,
      balance: user.balance,
    });
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/get-username", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    res.status(200).send({
      username: user.username,
    });
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/get-balance", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    res.status(200).send({
      balance: user.balance,
    });
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/game/:id", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const gameid = req.params.id;

    if (!gameid) {
      res.status(400).send("ID must be provided");
    }

    if (gameid.length != 24) {
      return res.status(400).send("A valid ID is required");
    }

    const game = await database.getGame(gameid);

    if (!game) {
      return res.status(404).send("Game does not exist");
    }

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }

    if (game.state !== "done") {
      delete game.bomb.position;
    }

    return res.status(200).send(game);
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/game/:id/bomb-locations", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const gameid = req.params.id;

    if (!gameid) {
      res.status(400).send("ID must be provided");
    }

    if (gameid.length != 24) {
      return res.status(400).send("A valid ID is required");
    }

    const game = await database.getGame(gameid);

    if (!game) {
      return res.status(404).send("Game does not exist");
    }

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }

    return res.status(200).send(game.bomb.position);
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/get-claim", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    if (!user) {
      return res.status(404).send("User not found");
    }
    if (user.claimExpiresTimestamp < new Date()) {
      return res.status(200).send({
        claimable: true,
        claimAmount: 50,
        timestamp: user.claimExpiresTimestamp,
      });
    }
    return res
      .status(200)
      .send({ claimable: false, timestamp: user.claimExpiresTimestamp });
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/claim-reward", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);
    if (!user) {
      return res.status(404).send("User not found");
    }

    if (user.claimExpiresTimestamp < new Date()) {
      const date = await database.updateUserClaim(_userid);
      if (date.modifiedCount === 0) {
        res.status(400).send("Failed to update user claim");
      }
      const updatedBalance = await database.updateBalance(
        _userid,
        user.balance + 50
      );
      if (updatedBalance.modifiedCount === 0) {
        res.status(400).send("Failed to update user balance");
      }
      const _user = await database.getUser("_id", _userid);
      return res.status(200).send({
        claimable: false,
        timestamp: _user.claimExpiresTimestamp,
        balance: _user.balance,
      });
    }
    return res
      .status(200)
      .send({ claimable: false, timestamp: user.claimExpiresTimestamp });
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/latest-game", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const game = await database.getUserGames(_userid);

    if (game.length === 0) {
      return res.status(404).send("No games found");
    }
    const latestGame = game[game.length - 1];
    if (latestGame.state !== "done") {
      delete latestGame.bomb.position;
    }
    return res.status(200).send(latestGame);
  } catch (errors) {
    console.log(errors);
  }
});

app.get("/api/game-history", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const game = await database.getUserGames(_userid);

    if (game.length === 0) {
      return res.status(404).send("No games found");
    }

    console.log(game);

    const gameHistory = game.filter((value) => value.state === constants.DONE);

    // if (latestGame.state !== "done") {
    //   delete latestGame.bomb.position;
    // }
    return res.status(200).send(gameHistory);
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/balance", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const { balance, gameid } = req.body;
    console.log("exist");
    if (!(balance && gameid) && balance !== 0) {
      return res.status(400).send("Missing balance or game id");
    }
    console.log("id");

    if (gameid.length != 24) {
      return res.status(400).send("A valid ID is required");
    }

    const game = await database.getGame(gameid);
    console.log("game");

    if (!game) {
      return res.status(404).send("Game does not exist");
    }
    console.log("userid");

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }
    //
    console.log("done");

    if (balance > 0 && game.state !== constants.DONE) {
      return res.status(400).send("Game isn't finished");
    }
    console.log(1);
    console.log("has");

    if (balance > 0 && game.hasClaimed) {
      return res.status(400).send("Game has already been claimed");
    }

    console.log("set");

    const user = await database.getUser("_id", _userid);
    const newBalance = balance + user.balance;
    const updatedBalance = await database.updateBalance(_userid, newBalance);

    if (updatedBalance.modifiedCount > 0) {
      console.log("pass");
      if (balance > 0) {
        await database.updateClaimedGame(gameid);
      }
      return res.status(200).send({ balance: newBalance });
    }
    console.log("failed");

    return res.status(400).send("Failed to update");
  } catch (errors) {
    console.log(errors);
  }
});

function getPercentageOfWining(size, nextClickCount, bombCount) {
  let total = 1;
  for (let index = 0; index < nextClickCount; index++) {
    total *= (size - bombCount - index) / (size - index);
  }
  return total;
}

app.get("/api/game/:id/click", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const gameid = req.params.id;
    const clickPosition = parseInt(req.query.clickPosition);

    if (!(gameid && clickPosition) && clickPosition != 0) {
      return res.status(400).send("Missing game id or click position");
    }

    if (gameid.length != 24) {
      return res.status(400).send("A valid ID is required");
    }

    const game = await database.getGame(gameid);

    if (!game) {
      return res.status(404).send("Game does not exist");
    }

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }

    if (game.state === constants.DONE) {
      return res.status(400).send("Game is finished");
    }

    if ((await database.getClicks(gameid)).includes(clickPosition)) {
      return res.status(400).send("Can't click the same square");
    }

    let ongoingData = {};
    let earned = 0;
    if (game.state !== constants.DONE) {
      const chanceOFWinning = getPercentageOfWining(
        game.size,
        game.clicks.length + 1,
        game.bomb.count
      );
      const pool = (1 / chanceOFWinning) * game.stake;
      earned = pool - game.pool;
      console.log(earned);

      const newPool = await database.updateGamePool(gameid, earned);
      if (newPool !== pool) {
        return res.status(400).send("miss match in game pools");
      }
      const potentialPool = getPercentageOfWining(
        game.size,
        game.clicks.length + 2,
        game.bomb.count
      );
      const nextClick = (1 / potentialPool) * game.stake - newPool;

      ongoingData = { nextClick, pool: newPool };
    }

    const click = await database.addClick(gameid, {
      position: clickPosition,
      earned: earned,
    });

    if (click.modifiedCount === 0) {
      return res.status(400).send("failed to update click");
    }

    let _game = await database.getGame(gameid);
    const clickCount = await database.getClicks(gameid);

    if (game.bomb.position.includes(clickPosition)) {
      _game = await database.updateGameState(
        gameid,
        constants.DONE,
        constants.LOST
      );
    } else if (clickCount.length === game.size - game.bomb.count) {
      _game = await database.updateGameState(
        gameid,
        constants.DONE,
        constants.CLAIMED
      );
    }

    if (_game.state === "done") {
      ongoingData = { pool: _game.pool - earned };
      await database.updateGamePool(gameid, -earned);
    } else {
      const updateNextClick = await database.updateNextClick(
        gameid,
        ongoingData.nextClick
      );
      if (!updateNextClick) {
        return res.status(400).send("failed to add next click");
      }
    }

    return res.status(200).send({
      state: _game.state,
      result: _game.result,
      pool: _game.pool,
      clicks: _game.clicks,
      ...ongoingData,
    });
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/claim-game", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const { gameid } = req.body;

    if (!gameid) {
      return res.status(400).send("Missing game id");
    }

    if (gameid.length != 24) {
      return res.status(400).send("A valid ID is required");
    }

    const game = await database.getGame(gameid);

    if (!game) {
      return res.status(404).send("Game does not exist");
    }

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }

    if (game.state === "done") {
      return res.status(400).send("Game already claimed");
    }
    console.log(game);
    if (game.clicks.length === 0) {
      return res.status(400).send("Must click at least once");
    }

    const _game = await database.updateGameState(
      gameid,
      constants.DONE,
      constants.CLAIMED
    );
    return res.status(200).send(_game);
  } catch (errors) {
    console.log(errors);
  }
});

// app.get("/api/game/:id/getState")

function randomIntFromInterval(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function generateBombLocation(bombCount) {
  const usedValues = [];

  return Array.from(Array(bombCount).keys())
    .map((value) => {
      let newValue = randomIntFromInterval(1, 25);
      while (usedValues.indexOf(newValue) !== -1) {
        newValue = randomIntFromInterval(1, 25);
      }
      usedValues.push(newValue);
      return newValue;
    })
    .sort((a, b) => 0.5 - Math.random());
}

app.post("/api/create-game", auth, async (req, res) => {
  const { _userid } = req.user;
  const { bombCount, stake } = req.body;

  console.log(bombCount, stake);
  if (!(bombCount && stake)) {
    return res.status(400).send("Missing bombcount or stake");
  }
  console.log("test");

  const usergames = await database.getUserGames(_userid);

  const ongoingGame = usergames.filter(
    (game) => game.state === constants.ONGOING
  );

  if (ongoingGame.length > 0) {
    return res.status(400).send("User already in a game");
  }
  const potentialPool = getPercentageOfWining(25, 1, bombCount);

  const nextClick = (1 / potentialPool) * stake - stake;

  const game = {
    belongsTo: _userid,
    state: constants.ONGOING,
    size: 25,
    bomb: {
      position: generateBombLocation(bombCount),
      count: bombCount,
    },
    stake,
    clicks: [],
    pool: stake,
    nextClick,
  };

  const gameid = await database.createGame(game);

  res.status(200).send(gameid);
});

app.get("/*", (req, res) => {
  // res.send("hello");
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
// app.use(express.static(__dirname + "/dist/assets"));

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});

// https.listen(httpsPort, function () {
//   console.log(`listening on *:${httpsPort}`);
// });
// app.get("/api/get-username", async function (req, res) {
//   const userID = req.query.userid;
//   const username = await fromServer().getUsername(userID).ifError([]);

//   res.status(200).send(username);
// });

// app.get("/api/game/:id/getStake")
// app.get("/api/game/:id/getNextClickReward")
// app.get("/api/game/:id/getPotential")
// app.post("/api/game/:id/updateState")
// app.get("/api/game/:id/getBombCount")
