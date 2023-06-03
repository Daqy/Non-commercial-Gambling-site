require("dotenv").config();

const express = require("express");
const app = express();
const http = require("http").Server(app);
const path = require("path");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const port = process.env.PORT || 3000;
const cors = require("cors");
const helmet = require("helmet");
// const cookieParser = require("cookie-parser");

// const { fromServer } = require("./endpoint-handler.js");
const { database } = require("./database.js");
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

app.use(helmet());
// app.use(cookieParser());
app.use(express.json({ limit: "50mb" }));

app.use(express.static(path.join(__dirname, "dist")));

app.use(
  cors({
    origin: "http://localhost:5173",
  })
);

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
    });

    const token = jwt.sign({ _userid, username }, process.env.TOKEN_KEY, {
      expiresIn: "2h",
    });

    return res.status(201).json({ token });
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!(username && password)) {
      res.status(400).send("All input are required");
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
        expiresIn: "2h",
      }
    );

    console.log(token);

    return res.status(200).json({ token });
  } catch (error) {
    console.log(error);
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
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/get-username", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    res.status(200).send({
      username: user.username,
    });
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/get-balance", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const user = await database.getUser("_id", _userid);

    res.status(200).send({
      balance: user.balance,
    });
  } catch (error) {
    console.log(error);
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

    return res.status(200).send(game);
  } catch (error) {
    console.log(error);
  }
});

app.get("/api/latest-game", auth, async (req, res) => {
  try {
    const { _userid } = req.user;

    const game = await database.getUserGames(_userid);

    if (game.length === 0) {
      return res.status(404).send("No games found");
    }

    return res.status(200).send(game[game.length - 1]);
  } catch (error) {
    console.log(error);
  }
});

app.post("/api/balance", auth, async (req, res) => {
  try {
    const { _userid } = req.user;
    const { balance, gameid } = req.body;

    if (!(balance && gameid) && balance != 0) {
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
    if (game.state !== constants.DONE) {
      return res.status(400).send("Game isn't finished");
    }

    if (game.hasClaimed) {
      return res.status(400).send("Game has already been claimed");
    }

    const user = await database.getUser("_id", _userid);
    const newBalance = balance + user.balance;
    const updatedBalance = await database.updateBalance(_userid, newBalance);

    if (updatedBalance.modifiedCount > 0) {
      await database.updateClaimedGame(gameid);
      return res.status(200).send({ balance: newBalance });
    }

    return res.status(400).send("Failed to update");
  } catch (error) {
    console.log(error);
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
    const { clickPosition } = req.body;

    if (!(gameid && clickPosition) && clickPosition != 0) {
      res.status(400).send("Missing game id or click position");
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

    const click = await database.updateClicks(gameid, clickPosition);

    if (click.modifiedCount === 0) {
      return res.status(400).send("failed to update click");
    }

    let _game = await database.getGame(gameid);

    if (game.bomb.position.includes(clickPosition)) {
      _game = await database.updateGameState(
        gameid,
        constants.DONE,
        constants.LOST
      );
    } else if (
      (await database.getClicks(gameid)).length ===
      game.size - game.bomb.count
    ) {
      _game = await database.updateGameState(
        gameid,
        constants.DONE,
        constants.CLAIMED
      );
    }

    let ongoingData = {};
    if (_game.state !== constants.DONE) {
      const chanceOFWinning = getPercentageOfWining(
        _game.size,
        _game.clicks.length,
        _game.bomb.count
      );
      const pool = (1 / chanceOFWinning) * _game.stake;
      const earned = pool - _game.pool;

      const newPool = await database.updateGamePool(gameid, earned);
      if (newPool !== pool) {
        return res.status(400).send("miss match in game pools");
      }
      const potentialPool = getPercentageOfWining(
        _game.size,
        _game.clicks.length + 1,
        _game.bomb.count
      );
      const nextClick = (1 / potentialPool) * _game.stake - newPool;

      ongoingData = { earned, nextClick, pool: newPool };
    }

    res.status(200).send({
      state: _game.state,
      result: _game.result,
      pool: _game.pool,
      ...ongoingData,
    });
  } catch (error) {
    console.log(error);
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
      return newValue - 1;
    })
    .sort((a, b) => 0.5 - Math.random());
}

app.post("/api/create-game", auth, async (req, res) => {
  const { _userid } = req.user;
  const { bombCount, stake } = req.body;

  const usergames = await database.getUserGames(_userid);
  const ongoingGame = usergames.filter((game) => {
    game.state === constants.ONGOING;
  });

  console.log(ongoingGame);

  if (ongoingGame) {
    return res.status(400).send("User already in a game");
  }

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
  };

  const gameid = await database.createGame(game);

  res.status(200).send({ gameid });
});

http.listen(port, function () {
  console.log(`listening on *:${port}`);
});

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
