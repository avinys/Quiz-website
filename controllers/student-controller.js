async function getMain(req, res) {
    res.render('customer/questions/start-quiz');
}

module.exports = {
    getMain: getMain,

}