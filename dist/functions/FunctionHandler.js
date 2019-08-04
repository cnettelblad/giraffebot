"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const chickens_1 = require("./chickens/");
const user_1 = require("./user/");
class FunctionHandler {
    constructor(commandHandler) {
        this.init = () => {
            const chickens = new chickens_1.ChickenGame(this.commandHandler);
            const user = new user_1.User(this.commandHandler);
            chickens.init();
            user.init();
        };
        this.commandHandler = commandHandler;
    }
}
exports.default = FunctionHandler;
//# sourceMappingURL=FunctionHandler.js.map