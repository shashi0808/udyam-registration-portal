"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const v1_1 = __importDefault(require("./v1"));
const router = express_1.default.Router();
// API version 1
router.use('/v1', v1_1.default);
// API info
router.get('/', (req, res) => {
    res.json({
        message: 'Udyam Registration API',
        version: '1.0.0',
        availableVersions: ['v1']
    });
});
exports.default = router;
//# sourceMappingURL=api.js.map