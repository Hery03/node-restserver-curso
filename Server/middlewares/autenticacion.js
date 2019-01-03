const jwt = require('jsonwebtoken')


// VERIFICAR TOKEN

let verficaToken = (req, res, next) => {
    let token = req.get('token');

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            })
        }

        req.usuario = decoded.usuario;
        next();

    })
};

// VERIFICA ADMIN_ROLE

let verficaAdmin_Role = (req, res, next) => {
    let usuario = req.usuario

    if (usuario.role !== 'ADMIN_ROLE') {
        return res.json({
            ok: false,
            message: 'El usuario no es administrador'
        })
    }

    next();

}

module.exports = {
    verficaToken,
    verficaAdmin_Role
};