"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
const app_1 = __importDefault(require("./src/app"));
dotenv_1.default.config();
const port = process.env.PORT || 5000;
app_1.default.listen(port, () => console.log(`Server is running on port ${port}`));
