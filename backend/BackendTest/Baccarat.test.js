const { mock } = require('node:test');
const Baccarat = require('../GameManager/Baccarat');
const GameAssets = require('../GameManager/GameAssets');
jest.mock('mongodb', () => {
  const mClient = {
    connect: jest.fn().mockImplementation(() => Promise.resolve()), // Mock promise that resolves to undefined
    db: jest.fn().mockReturnThis(),
    collection: jest.fn().mockReturnThis(),
    insertOne: jest.fn(),
    findOne: jest.fn().mockReturnValue(
      {
        lobbyId: 'abc123',
        gameType: 'Baccarat',
        playerList: ["playera"],
        currentPlayerIndex: 0,
        currentTurn: 0,
        betsPlaced: {"playera": {"win":"PlayersWin", "amount": 100}},
        gameItems: {
            globalItems: {
          }, 
            playerItems: {}
        },
        actionHistory: []
      }
    ),
    updateOne: jest.fn()
  }
  return { MongoClient: jest.fn(() => mClient) };
});

let callCount = 0;
let returnVal = [1*4];
global.fetch = jest.fn().mockImplementation( () =>{
  return Promise.resolve({
    json: () => {
      callCount++;
      return Promise.resolve({
        "result": {
          "random": {
            "data": [returnVal[callCount - 1] - 4]
          }
        }
      }); 
    },
  })
})

let gameData;

describe('Baccarat', () => {
  beforeAll(() => {
  });

  afterAll(() => {
  });

  beforeEach(async ()=> {
    gameData = {
      lobbyId: 'abc123',
      gameType: 'Baccarat',
      playerList: ["playera"],
      currentPlayerIndex: 0,
      currentTurn: 0,
      betsPlaced: {"playera": {"win":"PlayersWin", "amount": 100}},
      gameItems: {
          globalItems: {}, 
          playerItems: {}
      },
      actionHistory: []
    }
    gameData = await Baccarat.newGame(gameData);
  });

  afterEach(() => {
    global.fetch.mockClear();
  });

  /* a test to ensure that the game is created properly */
  // chatGPT usage: No
  it('newGame', async () => {
    expect(gameData.gameItems.globalItems.pokar).toStrictEqual(GameAssets.getPokar());
  });

  /* a test to ensure that a random card is generated*/
  // chatGPT usage: No
  it('random card', async () => {
    callCount = 0;
    returnVal = [1*4];
    card = await Baccarat._getRandomCard(gameData);
    expect(typeof card).toBe("string");
    expect(card).toContain("A");

  });

  /* test to ensure that the player is dealt a card , score is 1v1*/
  // chatGPT usage: No
  it('full game 1, 1', async () => {
  
    callCount = 0;
    returnVal = [1*4, 1*4, 1*4, 1*4, 1*4, 1*4];
    
    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("A");
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* full game test where score is 6 v 3*/
  // chatGPT usage: No
  it('full game 6, 3', async () => {
    callCount = 0;
    returnVal = [4*4, 3*4, 2*4, 12*4, 2*4, 2*4];
    
    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("4");
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
    fetch.mockClear();
  });

  /* full game test where score is 6 v 4*/
  // chatGPT usage: No
  it('full game 6, 4', async () => {
    
    callCount = 0;
    returnVal = [6*4, 1*4, 11*4, 3*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("6");
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* full game test where score is 6 v 5*/
  // chatGPT usage: No
  it('full game 6, 5', async () => {
    
    callCount = 0;
    returnVal = [5*4, 3*4, 1*4, 2*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("5");
    gameDataLocal.betsPlaced.playera.win = "tie";
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* full game test where score is 6 v 6*/
  // chatGPT usage: No
  it('full game 6, 6', async () => {
    
    callCount = 0;
    returnVal = [5*4, 4*4, 1*4, 2*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("5");
    gameDataLocal.betsPlaced.playera.win = "DealerWins";
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  })

  /* full game test where score is 9 v 9*/
  // chatGPT usage: No
  it('full game 9, 9', async () => {
    
    callCount = 0;
    returnVal = [5*4, 4*4, 4*4, 5*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("5");
    gameDataLocal.betsPlaced.playera.win = "tie";
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* full game test where score is 9 v 4*/
  // chatGPT usage: No
  it('full game 9, 4', async () => {
    
    callCount = 0;
    returnVal = [3*4, 4*4, 6*4, 11*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("3");
    gameDataLocal.betsPlaced.playera.win = "DealerWins";
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* a test to ensure unknown bet type is handled*/
  // chatGPT usage: No
  it('unknown bet type', async () => {
    
    callCount = 0;
    returnVal = [5*4, 4*4, 4*4, 5*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.playTurn(gameData)
    expect(typeof gameDataLocal).toBe("object");
    expect(gameDataLocal.currentPlayerIndex).toBe(-1);
    
    expect(gameDataLocal.gameItems.globalItems.playerHand[0]).toContain("5");
    gameDataLocal.betsPlaced.playera.win = "tie?";
    let gameResult = Baccarat.calculateWinning(gameDataLocal);
    expect(typeof gameResult).toBe("object");
    expect(typeof gameResult["playera"]).toBe("number");
  });

  /* test to one cannot issue a bet before the game is over*/
  // chatGPT usage: No
  it('Calculate winning before gameover', async () => {
    
    callCount = 0;
    returnVal = [5*4, 4*4, 1*4, 2*4, 2*4, 2*4];

    let gameDataLocal = await Baccarat.calculateWinning(gameData)
    expect(gameDataLocal).toBe(0);
  });
});