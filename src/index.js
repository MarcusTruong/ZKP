const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
const port = process.env.PORT || 3000;
const collection = require("./mongodb");

const tempelatePath = path.join(__dirname, "../tempelates");

app.use(express.json());
app.set("view engine", "hbs");
app.set("views", tempelatePath);
app.use(express.urlencoded({ extended: false }));

app.get("/signup", (req, res) => {
  res.render("signup");
});
app.get("/", (req, res) => {
  res.render("login");
});

app.post("/signup", async (req, res) => {
  try {
    // Kiểm tra nếu tên hoặc mật khẩu bị bỏ trống
    const { name, password } = req.body;
    if (!name || !password) {
      return res.status(400).send("Name and password are required.");
    }

    // Tìm kiếm người dùng trong cơ sở dữ liệu
    const existingUser = await collection.findOne({ name });

    // Nếu người dùng đã tồn tại, trả về thông báo lỗi
    if (existingUser) {
      return res.render("signup", {
        errorMessage: "User already exists.",
        name: name,
      });
    }

    // Thêm người dùng mới vào cơ sở dữ liệu
    const newUser = { name, password };
    await collection.insertMany([newUser]);


    // Trả về kết quả thành công và render trang "home"
    res.status(201).render("login", {
      naming: name,
    });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).send("Internal server error.");
  }
});

app.post("/login", async (req, res) => {
  try {
    const check = await collection.findOne({ name: req.body.name });

    if (!check) {
      // Nếu không tìm thấy người dùng, thông báo người dùng không tồn tại
      return res.render("login", { errorMessage: "User does not exist" });
    }

    // Kiểm tra mật khẩu nếu người dùng tồn tại
    if (check.password === req.body.password) {
      res.status(201).render("home", { naming: `${req.body.name}` });
    } else {
      res.render("login", { errorMessage: "Incorrect password" });
    }
  } catch (e) {
    res.render("login", { errorMessage: "Wrong details" });
  }
});



app.listen(port, () => {
  console.log("port connected");
});
