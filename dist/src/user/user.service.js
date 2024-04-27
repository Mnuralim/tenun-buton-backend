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
exports.getUserById = exports.getAllUser = exports.getAllAddressUser = exports.removeAddress = exports.updateAddress = exports.addNewAddress = exports.updateUser = exports.editPassword = void 0;
const bcrypt_1 = require("bcrypt");
const apiError_1 = __importDefault(require("../utils/apiError"));
const userRepository = __importStar(require("./user.repository"));
const auth_repository_1 = require("../auth/auth.repository");
const imagekit_1 = __importDefault(require("../utils/imagekit"));
const editPassword = (oldPassword, newPassword, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId, true);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    const checkedPassword = yield (0, bcrypt_1.compare)(oldPassword, user.auth.password);
    if (!checkedPassword)
        throw new apiError_1.default('Password is wrong', 400);
    const hashedPassword = yield (0, bcrypt_1.hash)(newPassword, 10);
    const update = yield (0, auth_repository_1.updatePassword)(user.auth_id, hashedPassword);
    return update;
});
exports.editPassword = editPassword;
const updateUser = (body, userId, file) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    if (body.mobile) {
        const checkMobile = yield userRepository.findUserByMobile(body.mobile);
        if (checkMobile && user.mobile !== body.mobile)
            throw new apiError_1.default('Mobile number already used', 400);
    }
    if (file) {
        const uploadImage = yield imagekit_1.default.upload({
            file: file.buffer,
            fileName: `${file.originalname}-${user.id}-${Date.now()}`,
            folder: `tenunbuton/${user.id}/thumbnail`,
        });
        yield userRepository.updateUserById(userId, body, uploadImage.url);
    }
    else {
        yield userRepository.updateUserById(userId, body);
    }
});
exports.updateUser = updateUser;
const addNewAddress = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    const address = yield userRepository.createAddress(userId, body);
    return address;
});
exports.addNewAddress = addNewAddress;
const updateAddress = (userId, addressId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    const address = yield userRepository.findAddressById(addressId);
    if (!address)
        throw new apiError_1.default('Address not found', 404);
    yield userRepository.editAddress(addressId, body);
});
exports.updateAddress = updateAddress;
const removeAddress = (userId, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    const address = yield userRepository.findAddressById(addressId);
    if (!address)
        throw new apiError_1.default('Address not found', 404);
    yield userRepository.deleteAddress(addressId);
});
exports.removeAddress = removeAddress;
const getAllAddressUser = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(userId);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    const address = yield userRepository.getAllAdress(userId);
    return address;
});
exports.getAllAddressUser = getAllAddressUser;
const getAllUser = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield userRepository.findAllUsers();
    return users;
});
exports.getAllUser = getAllUser;
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield userRepository.findUserById(id);
    if (!user)
        throw new apiError_1.default('User not found', 404);
    return user;
});
exports.getUserById = getUserById;
