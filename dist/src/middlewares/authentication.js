"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const db_1 = require("../db");
const authentication = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const bearerToken = req.headers.authorization;
    if (!bearerToken) {
        return next(new apiError_1.default('No token', 401));
    }
    const token = bearerToken.split(' ')[1];
    const payload = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET);
    const user = yield db_1.db.user.findUnique({
        where: {
            id: payload.id,
        },
        include: {
            auth: true,
        },
    });
    req.user = user;
    next();
});
exports.default = authentication;
