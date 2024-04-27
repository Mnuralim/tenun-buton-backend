"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
exports.resetPassword = exports.forgotPassword = exports.verifyEmail = exports.loginGoogle = exports.login = exports.register = void 0;
const bcrypt_1 = require("bcrypt");
const google_auth_library_1 = require("google-auth-library");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const nodemailer_1 = __importDefault(require("../utils/nodemailer"));
const random_password_1 = __importDefault(require("../utils/random-password"));
const repository = __importStar(require("./auth.repository"));
const emailMessage = __importStar(require("../utils/email-message"));
const generate_token_1 = __importDefault(require("../utils/generate-token"));
const register = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const isRegistered = yield repository.findUserByEmail(data.email);
    if (isRegistered)
        throw new apiError_1.default('Email already registered', 400);
    const username = data.email.split('@')[0];
    const hashedPassword = yield (0, bcrypt_1.hash)(data.password, 10);
    const verifyToken = (0, generate_token_1.default)();
    const user = yield repository.addUser({
        username,
        email: data.email,
        password: hashedPassword,
        email_verify_token: verifyToken,
    });
    yield (0, nodemailer_1.default)({
        html: emailMessage.verifyEmailMessage(verifyToken),
        subject: 'Verfication email',
        text: `Hi ${username} please verify your email address to continue`,
        to: data.email,
    });
    return user;
});
exports.register = register;
const login = (data) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const isRegistered = yield repository.findUserByEmail(data.email);
    if (!isRegistered)
        throw new apiError_1.default('Email not registered', 400);
    const isValidPassword = yield (0, bcrypt_1.compare)(data.password, isRegistered.password);
    if (!isValidPassword)
        throw new apiError_1.default('Password is not valid', 400);
    const payload = {
        email: isRegistered.email,
        id: (_a = isRegistered.user) === null || _a === void 0 ? void 0 : _a.id,
        username: isRegistered.username,
    };
    const accesToken = jsonwebtoken_1.default.sign(payload, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    const refreshToken = jsonwebtoken_1.default.sign(payload, process.env.REFRESHTOKEN_SECRET, {
        expiresIn: '7d',
    });
    const payloadData = Object.assign(Object.assign({}, payload), { accesToken });
    return {
        payloadData,
        refreshToken,
    };
});
exports.login = login;
const loginGoogle = (tokenId) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
    const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
    const client = new google_auth_library_1.OAuth2Client(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET);
    const ticket = yield client.verifyIdToken({
        idToken: tokenId.slice(7),
        audience: GOOGLE_CLIENT_ID,
    });
    const payload = ticket.getPayload();
    if ((payload === null || payload === void 0 ? void 0 : payload.aud) != GOOGLE_CLIENT_ID) {
        throw new apiError_1.default('Token id is not valid', 400);
    }
    const isRegistered = yield repository.findUserByEmail(payload === null || payload === void 0 ? void 0 : payload.email);
    let userId;
    if (!isRegistered) {
        const username = (_b = payload === null || payload === void 0 ? void 0 : payload.email) === null || _b === void 0 ? void 0 : _b.split('@')[0];
        const randomPassword = (0, random_password_1.default)();
        const hashedPassword = yield (0, bcrypt_1.hash)(randomPassword, 10);
        const user = yield repository.addUser({
            email: payload === null || payload === void 0 ? void 0 : payload.email,
            username: username,
            password: hashedPassword,
        });
        yield (0, nodemailer_1.default)({
            html: emailMessage.successRegister(randomPassword),
            subject: 'Register Success',
            text: `Hi ${username} your registration is success`,
            to: payload === null || payload === void 0 ? void 0 : payload.email,
        });
        userId = user.id;
    }
    const payloadData = {
        email: payload === null || payload === void 0 ? void 0 : payload.email,
        id: userId,
        username: payload === null || payload === void 0 ? void 0 : payload.name,
    };
    const accesToken = jsonwebtoken_1.default.sign(payloadData, process.env.JWT_SECRET, {
        expiresIn: '3d',
    });
    const refreshToken = jsonwebtoken_1.default.sign(payloadData, process.env.REFRESHTOKEN_SECRET, {
        expiresIn: '7d',
    });
    return {
        payloadData,
        accesToken,
        refreshToken,
    };
});
exports.loginGoogle = loginGoogle;
const verifyEmail = (token) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.findUserByEmailVerifyToken(token);
    if (!user)
        throw new apiError_1.default('Token not found', 400);
    const updateVerifyEmail = yield repository.updateVerfiedEmail(user.email);
    if (updateVerifyEmail) {
        yield (0, nodemailer_1.default)({
            html: emailMessage.successRegister(),
            subject: 'Register Success',
            text: `Hi ${user.username} your registration is success`,
            to: user.email,
        });
    }
});
exports.verifyEmail = verifyEmail;
const forgotPassword = (email) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.findUserByEmail(email);
    if (!user)
        throw new apiError_1.default('Email not found', 400);
    const resetPasswordToken = (0, generate_token_1.default)();
    const passwordResetExpiry = new Date(Date.now() + 10 * 60 * 1000);
    const update = yield repository.updateResetPasswordToken(email, resetPasswordToken, passwordResetExpiry);
    if (update) {
        yield (0, nodemailer_1.default)({
            html: emailMessage.forgotPasswordMessage(resetPasswordToken),
            subject: 'Reset Password',
            text: `Hi ${user.username} please reset your password to continue`,
            to: user.email,
        });
    }
});
exports.forgotPassword = forgotPassword;
const resetPassword = (resetPasswordToken, newPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield repository.findUserByResetPaswordToken(resetPasswordToken);
    if (!user)
        throw new apiError_1.default('Password reset token is invalid or has expired', 400);
    const hashedPassword = yield (0, bcrypt_1.hash)(newPassword, 10);
    const reset = yield repository.updatePassword(user.id, hashedPassword);
    if (reset) {
        yield (0, nodemailer_1.default)({
            html: emailMessage.resetPasswordMsgSuccess(),
            subject: 'Reset Password',
            text: `Hi ${user.username} your password has been reset`,
            to: user.email,
        });
    }
});
exports.resetPassword = resetPassword;
