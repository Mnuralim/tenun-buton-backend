"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const crypto_1 = __importDefault(require("crypto"));
const generateToken = () => {
    const token = crypto_1.default.randomBytes(32).toString('hex');
    const emailVerifToken = crypto_1.default.createHash('sha256').update(token).digest('hex');
    return emailVerifToken;
};
exports.default = generateToken;
