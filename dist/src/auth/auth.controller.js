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
const express_1 = __importDefault(require("express"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const service = __importStar(require("./auth.service"));
const router = express_1.default.Router();
router.post('/register', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new apiError_1.default('Email and password are required', 400);
        }
        yield service.register({ email, password });
        res.status(201).json({
            success: true,
            message: 'User registered successfully',
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.post('/login-credentials', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    try {
        if (!email || !password) {
            throw new apiError_1.default('Email and password are required', 400);
        }
        const { payloadData, refreshToken } = yield service.login({ email, password });
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'Login success',
            data: Object.assign({}, payloadData),
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.post('/login-google', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const tokenId = req.headers.authorization;
    try {
        if (!tokenId) {
            throw new apiError_1.default('Token id is required', 400);
        }
        const { accesToken, payloadData, refreshToken } = yield service.loginGoogle(tokenId);
        res.cookie('refreshToken', refreshToken, {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
            httpOnly: true,
        });
        res.status(200).json({
            success: true,
            message: 'Login success',
            data: Object.assign(Object.assign({}, payloadData), { accesToken }),
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.get('/verify-email/:token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    try {
        if (!token) {
            throw new apiError_1.default('Token is required', 400);
        }
        yield service.verifyEmail(token);
        res.status(200).json({
            success: true,
            message: 'Email verified successfully',
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.post('/forgot-password', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { email } = req.body;
    try {
        if (!email) {
            throw new apiError_1.default('Email is required', 400);
        }
        yield service.forgotPassword(email);
        res.status(200).json({
            success: true,
            message: 'Email sent successfully',
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.patch('/reset-password/:token', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { token } = req.params;
    const { password } = req.body;
    try {
        if (!token) {
            throw new apiError_1.default('Token is required', 400);
        }
        if (!password) {
            throw new apiError_1.default('Password is required', 400);
        }
        yield service.resetPassword(token, password);
        res.status(200).json({
            success: true,
            message: 'Password reset successfully',
        });
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
const authController = router;
exports.default = authController;
