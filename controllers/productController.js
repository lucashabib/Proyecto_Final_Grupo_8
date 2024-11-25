const db = require('../database/models');
const Product = db.Product;

const Op = db.Sequelize.Op

const productController = {

    show: function (req, res) {
        db.Product.findAll({
            limit: 4,
            order: [['createdAt', 'DESC']],
            include: [{ model: db.User, as: 'user' }]
        })
        .then(function (products) {
            res.render('index', { products: products });
        })
        .catch(function (err) {
            console.log(err);
            res.render('index', { products: [] });
        });
    },    

    mostrarProducto: (req, res) => {
        if (!req.session || !req.session.user) {
            return res.redirect('/users/login');
        }
        res.render('product-add');
    },

    add: (req, res) => {
        if (req.session.user != undefined) {
            return res.render("product-add", { title: "Agregar Producto" })
        }
        return res.redirect("/users/login")  //para el boton de agregar producto, si esta registrado o no
    },

    procesarProducto: (req, res) => {

        let { imagen, name, texto } = req.body

        if (!imagen) {
            return res.send("Error: Este campo es obligatorio")
        }
        if (!name) {
            return res.send("Error: Este campo es obligatorio")
        }
        if (!texto) {
            return res.send("Error: Este campo es obligatorio")
        }
    },

    store: (req, res) => {
        let producto = req.body;

        db.Product.create(producto) //Habria que cambiar el nombre con el que va a tener mi base de datos
            .then(function (results) {
                return res.redirect('/products')
            })
            .catch(function (err) {
                console.log(err);
            })
    },

    search: (req, res) => {
        let qs = req.query.search;
        //return res.send(qs)
        
        let filtro = {
            where: [{ nombre: { [Op.like]: `%${qs}%` } }],
            order: [[ 'createdAt', 'DESC']], 
            //include: [{ model: db.User, as: 'User' }]
            include: [ { association: "user"} ]
        };

        db.Product.findAll(filtro)
            .then(function (results) {
               // return res.send(results)
                if (results.length > 0) {
                    return res.render('search-results', { results: results })
                } else {
                    return res.send('No hay resultados para su criterio de busqueda')
                }
            })
            .catch(function (err) {
                return console.log(err);
            })
    },

    detalle: (req, res) => {
        let id = req.params.id;
    
        db.Product.findByPk(id, {
            include: [{ model: db.User, as: 'user' }]
        })
        .then (function (product) {
            if (product) {
                res.render('product', { product });
            } else {
                res.send('Producto no encontrado');
            }
        })
        .catch(function (err) {
                return console.log(err);
            })
        }
}

module.exports = productController;