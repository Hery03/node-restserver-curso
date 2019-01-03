const express = require('express');
const app = express();
const bcrypt = require('bcryptjs');
const _ = require('underscore');
const Usuario = require('../modelos/usuario');
const { verficaToken, verficaAdmin_Role } = require('../middlewares/autenticacion');


app.get('/usuario', verficaToken, (req, res) => {

    let desde = req.query.desde || 0;
    desde = Number(desde);

    let limite = req.query.limite || 5;
    limite = Number(limite);

    Usuario.find({ estado: true }, 'nombre email role google estado img')
        .skip(desde)
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            Usuario.count({ estado: true }, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    cantidad: conteo
                });
            });
        });
});

app.post('/usuario', [verficaToken, verficaAdmin_Role], (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });

    usuario.save((err, usuarioDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        // usuarioDB.password = null;

        res.json({
            ok: true,
            usuario: usuarioDB
        })

    })
})

app.put('/usuario/:id', [verficaToken, verficaAdmin_Role], (req, res) => {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado', ]);

    Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true }, (err, usuarioDB) => {

        if (err) {
            return res.status(400).json({
                ok: false,
                err
            })
        }

        res.json({
            ok: true,
            usuario: usuarioDB
        })
    })
})

// app.delete('/usuario/:id', function(req, res) {

//     let id = req.params.id;
//     Usuario.findByIdAndRemove(id, (err, usuarioDel) => {
//         if (err) {
//             return res.status(400).json({
//                 ok: false,
//                 err
//             });
//         }

//         if (!usuarioDel) {
//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Usuario no encontrado'
//                 }
//             });
//         }

//         res.json({
//             ok: true,
//             usuario: usuarioDel
//         })
//     })
// })

app.delete('/usuario/:id', [verficaToken, verficaAdmin_Role], (req, res) => {

    let id = req.params.id;

    let CambiaEstado = {
        estado: false
    }

    Usuario.findByIdAndUpdate(id, CambiaEstado, { new: true, runValidators: true }, (err, usuarioDel) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        if (!usuarioDel) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no encontrado'
                }
            });
        }

        res.json({
            ok: true,
            usuario: usuarioDel
        })
    })
})

module.exports = app;