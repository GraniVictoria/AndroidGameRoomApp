const { Server } = require("socket.io");
const { MongoClient } = require('mongodb');
const GameLobbyStore = require('../GameLobbyStore');
const UserStore = require('../UserStore');
const Client = require("socket.io-client");
const { mockInstances } = require('mongodb');
const { mock } = require('node:test');
const { app } = require('../server'); // assuming that your server file is named server.js
let io, serverSocket, clientSocket;

// this mock is needed for github
// setting up memory DB do not work for github action due to memory limit
// it is also not possible to install full db to github action
// hence, we mock basic db functionality, one can remove this mock for local testing
// it only applies to github and server testing
jest.mock('mongodb', () => {
    const mockFindOne = jest.fn();
    const mockInsertOne = jest.fn();
    const mockUpdateOne = jest.fn();
    const mockDeleteOne = jest.fn();
  
    const mClient = {
      connect: jest.fn().mockResolvedValue(null),
      db: jest.fn().mockReturnThis(),
      collection: jest.fn().mockReturnThis(),
      insertOne: mockInsertOne,
      findOne: mockFindOne,
      updateOne: mockUpdateOne,
      deleteOne: mockDeleteOne,
      close: jest.fn().mockResolvedValue(null),
    };
  
    return { 
      MongoClient: jest.fn(() => mClient),
      mockInstances: {
        mockFindOne,
        mockInsertOne,
        mockUpdateOne,
        mockDeleteOne,
      }
    };
  });

beforeAll((done) => {
    const httpServer = require('http').createServer(app);
    io = new Server(httpServer);
    httpServer.listen(() => {
        clientSocket = new Client(`http://localhost:8081`);
        io.on("connection", socket => {
            serverSocket = socket;
        });
        clientSocket.on("connect", done);
    });
});
  
afterAll(() => {
    io.close();
    clientSocket.close();
});


describe('UserAccount interactions', () => {
    beforeEach(() => {
        // Reset the mocks before each test
        mockInstances.mockFindOne.mockReset();
        mockInstances.mockInsertOne.mockReset();
        mockInstances.mockUpdateOne.mockReset();
        mockInstances.mockDeleteOne.mockReset();
    });

    it('should emit userAccountDetails when retrieveAccount event is received', (done) => {
        const fakeUser = { userId: 'testUserID', username: 'testUser', balance: 100 };
        mockInstances.mockFindOne.mockResolvedValue(fakeUser);

        clientSocket.on('userAccountDetails', (data) => {
            console.log(fakeUser)
            expect(data).toEqual(fakeUser);
            done();
        });

        clientSocket.emit('retrieveAccount', 'testUserID');
    });

    // ... other tests with their own mock implementations
});

// describe('updateAccount', () => {
//     // ChatGPT usage: No
//     // Input: userInfo
//     // Expected behavior: Emit 'updateAccount' event
//     // Expected output: None
//     it('should trigger when client emits updateAccount event', (done) => {
//         clientSocket.on()
//         clientSocket.emit('updateAccount', {userId: 123, username: "David"});
//     });
// });

// describe('createAccount', () => {
//     // ChatGPT usage: No
//     // Input: userInfo
//     // Expected behavior: Emit 'createAccount' event
//     // Expected output: None
//     it('should trigger when client emits createAccount event', (done) => {
//         clientSocket.emit('createAccount', {userId: 123, username: "David"});
//     }, 1);
// });

// describe('updateName', () => {
//     // ChatGPT usage: No
//     // Input: userId, newName
//     // Expected behavior: Emit 'updateName' event
//     // Expected output: None
//     it('should trigger when client emits updateName event', (done) => {
//         clientSocket.emit('updateName', 'userIdExample', 'newNameExample');
//     }, 1);
// });

// describe('updateAdminStatus', () => {
//     // ChatGPT usage: No
//     // Input: username, adminStatus
//     // Expected behavior: Emit 'updateAdminStatus' event
//     // Expected output: None
//     it('should trigger when client emits updateAdminStatus event', (done) => {
//         clientSocket.emit('updateAdminStatus', 'usernameExample', true);
//     }, 1);
// });

// describe('deposit', () => {
//     // ChatGPT usage: No
//     // Input: userId, amount
//     // Expected behavior: Emit 'deposit' event
//     // Expected output: None
//     it('should trigger when client emits deposit event', (done) => {
//         clientSocket.emit('deposit', 'testUserID', 100);
//     }, 1);
// });

// describe('changebalancebyname', () => {
//     // ChatGPT usage: No
//     // Input: username, amount
//     // Expected behavior: Emit 'changebalancebyname' event
//     // Expected output: None
//     it('should trigger when client emits changebalancebyname event', (done) => {
//         clientSocket.emit('changebalancebyname', 'testUsername', 100);
//     }, 1);
// });

