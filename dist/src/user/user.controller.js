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
const authentication_1 = __importDefault(require("../middlewares/authentication"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const service = __importStar(require("./user.service"));
const upload_image_1 = __importDefault(require("../middlewares/upload-image"));
const router = express_1.default.Router();
router.patch('/update-password/:id', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { newPassword, password } = req.body;
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        if (!newPassword || !password) {
            throw new apiError_1.default('Old and new password are required', 400);
        }
        yield service.editPassword(password, newPassword, id);
        res.status(200).json({
            success: true,
            message: 'Password updated successfully',
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
router.get('/address/:id', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        const address = yield service.getAllAddressUser(id);
        res.status(200).json({
            success: true,
            message: 'Address fetched successfully',
            data: address,
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
router.patch('/address/:id/:addressId', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id, addressId } = req.params;
    try {
        if (!id && !addressId)
            throw new apiError_1.default('User id and address is required', 400);
        yield service.updateAddress(id, addressId, body);
        res.status(200).json({
            success: true,
            message: 'Address updated successfully',
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
router.post('/address/:id', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        yield service.addNewAddress(id, body);
        res.status(201).json({
            success: true,
            message: 'Address created successfully',
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
router.delete('/address/:id/:addressId', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, addressId } = req.params;
    try {
        if (!id && !addressId)
            throw new apiError_1.default('User id and address is required', 400);
        yield service.removeAddress(id, addressId);
        res.status(200).json({
            success: true,
            message: 'Address deleted successfully',
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
router.patch('/:id', authentication_1.default, upload_image_1.default.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const body = req.body;
    const file = req.file;
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        yield service.updateUser(body, id, file);
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
router.get('/', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield service.getAllUser();
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
router.get('/:id', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id)
            throw new apiError_1.default('User id is required', 400);
        const user = yield service.getUserById(id);
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
const userController = router;
exports.default = userController;
