const { Router } = require('express');
const { check } = require('express-validator');
const { crearUsuario, loginUsuario, revalidarToken } = require('../controllers/auth');
const { validarCampos } = require('../middlewares/validar-campos');

const router = Router();

// Crear un usuario
// Validacion de campos
router.post('/new', [
    check('name', 'El nombre de usuario es obligatorio').notEmpty(),
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6}),
    validarCampos
] ,crearUsuario);

// Login de usuario
// Validaciones de campos
router.post('/', [
    check('email', 'El email es obligatorio').isEmail(),
    check('password', 'La contraseña es obligatoria').isLength({ min: 6}),
    validarCampos
] ,loginUsuario);

// Validar y revalidar token
router.get('/renew', revalidarToken);




module.exports = router;