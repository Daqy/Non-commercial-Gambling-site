require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const https = require("https");
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const fs = require("fs");

const port = process.env.PORT || 3000;
const httpsPort = process.env.HTTPSPORT || 8000;
const cors = require("cors");
const helmet = require("helmet");
const cookieParser = require("cookie-parser");

const { Server } = require("socket.io");
const io = new Server(http, {
  cors: {
    // origin: "http://192.168.1.102:5173",
    origin: "http://localhost:5173",
  },
});

// const { fromServer } = require("./endpoint-handler.js");
// const { database } = require("./database.js");
const { database } = require("./endpoint-resolver.js");
// const { localStore } = require("./localStore.js");
const auth = require("./middleware/auth.js");
const { constants } = require("./constants.js");
const { ObjectId } = require("mongodb");

// const SnowflakeId = require("snowflake-id").default;

// const snowflake = new SnowflakeId({
//   offset: (2020 - 1970) * 31536000 * 1000,
// });

// const cookieConfig = {
//   secure: true,
//   httpOnly: true,
//   sameSite: "lax",
// };

app.use(helmet());
app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "dist")));
// app.use(express.static(__dirname + "/dist/assets"));

app.use(
  cors({
    origin: "http://127.0.0.1:5174",
    // origin: "http://86.6.5.217",
    // origin: "https://just-bet.daqy.dev",
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
    if (
      game.belongsTo.toString() !== _userid &&
      game.opponent.id.toString() !== _userid
    ) {
      return res.status(403).send("Unathorised access to game");
    }

    if (
      game.belongsTo.toString() !== _userid &&
      game.gameType === "battleships"
    ) {
      const opponent = {
        id: game.belongsTo,
        ships: game.ships,
        clicks: game.clicks,
        ready: game.ready ?? false,
      };

      game.ships = game.opponent.ships;
      game.clicks = game.opponent.clicks;
      game.ready = game.opponent.ready ?? false;
      game.opponent = opponent;
    }

    if (game.state !== "done") {
      if (game.gameType === "minesweeper") {
        delete game.bomb.position;
      }

      if (game.gameType === "battleships") {
        delete game.belongsTo;
        delete game.opponent.ships;
        game.turn = game.turn.toString() === _userid;
      }
    } else {
      if (game.gameType === "battleships" && game.state === constants.DONE) {
        game.winner = (await database.getUser("_id", game.winner)).username;
      }
    }

    return res.status(200).send(game);
  } catch (errors) {
    console.log(errors);
  }
});

// app.post("/api/game/updateSweepers", async (req, res) => {
//   await database.updateGameType();
//   res.status(200).send("ok");
// });

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

    if (game.gameType !== "minesweeper") {
      return res.status(404).send("Wrong game type");
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
    const gameType = req.query.gameType;

    if (!gameType) {
      return res.status(404).send("Game type needs to be set");
    }

    const game = await database.getUserGames(_userid, gameType);

    if (game.length === 0) {
      return res.status(404).send("No games found");
    }
    const latestGame = game.pop();

    if (gameType === "battleships") {
      if (latestGame.state === constants.AWAITING) {
        delete latestGame.belongsTo;
        return res.status(200).send(latestGame);
      }
      if (latestGame.belongsTo.toString() !== _userid) {
        const opponent = {
          id: latestGame.belongsTo,
          ships: latestGame.ships,
          clicks: latestGame.clicks,
          ready: latestGame.ready ?? false,
        };

        latestGame.ships = latestGame.opponent.ships;
        latestGame.clicks = latestGame.opponent.clicks;
        latestGame.ready = latestGame.opponent.ready ?? false;
        latestGame.opponent = opponent;
      }
    }

    if (latestGame.state !== constants.DONE) {
      if (latestGame.gameType === "minesweeper") {
        delete latestGame.bomb.position;
      }
      if (latestGame.gameType === "battleships") {
        delete latestGame.belongsTo;
        delete latestGame.opponent.ships;
        latestGame.turn = latestGame.turn.toString() === _userid;
      }
    } else if (
      latestGame.state === constants.DONE &&
      latestGame.gameType === "battleships"
    ) {
      latestGame.winner = (
        await database.getUser("_id", latestGame.winner)
      ).username;
    }
    return res.status(200).send(latestGame);
  } catch (errors) {
    console.log(errors);
  }
});

// const t = {
//   id: ObjectId("gameid"),
//   belongsTo: ObjectId("person who created it"),
//   opponent: {
//     id: ObjectId("opponent id"),
//     ships: {
//       5: [1, 2, 3, 4, 5],
//     },
//     clicks: [],
//   },
//   ships: {
//     5: [1, 2, 3, 4, 5],
//   },
//   clicks: [],
//   state: "ongoing",
//   winner: ObjectId('belongs to or opponent.id'),
//   hasClaimed: true
// };