// describe('withdraw', () => {
//     // ChatGPT usage: No
//     // Input: userId, amount
//     // Expected behavior: Emit 'withdraw' event
//     // Expected output: None
//     it('should trigger when client emits withdraw event', (done) => {
//         clientSocket.emit('withdraw', 'testUserID', 50);
//     }, 1);
// });


// describe('updateChatBanned', () => {
//     // ChatGPT usage: No
//     // Input: username, chatBannedStatus
//     // Expected behavior: Emit 'updateChatBanned' event
//     // Expected output: None
//     it('should trigger when client emits updateChatBanned event', (done) => {
//         clientSocket.emit('updateChatBanned', 'testUsername', true);
//     }, 1);
// });

// describe('updateLastRedemptionDate', () => {
//     // ChatGPT usage: No
//     // Input: userID, redemptionDate
//     // Expected behavior: Emit 'updateLastRedemptionDate' event
//     // Expected output: None
//     it('should trigger when client emits updateLastRedemptionDate event', (done) => {
//         clientSocket.emit('updateLastRedemptionDate', 'testUserID', new Date().toISOString());
//     }, 1);
// });

// describe('deleteUser', () => {
//     // ChatGPT usage: No
//     // Input: userId
//     // Expected behavior: Emit 'deleteUser' event
//     // Expected output: None
//     it('should trigger when client emits deleteUser event', (done) => {
//         clientSocket.emit('deleteUser', 'testUserID');
//     }, 1);
// });

// describe('deleteAllUsers', () => {
//     // ChatGPT usage: No
//     // Input: None
//     // Expected behavior: Emit 'deleteAllUsers' event
//     // Expected output: None
//     it('should trigger when client emits deleteAllUsers event', (done) => {
//         clientSocket.emit('deleteAllUsers');
//     }, 1);
// });

// describe('createLobby', () => {
//     // ChatGPT usage: No
//     // Input: roomName, gameType, maxPlayers, userName
//     // Expected behavior: Emit 'createLobby' event
//     // Expected output: None
//     it('should trigger when client emits createLobby event', (done) => {
//         clientSocket.emit('createLobby', 'testRoom', 'testGameType', 4, 'testUser');
//     }, 1);
// });

// describe('joinLobby', () => {
//     // ChatGPT usage: No
//     // Input: roomName, userName
//     // Expected behavior: Emit 'joinLobby' event
//     // Expected output: None
//     it('should trigger when client emits joinLobby event', (done) => {
//         clientSocket.emit('joinLobby', 'testRoom', 'testUser');
//     }, 1);
// });

// describe('sendChatMessage', () => {
//     // ChatGPT usage: No
//     // Input: roomName, userName, message
//     // Expected behavior: Emit 'sendChatMessage' event
//     // Expected output: None
//     it('should trigger when client emits sendChatMessage event', (done) => {
//         clientSocket.emit('sendChatMessage', 'testRoom', 'testUser', 'Hello!');
//     }, 1);
// });

// describe('getAllLobby', () => {
//     // ChatGPT usage: No
//     // Input: None
//     // Expected behavior: Emit 'getAllLobby' event
//     // Expected output: None
//     it('should trigger when client emits getAllLobby event', (done) => {
//         clientSocket.emit('getAllLobby');
//     }, 1);
// });

// describe('setBet', () => {
//     // ChatGPT usage: No
//     // Input: roomName, userName, bet
//     // Expected behavior: Emit 'setBet' event
//     // Expected output: None
//     it('should trigger when client emits setBet event', (done) => {
//         clientSocket.emit('setBet', 'testRoom', 'testUser', 100);
//     }, 1);
// });

// describe('setReady', () => {
//     // ChatGPT usage: No
//     // Input: roomName, userName
//     // Expected behavior: Emit 'setReady' event
//     // Expected output: None
//     it('should trigger when client emits setReady event', (done) => {
//         clientSocket.emit('setReady', 'testRoom', 'testUser');
//     }, 1);
// });

// describe('getPlayerCount', () => {
//     // ChatGPT usage: No
//     // Input: roomName
//     // Expected behavior: Emit 'getPlayerCount' event
//     // Expected output: None
//     it('should trigger when client emits getPlayerCount event', (done) => {
//         clientSocket.emit('getPlayerCount', 'testRoom');
//     }, 1);
// });

// describe('leaveLobby', () => {
//     // ChatGPT usage: No
//     // Input: None
//     // Expected behavior: Emit 'leaveLobby' event
//     // Expected output: None
//     it('should trigger when client emits leaveLobby event', (done) => {
//         clientSocket.emit('leaveLobby');
//     }, 1);
// });

// describe('playTurn', () => {
//     // ChatGPT usage: No
//     // Input: lobbyName, userName, action
//     // Expected behavior: Emit 'playTurn' event
//     // Expected output: None
//     it('should trigger when client emits playTurn event', (done) => {
//         clientSocket.emit('playTurn', 'testLobby', 'testUser', 'testAction');
//     }, 1);
// });
