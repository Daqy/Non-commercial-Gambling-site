const fs = require("fs");

class __Storage {
  getUsers() {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    return data.users;
  }
  getUser(id) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const user of data.users) {
      if (user.id == id) return user;
    }
  }
  getUserBalance(id) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const user of data.users) {
      if (user.id == id) return user.balance;
    }
  }
  getUsername(id) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const user of data.users) {
      if (user.id == id) return user.name;
    }
  }
  getGames() {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    return data.game;
  }
  getGame(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game;
    }
  }
  getBombCount(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.bomb.count;
    }
  }
  getBombLocation(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.bomb.location;
    }
  }
  getClickCount(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.clickCount;
    }
  }
  getGameState(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.state;
    }
  }
  getGameStake(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.stake;
    }
  }
  getNextReward(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game;
    }
  }
  getGamePotential(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));
    for (const game of data.games) {
      if (game.id == id && game.author == auth) return game.potential;
    }
  }
  addUser(user) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    data.users.push(user);

    const userJsonify = JSON.stringify(data);
    fs.writeFile("./game-storage.json", userJsonify, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return { code: 201, message: "user created", id: user.id };
  }
  addGame(game) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    data.games.push(game);

    const gameJsonify = JSON.stringify(data);
    fs.writeFile("./game-storage.json", gameJsonify, (err) => {
      if (err) {
        console.log(err);
      }
    });
    return { code: 201, message: "game created", game: game };
  }
  updateBalance(id, balanceChange) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    for (const user of data.users) {
      if (user.id == id) {
        user.balance += balanceChange;
        const gameJsonify = JSON.stringify(data);
        fs.writeFile("./game-storage.json", gameJsonify, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return { code: 201, balance: user.balance };
      }
    }
    return { code: 400, message: "failed to find user" };
  }
  UpdateClickCount(id, auth) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    for (const game of data.games) {
      if (game.id == id && game.author == auth) {
        game.clickCount += 1;
        const gameJsonify = JSON.stringify(data);
        fs.writeFile("./game-storage.json", gameJsonify, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return { code: 201, clickCount: game.clickCount };
      }
    }
    return { code: 400, message: "failed to update click count" };
  }
  updateState(id, auth, state) {
    const data = JSON.parse(fs.readFileSync("game-storage.json"));

    for (const game of data.games) {
      if (game.id == id && game.author == auth) {
        game.state = state;
        const gameJsonify = JSON.stringify(data);
        fs.writeFile("./game-storage.json", gameJsonify, (err) => {
          if (err) {
            console.log(err);
          }
        });
        return { code: 201, state: game.state };
      }
    }
    return { code: 400, message: "failed to update state" };
  }
}

module.exports = { __Storage };
