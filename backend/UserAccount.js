
class UserAccount {
    // ChatGPT usage: Yes
    constructor(io, userStore) {
        this.io = io;
        this.userStore = userStore;
    }

    // ChatGPT usage: Yes
    async retrieveAccount(socket, userId) {
        const user = await this.userStore.getUser(userId);
        socket.emit('userAccountDetails', user);
    }

    // ChatGPT usage: No
    async updateAccount(socket, userInfo) {

        const updatedUser = await this.userStore.updateUser(userInfo.userId, userInfo);
        if (!updatedUser) {
            socket.emit('userError', "Update failed or user not found.");
            return;
        }
        socket.emit('accountUpdated', updatedUser);
    }

    // ChatGPT usage: Yes
    async createAccount(socket, userInfo) {
        const newUser = await this.userStore.addUser(userInfo);
        socket.emit('accountCreated', newUser);
    }

    // ChatGPT usage: No
    async updateName(socket, userId, name) {
        const user = await this.userStore.getUser(userId);
        if (!user) {
            socket.emit('userError', "User not found.");
            return;
        }
        
        user.username = name;
        console.log(user);
        const updatedUser = await this.userStore.updateUser(userId, user);
        //console.log(updatedUser)
        //if (!updatedUser) {
          //  socket.emit('userError', "Update username failed.");
           // return;
        //}
        
        socket.emit('accountUpdated', updatedUser);
    }

    // ChatGPT usage: No
    async updateAdminStatus(socket, username, isAdmin) {
        const user = await this.userStore.getUserbyname(username);
        if (!user) {
            socket.emit('userError', "User not found.");
            return;
        }
        
        user.isAdmin = isAdmin;
        const updatedUser = await this.userStore.updateUser(user.userId, user);
        
        //if (!updatedUser) {
            //socket.emit('userError', "Assign Admin Status failed.");
            //return;
        //}
        
        socket.emit('accountUpdated', updatedUser);
    }

    // ChatGPT usage: No
    async updateChatBanned(socket, username, isChatBanned) {
        const user = await this.userStore.getUserbyname(username);
        if (!user) {
            socket.emit('userError', "User not found.");
            return;
        }
        
        user.isChatBanned = isChatBanned;
        const updatedUser = await this.userStore.updateUser(user.userId, user);
        
        // if (!updatedUser) {
        //     socket.emit('userError', "Assign ChatBanned Status failed.");
        //     return;
        // }
        
        socket.emit('accountUpdated', updatedUser);
    }

    // ChatGPT usage: No
    async updateLastRedemptionDate(socket, userId, date){
        const user = await this.userStore.getUser(userId);
        if (!user) {
            socket.emit('accountUpdated', "Failed to update the RedemptionDate for User");
            return;
        }
        
        user.lastRedemptionDate = date;
        const updatedUser = await this.userStore.updateUser(userId, user);
        
        // if (!updatedUser) {
        //     socket.emit('accountUpdated', "Failed to update the RedemptionDate for User");
        //     return;
        // }
        
        socket.emit('accountUpdated', updatedUser);
    }

    // ChatGPT usage: No
    async deposit(socket, userId, amount) {
        const user = await this.userStore.getUser(userId);

        if (amount < 0|| amount == null){
            socket.emit('balanceUpdate', null);
            return;
        }
        if (!user) {
            socket.emit('balanceUpdate', null);
            return;
        }
        
        user.balance += amount;
        const updatedUser = await this.userStore.updateUser(userId, user);
        
        // if (!updatedUser) {
        //     socket.emit('balanceUpdate', null);
        //     return;
        // }
        let balanceAsInteger = Math.round(updatedUser.balance);
        
        socket.emit('balanceUpdate', balanceAsInteger);
    }

    // ChatGPT usage: No
    async changebalancebyname(socket, username, amount){
        const user = await this.userStore.getUserbyname(username);
        if (!user) {
            socket.emit('balanceUpdate', null);
            return;
        }
        if (amount < 0 ){
            this.withdraw(socket, user.userId, -amount);
        }else{
            this.deposit(socket, user.userId, amount);
        }
        // if (amount < 0 && -amount > user.balance){
        //     socket.emit('balanceUpdate', "Amount withdrawed is more than the current balance, cannot process this withdrawal");
        //     return;
        // }
        // user.balance += amount;
        // const updatedUser = await this.userStore.updateUser(user.userId, user);
        
        // if (!updatedUser) {
        //     socket.emit('balanceUpdate', null);
        //     return;
        // }

        // let balanceAsInteger = Math.round(updatedUser.balance);
        
        // socket.emit('balanceUpdate', balanceAsInteger);
    }

    // ChatGPT usage: No
    async withdraw(socket, userId, amount) {
        const user = await this.userStore.getUser(userId);
        if (!user) {
            socket.emit('balanceUpdate', null);
            return;
        }
        
        if (user.balance < amount){
            socket.emit('balanceUpdate', "Amount withdrawed is more than the current balance, cannot process this withdrawal");
            return;
        }
        user.balance -= amount;
        const updatedUser = await this.userStore.updateUser(userId, user);
        let balanceAsInteger = Math.round(updatedUser.balance);
        
        socket.emit('balanceUpdate', balanceAsInteger);
    }

    // ChatGPT usage: Yes
    async deleteUser(socket, userId) {
        const deletedCount = await this.userStore.deleteUser(userId);
        if (deletedCount) {
            socket.emit('userDeleted', `User with ID ${userId} deleted successfully.`);
        } else {
            socket.emit('userError', `Failed to delete user with ID ${userId}.`);
        }
    }

    // ChatGPT usage: No
    async deleteAllUsers(socket){
        const result = await this.userStore.deleteAllUsers();
        if (result) {
            socket.emit('allUsersDeleted');
        } else {
            socket.emit('userError', "Failed to delete users.");
        }
    }

    // ChatGPT usage: No
    async checkUserisInDB(socket, userId){
        const user = await this.userStore.getUser(userId);
        if (!user) {
            socket.emit('UserFound', null);
            return;
        }else{
            socket.emit("UserFound", user);
        }

    }
    // More functionalities as required...
}

module.exports = UserAccount;
