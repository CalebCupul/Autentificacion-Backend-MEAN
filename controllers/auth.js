const { response } = require('express');
const { db } = require('../models/Usuario');
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');
const { generarJWT } = require('../helpers/jwt');

const crearUsuario = async(req, res = response) => {

    const { email, name, password } = req.body;

    try {
        
        // Verificar el email
        const usuario = await Usuario.findOne({ email });

            //Si el usuario ya existe
            if( usuario ) {
                return res.status(400).json({
                    ok: false,
                    msg: 'El usuario ya existe con ese email'
                })
            }

        // Crear usuario con el modelo
        const dbUser = new Usuario( req.body );


        // Hash de contrasena
            // Salt consiste en generar numeros aleatorios para la validacion de la contrasena
        const salt = bcrypt.genSaltSync();
        dbUser.password =  bcrypt.hashSync( password, salt );


        // Generar JWT
        const token = await generarJWT( dbUser.id, name );

        // Crear usuario de la BD
        await dbUser.save();


        // Generar respuesta exitsa
        return res.status(201).json({
            ok: true,
            uid: dbUser.id,
            name: name,
            token

        });



    } catch (error) {

        return res.status(500).json({ 
            ok: false,
            msg: 'Por favor hable con el administrador'
        });
        
    }
    
    
    


    
}

const loginUsuario =  (req, res = response) => {
    
    const { email, password } = req.body;

    return res.json({
        ok: true,
        msg: 'Login de usuario /'
    });
}

const revalidarToken = (req, res = response) => {

    return res.json({
        ok: true,
        msg: 'Renew'
    });
}


module.exports = {
    crearUsuario,
    loginUsuario,
    revalidarToken
}