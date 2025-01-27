var express = require('express');
var router = express.Router();

//IMPORTAR CONTROLADOR
let productController = require('../controllers/productController');

//RUTAS PRODUCTS

router.get('/', productController.allProducts);

router.get('/add', productController.add);
router.post('/add', productController.procesarProducto);
router.post('/store', productController.store);

router.get('/detalle/:id', productController.detalle);

router.get('/search', productController.search);

module.exports = router;