const nodemailer = require("nodemailer");
const { MongoClient } = require("mongodb");
const axios = require("axios");

const password = process.env.PASSWORD;
const api_key = process.env.API_KEY;
const MONGO_URL = process.env.MONGO_DB_URL;

const login = async (req, res) => {
  try {
    // open connection to db
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db("computer-eng");
    const lecturer = await db
      .collection("lecturers")
      .find({ email: req.query.email })
      .toArray();

    // set login status to failed or successful
    if (lecturer[0].password == req.query.password) {
      lecturer[0].success = "Success";
    } else {
      lecturer[0].success = "Failed";
    }
    res.status(200).json(lecturer);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//query db for list of students by course
const getStudents = async (req, res) => {
  try {
    const client = await MongoClient.connect(MONGO_URL);
    const db = client.db("computer-eng");
    const students = await db
      .collection("students")
      .find({ course: { $all: req.query.name } })
      .toArray();
    res.status(200).json(students);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const sendEmail = async (req, res) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: "miguelweeks4@gmail.com",
      pass: password,
    },
    tls: {
      rejectUnauthorized: false,
    },
  });

  async function main() {
    const info = await transporter.sendMail({
      from: req.body.params.sender,
      bcc: req.body.params.receivers,
      subject: req.body.params.subject,
      text: req.body.params.text,
    });

    res.status(200).json({ message: "Message sent!" });
  }
  main().catch(console.error);
};

//send data to the sms api
const sendsms = async (req, res) => {
  const data = {
    sender: "Alertify",
    message: req.body.params.message,
    recipients: req.body.params.recipients,
  };

  const config = {
    method: "post",
    url: "https://sms.arkesel.com/api/v2/sms/send",
    headers: {
      "api-key": api_key,
    },
    data: data,
  };

  await axios(config)
    .then(function (response) {
      res.status(200).json(response.data);
    })
    .catch(function (error) {
      res.status(500).json(error);
    });
};

module.exports = {
  login,
  getStudents,
  sendEmail,
  sendsms,
};
