class DefaultResolver {
  unpack(jsonContent) {
    return jsonContent;
  }
}

class BalanceResolver {
  unpack(jsonContent) {
    return {
      balance: jsonContent,
    };
  }
}

class BombCountResolver {
  unpack(jsonContent) {
    return {
      bombCount: jsonContent,
    };
  }
}

class UpdateBalanceResolver {
  unpack(jsonContent) {
    if (jsonContent.code == 201)
      return {
        code: jsonContent.code,
        message: { balance: jsonContent.balance },
      };
    return jsonContent;
  }
}

class UsernameResolver {
  unpack(jsonContent) {
    return {
      username: jsonContent,
    };
  }
}

class CreateGameResolver {
  unpack(jsonContent) {
    if (jsonContent.code == 201)
      return {
        code: jsonContent.code,
        message: { game: jsonContent.game },
      };
    return jsonContent;
  }
}

class PotentialResolver {
  unpack(jsonContent) {
    return { potential: jsonContent };
  }
}

class UpdateStateResolver {
  unpack(jsonContent) {
    if (jsonContent.code == 201)
      return {
        code: jsonContent.code,
        message: { state: jsonContent.state },
      };
    return jsonContent;
  }
}

class GetRewardResolver {
  unpack(jsonContent) {
    return {
      bombCount: jsonContent.bomb.count,
      stake: jsonContent.stake,
      clickCount: jsonContent.clickCount,
    };
  }
}

class GetGameStake {
  unpack(jsonContent) {
    return {
      stake: jsonContent,
    };
  }
}

class CreateUserResolver {
  unpack(jsonContent) {
    if (jsonContent.code == 201)
      return {
        code: jsonContent.code,
        message: { userid: jsonContent.id },
      };
    return jsonContent;
  }
}

class StateResolver {
  unpack(jsonContent) {
    return { state: jsonContent };
  }
}

module.exports = {
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
};
