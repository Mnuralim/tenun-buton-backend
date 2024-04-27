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
exports.getAddressById = exports.createOrder = void 0;
const midtrans_client_1 = __importDefault(require("midtrans-client"));
const product_service_1 = require("../product/product.service");
const orderRepository = __importStar(require("./order.repository"));
const apiError_1 = __importDefault(require("../utils/apiError"));
const createOrder = (buyer, items, shippingCost, courier, addressId) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const fee = 1000;
    let totalPrice = 0;
    const itemsAfterCalc = [];
    for (const item of items) {
        const product = yield (0, product_service_1.getProductById)(item.product_id);
        if (product.stock < parseInt(item.total_product.toString())) {
            throw new Error('Product stock is not enough');
        }
        totalPrice += product.price * parseInt(item.total_product.toString());
        itemsAfterCalc.push({
            total_price: product.price * parseInt(item.total_product.toString()),
            product_id: item.product_id,
            color: item.color,
            length: item.length,
            width: item.width,
            weight: item.weight,
            size: item.size,
            total_product: parseInt(item.total_product.toString()),
            product_name: product.name,
            price: product.price,
        });
    }
    const totalPurchase = totalPrice + shippingCost;
    const totalInvoice = totalPurchase + fee;
    const order = yield orderRepository.addNewOrder(buyer.id, itemsAfterCalc, shippingCost, courier, addressId, totalPrice, totalPurchase, totalInvoice, fee);
    const snap = new midtrans_client_1.default.Snap({
        isProduction: false,
        clientKey: process.env.MIDTRANS_CLIENT_KEY,
        serverKey: process.env.MIDTRANS_SERVER_KEY,
    });
    const address = yield (0, exports.getAddressById)(addressId);
    const transaction = yield snap.createTransaction({
        customer_details: {
            email: (_a = buyer.auth) === null || _a === void 0 ? void 0 : _a.email,
            first_name: buyer.firstname,
            phone: buyer.mobile,
        },
        item_details: itemsAfterCalc.map((item) => ({
            id: item.product_id,
            price: item.price,
            quantity: item.total_product,
            name: item.product_name,
        })),
        transaction_details: {
            gross_amount: totalInvoice,
            order_id: order.id,
        },
        shipping_address: {
            address: address.address,
            city: address.city,
            email: (_b = buyer.auth) === null || _b === void 0 ? void 0 : _b.email,
            first_name: buyer.firstname,
            phone: buyer.mobile,
            postal_code: address.postal_code,
            country_code: address.country,
        },
    });
    return {
        token: transaction.token,
        redirect_url: transaction.redirect_url,
    };
});
exports.createOrder = createOrder;
const getAddressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield orderRepository.findAddressById(id);
    if (!address) {
        throw new apiError_1.default('Address not found', 404);
    }
    return address;
});
exports.getAddressById = getAddressById;
