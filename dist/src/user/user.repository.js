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
exports.findAllUsers = exports.getAllAdress = exports.deleteAddress = exports.editAddress = exports.createAddress = exports.findAddressById = exports.updateUserById = exports.findUserByMobile = exports.findUserById = void 0;
const db_1 = require("../db");
const findUserById = (id, showPassword) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.user.findUnique({
        where: {
            id,
        },
        include: {
            auth: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    created_at: true,
                    password: showPassword,
                },
            },
            address: true,
        },
    });
    return user;
});
exports.findUserById = findUserById;
const findUserByMobile = (mobile) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.user.findUnique({
        where: {
            mobile,
        },
    });
    return user;
});
exports.findUserByMobile = findUserByMobile;
const updateUserById = (id, body, imageUrl) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.user.update({
        where: {
            id,
        },
        data: Object.assign(Object.assign({}, body), { image: imageUrl }),
    });
});
exports.updateUserById = updateUserById;
const findAddressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.address.findUnique({
        where: {
            id,
        },
    });
    return user;
});
exports.findAddressById = findAddressById;
const createAddress = (userId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.address.create({
        data: Object.assign(Object.assign({}, body), { user_id: userId }),
    });
});
exports.createAddress = createAddress;
const editAddress = (addressId, body) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.address.update({
        where: {
            id: addressId,
        },
        data: body,
    });
});
exports.editAddress = editAddress;
const deleteAddress = (addressId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.address.delete({
        where: {
            id: addressId,
        },
    });
});
exports.deleteAddress = deleteAddress;
const getAllAdress = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield db_1.db.address.findMany({
        where: {
            user_id: userId,
        },
    });
    return user;
});
exports.getAllAdress = getAllAdress;
const findAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db_1.db.user.findMany({
        where: {
            is_active: true,
        },
        include: {
            auth: {
                select: {
                    id: true,
                    email: true,
                    username: true,
                    created_at: true,
                },
            },
            address: true,
        },
    });
    return users;
});
exports.findAllUsers = findAllUsers;
