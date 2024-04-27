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
exports.findAddressById = exports.addNewOrder = void 0;
const db_1 = require("../db");
const addNewOrder = (buyerId, items, shippingCost, courier, addressId, totalPrice, totalPurchase, totalInvoice, fee) => __awaiter(void 0, void 0, void 0, function* () {
    const order = yield db_1.db.order.create({
        data: {
            buyer_id: buyerId,
            shipping_cost: shippingCost,
            fee,
            courier,
            address_id: addressId,
            total_price: totalPrice,
            total_purchase: totalPurchase,
            total_invoice: totalInvoice,
            item: {
                create: items.map((item) => ({
                    color: item.color,
                    length: item.length,
                    width: item.width,
                    weight: item.weight,
                    size: item.size,
                    total_product: item.total_product,
                    total_price: item.total_price,
                    product_id: item.product_id,
                    name_product: item.product_name,
                    price: item.price,
                })),
            },
        },
    });
    return order;
});
exports.addNewOrder = addNewOrder;
const findAddressById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const address = yield db_1.db.address.findUnique({
        where: {
            id,
        },
    });
    return address;
});
exports.findAddressById = findAddressById;
