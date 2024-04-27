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
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const authorization_1 = require("../middlewares/authorization");
const userService = __importStar(require("../user/user.service"));
const admin_service_1 = require("./admin.service");
const router = express_1.default.Router();
router.get('/users', authentication_1.default, (0, authorization_1.authorizationRole)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield userService.getAllUser();
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: users,
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
router.get('/users/:id', authentication_1.default, (0, authorization_1.authorizationRole)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        const user = yield userService.getUserById(id);
        res.status(200).json({
            success: true,
            message: 'User fetched successfully',
            data: user,
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
router.patch('/users/:id', authentication_1.default, (0, authorization_1.authorizationRole)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        yield userService.updateUser(body, id);
        res.status(200).json({
            success: true,
            message: 'User updated successfully',
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
router.delete('/users/:id', authentication_1.default, (0, authorization_1.authorizationRole)('ADMIN'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        yield (0, admin_service_1.removeUser)(id);
        res.status(200).json({
            success: true,
            message: 'User deleted successfully',
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
const adminController = router;
exports.default = adminController;
