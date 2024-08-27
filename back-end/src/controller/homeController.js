const homePage = (req, res) => {
  return res.send("Hello");
};

const login = (req, res) => {
  return res.send("login");
};

export default {
  homePage, login
}