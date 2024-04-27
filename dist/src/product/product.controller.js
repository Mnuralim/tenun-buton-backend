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
const upload_image_1 = __importDefault(require("../middlewares/upload-image"));
const productService = __importStar(require("./product.service"));
const authorization_1 = require("../middlewares/authorization");
const router = express_1.default.Router();
router.post('/', authentication_1.default, upload_image_1.default.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const body = req.body;
    const file = req.file;
    try {
        if (!body.name ||
            !body.price ||
            !body.category ||
            !body.description ||
            !body.size ||
            !body.stock ||
            !file ||
            !body.condition ||
            !body.weight ||
            !body.length ||
            !body.width ||
            body.colors === '' ||
            !body.colors) {
            throw new apiError_1.default('all fields are required', 400);
        }
        yield productService.createProduct((_a = req.user) === null || _a === void 0 ? void 0 : _a.id, body, file);
        res.status(201).json({
            success: true,
            message: 'Product created successfully',
        });
    }
    catch (error) {
        console.log(error);
        if (error instanceof apiError_1.default) {
            next(new apiError_1.default(error.message, error.statusCode));
        }
        else {
            next(new apiError_1.default('Internal server error', 500));
        }
    }
}));
router.get('/', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield productService.getAllProducts();
        res.status(200).json({
            success: true,
            message: 'Products fetched successfully',
            data: products,
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
router.get('/:id', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.params.id;
    try {
        if (!id) {
            throw new apiError_1.default('id is required', 400);
        }
        const product = yield productService.getProductById(id);
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: product,
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
router.patch('/:id', authentication_1.default, authorization_1.authorizationOwner, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const body = req.body;
    try {
        if (!id) {
            throw new apiError_1.default('id is required', 400);
        }
        yield productService.updateProduct(id, body);
        res.status(200).json({
            success: true,
            message: 'Product updated successfully',
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
router.delete('/:id', authentication_1.default, authorization_1.authorizationOwner, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw new apiError_1.default('id is required', 400);
        }
        yield productService.deleteProduct(id);
        res.status(200).json({
            success: true,
            message: 'Product deleted successfully',
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
router.post('/image/:id', authentication_1.default, authorization_1.authorizationOwner, upload_image_1.default.single('image'), (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _b;
    const { id } = req.params;
    const file = req.file;
    try {
        if (!id) {
            throw new apiError_1.default('id is required', 400);
        }
        yield productService.addNewImage(id, (_b = req.user) === null || _b === void 0 ? void 0 : _b.id, file);
        res.status(201).json({
            success: true,
            message: 'Add image product successfully',
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
router.get('/image/:imageId', (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    try {
        const image = yield productService.getImageById(imageId);
        res.status(200).json({
            success: true,
            message: 'Product fetched successfully',
            data: image,
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
router.delete('/image/:imageId', authentication_1.default, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { imageId } = req.params;
    try {
        yield productService.deleteImageProduct(imageId);
        res.status(200).json({
            success: true,
            message: 'Image deleted successfully',
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
router.patch('/archive/:id', authentication_1.default, authorization_1.authorizationOwner, (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    try {
        if (!id) {
            throw new apiError_1.default('id is required', 400);
        }
        yield productService.archiveProduct(id);
        res.status(200).json({
            success: true,
            message: 'Product archived successfully',
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
const productController = router;
exports.default = productController;
