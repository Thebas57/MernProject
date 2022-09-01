module.exports.signUpErrors = (err) => {
  let errors = { pseudo: "", email: "", password: "" };

  if (err.message.includes("pseudo"))
    errors.pseudo = "Pseudo incorrect ou déjà pris";

  if (err.message.includes("email")) errors.email = "Email incorrect";

  if (err.message.includes("password")) errors.password = "Le mot de passe doit contenir 6 caractères";

  console.log(err.code);

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("pseudo"))
    errors.pseudo = "Ce Pseudo est déjà pris";

  if (err.code == 11000 && Object.keys(err.keyValue)[0].includes("email"))
    errors.email = "Cet email est déjà enregistrée";

  return errors;
};

module.exports.signInErrors = (err) => {
  let errors = { email: "", password: "" };

  if (err.includes("Email")) errors.email = "Email inconnu";
  if (err.includes("Mdp")) errors.password = "Password inconnu";

  return errors;
};

module.exports.uploadErrors = (err) => {
  let errors = { format: "", maxSize: "" };

  if (err.message.includes("file")) errors.format = "Format incompatible";

  if (err.message.includes("max")) errors.maxSize = "Le fichier dépasse 500ko";

  return errors;
};
