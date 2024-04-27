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
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePassword = exports.findUserByResetPaswordToken = exports.updateResetPasswordToken = exports.updateVerfiedEmail = exports.findUserByEmailVerifyToken = exports.findUserByEmail = exports.addUser = void 0;
const db_1 = require("../db");
const addUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const auth = yield db_1.db.auth.create({
        data,
    });
    const user = yield db_1.db.user.create({
        data: {
            auth_id: auth.id,
        },
    });
    return user;
});
exports.addUser = addUser;
const findUserByEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.findFirst({
        where: {
            AND: {
                email,
                user: {
                    is_active: true,
                },
            },
        },
        include: {
            user: true,
        },
    });
    return user;
});
exports.findUserByEmail = findUserByEmail;
const findUserByEmailVerifyToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.findFirst({
        where: {
            AND: {
                email_verify_token: token,
                is_verified: false,
            },
        },
    });
    return user;
});
exports.findUserByEmailVerifyToken = findUserByEmailVerifyToken;
const updateVerfiedEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.update({
        where: {
            email,
        },
        data: {
            is_verified: true,
            email_verify_token: '',
        },
    });
    return user;
});
exports.updateVerfiedEmail = updateVerfiedEmail;
const updateResetPasswordToken = (email, token, resetExpired) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.update({
        where: {
            email,
        },
        data: {
            password_reset_expired: resetExpired,
            password_reset_token: token,
        },
    });
    return user;
});
exports.updateResetPasswordToken = updateResetPasswordToken;
const findUserByResetPaswordToken = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.findFirst({
        where: {
            AND: {
                password_reset_token: token,
                password_reset_expired: {
                    gte: new Date(),
                },
                is_verified: true,
            },
        },
    });
    return user;
});
exports.findUserByResetPaswordToken = findUserByResetPaswordToken;
const updatePassword = (id, password) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.auth.update({
        where: {
            id,
        },
        data: {
            password,
            password_reset_expired: null,
            password_reset_token: null,
        },
    });
    return user;
});
exports.updatePassword = updatePassword;
