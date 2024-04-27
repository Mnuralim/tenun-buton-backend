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
exports.authorizationOwner = exports.authorizationRole = void 0;
const apiError_1 = __importDefault(require("../utils/apiError"));
const product_service_1 = require("../product/product.service");
const authorizationRole = (role) => {
    return (req, res, next) => {
        var _a;
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.role) !== role) {
            return next(new apiError_1.default('You are not authorized to access this resource', 403));
        }
        next();
    };
};
exports.authorizationRole = authorizationRole;
const authorizationOwner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        const { id } = req.params;
        const product = yield (0, product_service_1.getProductById)(id);
        if (((_a = req.user) === null || _a === void 0 ? void 0 : _a.id) !== product.seller_id) {
            throw new apiError_1.default('You are not authorized to access this resource', 403);
        }
        next();
    }
    catch (error) {
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
});
exports.authorizationOwner = authorizationOwner;