app.get("/api/game-history", auth, async (req, res) => {
  // TODO: support battleships
  try {
    const { _userid } = req.user;

    const game = await database.getUserGames(_userid);

    if (game.length === 0) {
      return res.status(404).send("No games found");
    }

    const gameHistory = game.filter(
      (value) =>
        value.state === constants.DONE && value.gameType === "minesweeper"
    );

    return res.status(200).send(gameHistory);
  } catch (errors) {
    console.log(errors);
  }
});

app.post("/api/balance", auth, async (req, res) => {
  //TODO: fix once battleship api is finished
  try {
    const { _userid } = req.user;
    const { balance, gameid } = req.body;
    if (!(balance && gameid) && balance !== 0) {
      return res.status(400).send("Missing balance or game id");
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

    if (balance > 0 && game.state !== constants.DONE) {
      return res.status(400).send("Game isn't finished");
    }

    if (balance > 0 && game.hasClaimed) {
      return res.status(400).send("Game has already been claimed");
    }

    const user = await database.getUser("_id", _userid);
    const newBalance = balance + user.balance;
    const updatedBalance = await database.updateBalance(_userid, newBalance);

    if (updatedBalance.modifiedCount > 0) {
      if (balance > 0) {
        await database.updateClaimedGame(gameid);
      }
      return res.status(200).send({ balance: newBalance });
    }

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

function hasBeenClicked(id, clicks) {
  if (!clicks || clicks.length === 0) return false;
  return clicks.filter((click) => click.position === id).length > 0;
}

app.get("/api/game/minesweeper/:id/click", auth, async (req, res) => {
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

    if (hasBeenClicked(clickPosition, await database.getClicks(gameid))) {
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
  //TODO: make this work with battleships
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
    if (game.gameType !== "minesweeper") {
      return res.status(404).send("can't claim this type of game");
    }

    if (game.belongsTo.toString() !== _userid) {
      return res.status(403).send("Unathorised access to game");
    }

    if (game.state === "done") {
      return res.status(400).send("Game already claimed");
    }
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

app.post("/api/battleships/join", auth, async (req, res) => {
  const { _userid } = req.user;
  const { gameid } = req.body;

  if (!gameid) {
    return res.status(400).send("Missing game id");
  }

  if (gameid.length != 24) {
    return res.status(400).send("A valid ID is required");
  }

  const game = await database.getGame(gameid);

  if (game.gameType !== "battleships") {
    return res.status(400).send("Unable to join game as its not battleships");
  }

  if (game.opponent) {
    return res.status(400).send("Game already has an opponent");
  }

  const opponent = {
    id: new ObjectId(_userid),
    ships: {},
    clicks: {},
  };

  const turn =
    randomIntFromInterval(1, 2) === 1
      ? new ObjectId(_userid)
      : new ObjectId(game.belongsTo);

  const addedToGame = await database.addToGame(gameid, {
    state: constants.PREP,
    turn,
    opponent,
    pool: game.stake * 2,
  });

  if (!addedToGame) {
    res.status(400).send("failed to join game");
  }

  const user = await database.getUser("_id", _userid);

  const updatedBalance = await database.updateBalance(
    _userid,
    user.balance - game.stake
  );

  if (!updatedBalance) {
    return res.status(400).send("failed to update balance");
  }
  io.to(game._id.toString()).emit("user-joined", { game });
  return res.status(200).send({ gameid: game._id });
});

app.post("/api/battleships/create-game", auth, async (req, res) => {
  const { _userid } = req.user;
  const { stake } = req.body;

  if (!stake) {
    return res.status(400).send("Missing stake");
  }

  const usergames = await database.getUserGames(_userid, "battleships");
  const ongoingGame = usergames.filter((game) => game.state !== constants.DONE);

  if (ongoingGame.length > 0) {
    return res.status(400).send("User already in a game");
  }

  const game = {
    belongsTo: _userid,
    state: constants.AWAITING,
    ships: {},
    stake,
    gameType: "battleships",
    clicks: {},
  };

  const gameid = await database.createGame(game);
  io.emit("game-created");

  res.status(200).send(gameid);
});

app.post("/api/battleship/confirm-placement", auth, async (req, res) => {
  const { _userid } = req.user;
  const { gameid, position } = req.body;

  if (!(gameid && position)) {
    res.status(400).send("Missing gameid and/or position");
  }

  if (gameid.length != 24) {
    return res.status(400).send("A valid ID is required");
  }

  //position verify
  //dont allow them to call this twice

  const game = await database.getGame(gameid);

  if (game.gameType !== "battleships") {
    return res.status(400).send("Unable to join game as its not battleships");
  }

  let addedToGame;

  if (game.belongsTo.toString() === _userid) {
    addedToGame = await database.addToGame(gameid, {
      ready: true,
      ships: position,
    });
  } else {
    addedToGame = await database.addToGame(gameid, {
      "opponent.ready": true,
      "opponent.ships": position,
    });
  }

  if (!addedToGame) {
    res.status(400).send("Failed to ready up");
  }

  const _game = await database.getGame(gameid);

  if (!(_game.ready && _game.opponent.ready)) {
    io.to(gameid).emit("user-ready", gameid);
    return res.status(200).send("one user ready");
  }
  gameReady = await database.addToGame(gameid, {
    state: constants.ONGOING,
  });

  if (!gameReady) {
    res.status(400).send("failed to update game state");
  }

  io.to(gameid).emit("user-ready", gameid);

  res.status(200).send("game start");
});

app.post("/api/create-game", auth, async (req, res) => {
  // TODO: make this work for both games
  const { _userid } = req.user;
  const { bombCount, stake } = req.body;

  if (!(bombCount && stake)) {
    return res.status(400).send("Missing bombcount or stake");
  }

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
    gameType: "minesweeper",
    clicks: [],
    pool: stake,
    nextClick,
  };

  const gameid = await database.createGame(game);

  res.status(200).send(gameid);
});

io.on("connection", (socket) => {
  console.log("a user connected");

  socket.on("join-room", (id) => {
    socket.join(id);
  });

  socket.on("get-games", async () => {
    const games = await database.getGames("battleships", { state: "awaiting" });

    if (!games) return;

    await Promise.all(
      games.map(async (game) => {
        const user = await database.getUser("_id", game.belongsTo.toString());
        if (!user) {
          game.belongsTo = "#error";
        } else {
          game.belongsTo = user.username;
        }
      })
    );

    io.emit("games", games);
  });

  socket.on("board-click", async ({ id, token, clickNumber }) => {
    if (!(id && clickNumber && token) && clickNumber !== 0) return;
    if (id.length !== 24) return;
    const hasSession = await database.getSession(token);
    if (!hasSession) return;
    let decoded;
    try {
      decoded = jwt.verify(token, process.env.TOKEN_KEY);
    } catch (error) {
      console.log(error);
      return;
    }

    if (!decoded) return;

    const game = await database.getGame(id);

    if (!game) return;
    if (game.state === constants.DONE) return;
    if (game.turn.toString() !== decoded._userid) return;
    const click = await database.addClick(
      id,
      {
        clickNumber,
        userid: decoded._userid,
      },
      "battleships"
    );
    if (click.modifiedCount === 0) return;

    let _game = await database.getGame(id);

    if (
      (_game.belongsTo.toString() === decoded._userid &&
        !_game.clicks[clickNumber][0]) ||
      (_game.opponent.id.toString() === decoded._userid &&
        !_game.opponent.clicks[clickNumber][0])
    ) {
      await database.updateTurn(id, decoded._userid);
    }

    _game = await database.getGame(id, decoded._userid);

    let clicks = Object.keys(_game.clicks).map((value) => Number(value));
    let shipBlownUpCount = 0;

    for (const ship of Object.keys(_game.opponent.ships)) {
      // console.log(ship);
      const shipOpponentFilter = _game.opponent.ships[ship].filter((value) => {
        return clicks.includes(value);
      });
      // console.log(shipOpponentFilter);
      shipBlownUpCount += shipOpponentFilter.length === Number(ship) ? 1 : 0;

      // _game.opponent.ships[ship] = shipOpponentFilter.length === Number(ship)
    }
    if (shipBlownUpCount === Object.keys(_game.opponent.ships).length) {
      // user won
      _game = await database.updateGameState(
        id,
        constants.DONE,
        game.belongsTo,
        "battleships"
      );

      const user = await database.getUser("_id", game.belongsTo.toString());
      await database.updateBalance(
        game.belongsTo.toString(),
        user.balance + game.pool
      );
      io.to(id).emit("user-has-won");
    } else {
      clicks = Object.keys(_game.opponent.clicks).map((value) => Number(value));
      shipBlownUpCount = 0;
      for (const ship of Object.keys(_game.ships)) {
        const shipFilter = _game.ships[ship].filter((value) =>
          clicks.includes(value)
        );
        shipBlownUpCount += shipFilter.length === Number(ship) ? 1 : 0;
        // _game.ships[ship] = shipFilter.length === Number(ship);
      }

      if (shipBlownUpCount === Object.keys(_game.ships).length) {
        // opponent won
        _game = await database.updateGameState(
          id,
          constants.DONE,
          game.opponent.id,
          "battleships"
        );
        const user = await database.getUser("_id", game.opponent.id.toString());
        await database.updateBalance(
          game.opponent.id.toString(),
          user.balance + game.pool
        );
        io.to(id).emit("user-has-won");
      }
    }

    //ongoing
    io.to(id).emit("board-click", { game: { _id: _game._id } });
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

app.get("/*", (req, res) => {
  // res.send("hello");
  res.sendFile(path.join(__dirname + "/dist/index.html"));
});
// app.use(express.static(__dirname + "/dist/assets"));

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});

// https.createServer({
//   key: fs.readFileSync("cert/key.pem"),
//   cert: fs.readFileSync("cert/cert.pem"),
// },app).listen(httpsPort, function () {
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
