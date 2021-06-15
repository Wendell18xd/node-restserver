const { Router } = require("express");
const { check } = require("express-validator");

const router = Router();

const {
  usuariosGet,
  usuariosPut,
  usuariosPost,
  usuarioDelete,
  usuarioPatch,
} = require("../controllers/usuarios");

const {
  esRoleValido,
  emailExiste,
  existeUsuarioPorId,
} = require("../helpers/db-validators");

const {
  validarCampos,
  validarJWT,
  esAdminRole,
  tieneRole,
} = require("../middlewares");

router.get("/", usuariosGet);

router.put(
  "/:id",
  [
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPut
);

router.post(
  "/",
  [
    check("correo", "El correo no es valido").isEmail(),
    check("correo").custom(emailExiste),
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password deber ser mas de 6 caracteres").isLength({
      min: 6,
    }),
    check("password", "El password es obligatorio").not().isEmpty(),
    // check("rol", "No es un rol valido").isIn(["ADMIN_ROLE", "USER_ROLE"]),
    check("rol").custom(esRoleValido),
    validarCampos,
  ],
  usuariosPost
);

router.delete(
  "/:id",
  [
    validarJWT,
    // esAdminRole, furza al que el usuario sea admin
    tieneRole("ADMIN_ROLE", "USER_ROLE", "VENTAS_ROLE"),
    check("id", "No es un ID valido").isMongoId(),
    check("id").custom(existeUsuarioPorId),
    validarCampos,
  ],
  usuarioDelete
);

router.patch("/", usuarioPatch);

module.exports = router;
