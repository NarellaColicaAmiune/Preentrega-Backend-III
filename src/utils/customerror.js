export const errors = {
    invalid_credentials: "Las credenciales que ingresaste son invalidas",
    user_already_exists: "El usuario que intentas crear ya existe",
    pet_already_exists: "La mascota que intentas crear ya existe",
    user_not_found: "El usuario que intentas actualizar no existe",
    pet_not_found: "La mascota que intentas actualizar no existe",
    error_users: "Error al generar usuarios",
    error_pets: "Error al generar mascotas",
}

export class AppError extends Error {
  constructor(
    errorMessage,
    statusCode,
    name,
  ) {
    const message = errors[errorMessage] || errorMessage;
    super(message);
    this.statusCode = statusCode;
    this.name = this.name || "AppError";
    this.errorMessage = message;
  }
}