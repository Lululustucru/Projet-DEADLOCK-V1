<?php

$sampleGetForm = $_GET["sampleGetForm"] ?? null;
$email = $_GET["email"] ?? null;
$nom_utilisateur = $_GET["nom_utilisateur"] ?? null;
$mdp = $_GET["mdp"] ?? null;
$errors = [];
const MAIL_REGEX = "/^[\w\-.]+@([\w-]+\.)+[\w-]{2,4}$/";

function isMailValid($email)
{
    global $errors;

    if (!is_string($email)) {
        $mailError = [
            "type" => "email",
            "message" => "Veuillez entrer un e-mail valide",
        ];
        array_push($errors, $mailError);
        return;
    }


    switch (preg_match(MAIL_REGEX, $email)) {
        case 1:
            break;
        case 0:
            $mailError = [
                "type" => "email",
                "message" => "Veuillez entrer un e-mail valide",
            ];
            array_push($errors, $mailError);
            break;
        default:
            $regexError = [
                "type" => "regex",
                "message" => "Veuillez entrer un regex valide",
            ];
            var_dump($regexError);
            die();
            break;
    }
}

/* Interdire la création d'un nom d'utilisateur déjà présent dans la base de données
function isUtilisateurValid($nom_utilisateur)
{
    global $errors;

    if (!is_string($nom_utilisateur)) {
        $nom_utilisateurError = [
            "type" => "mdp",
            "message" => "Veuillez entrer un mot de passe valide",
        ];
        array_push($errors, $nom_utilisateurError);
        return;
    }

    switch (true) {
        case strlen($nom_utilisateur) < 8:
            $nom_utilisateurError = [
                "type" => "mdp",
                "message" => "Veuillez entrer un sujet d'au moins 8 caracteres",
            ];
            array_push($errors, $nom_utilisateurError);
            break;
    }
    return;
}
*/

function ismdpvalid($mdp)
{
    global $errors;

    if (!is_string($mdp)) {
        $mdpError = [
            "type" => "mdp",
            "message" => "Veuillez entrer un mot de passe valide",
        ];
        array_push($errors, $mdpError);
        return;
    }

    switch (true) {
        case strlen($mdp) < 8:
            $mdpError = [
                "type" => "mdp",
                "message" => "Mot de passe trop court. Le mot de passe doit contenir au moins 8 caracteres",
            ];
            array_push($errors, $mdpError);
            break;
    }
    return;
}

if (isset($sampleGetForm)) {
    // traitement

    isMailValid($email);
    ismdpvalid($mdp);
    

    if(count($errors)>0){

        $email = "";
        $mdp = "";
    }
    else{
        header('Location: ../Connexion/deadlock_player_connexion.php');
    }

}

?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="stylesheet" href="deadlock_player_connexion.css">
    <title>Inscription</title>
</head>

<body>
    <section>
        <h2>Création d'un compte</h2>

        <form action="" method="GET">
            <!-- champ email-->

            <?php


            // var_dump($errors) pour verifier que j'ai bien mon tableau d'erreur
            if (count($errors) >0 ){

                foreach ($errors as $error) {
                    //? $error=[type=>"", message=>""]
                    
                    // if ($error['type'] === "email") {
                        //     echo "<ul><li>" . $error["message"] . "</li></ul>";
                        // }
                        echo $error['type'] === "email" ? "<ul><li>" . $error["message"] . "</li></ul>" : "";
                    }
            }
            ?>


            <label for="email">Saisissez votre e-mail :
                <input type="text" name="email" id="email" value="<?php echo isset($email) ? $email : ""; ?>">
            </label>

            <!-- champ mdp-->
            <?php
            if (count($errors) >0 ) {

                foreach ($errors as $error) {
                    echo $error['type'] === "mdp" ? "<ul><li>" . $error["message"] . "</li></ul>" : "";
                }
            }
            ?>
            <label for="mdp">Saisissez un mot de passe : 
                <input type="password" name="mdp" id="mdp" value="<?php echo isset($mdp) ? $mdp : ""; ?>">
            </label>

            <input type="hidden" name="sampleGetForm">

            <button type="submit" id="submit">Inscription</button>
        </form>
    </section>
