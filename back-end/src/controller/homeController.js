const homePage = (req, res) => {
  return res.send("Hello");
};

const login = (req, res) => {
  return res.send("login");
};

module.exports = {
  homePage, login
}