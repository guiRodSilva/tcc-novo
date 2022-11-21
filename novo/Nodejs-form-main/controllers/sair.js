exports.sair = (req, res) => {
    res.clearCookie('userSave')
    res.status(200).redirect("/");
}