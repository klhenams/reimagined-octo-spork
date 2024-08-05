<template>
  <div class="container">
    <heading><h1>Compose A Message</h1></heading>
    <div class="menu">
      <div class="course">
        <form @submit.prevent="getFormValues">
          <div v-for="(item, index) in courses" :key="index" class="class">
            <input
              type="checkbox"
              :id="'checkbox-' + index"
              :value="item.name"
              v-model="selectedCourse"
            />
            <label :for="'checkbox-' + index">{{ item.name }}</label>
          </div>
          <label for="subject">Subject of your message: </label>
          <input type="text" class="text" name="subject" required />
          <label for="message">Type your message here: </label
          ><input type="text" class="text" name="message" required />
          <div class="send">
            <Button type="submit" id="sms" @click="setAction('sms')">Send SMS</Button>
            <Button type="submit" id="email" @click="setAction('email')"
              >Send Email</Button
            >
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "MessagesView",
  data() {
    return {
      message: null,
      subject: null,
      selectedCourse: [],
      courses: [],
      emails: [],
      phoneNumbers: [],
      newList: [],
      action: "",
    };
  },
  methods: {
    setAction(actionType) {
      this.action = actionType;
    },
    async getFormValues(submitEvent) {
      this.subject = submitEvent.target.elements.subject.value;
      this.message = submitEvent.target.elements.message.value;

      const params = {
        name: this.selectedCourse,
      };

      const res = await axios.get("/api/students", { params });
      this.newList = res.data;

      if (this.action === "sms") {
        this.sendsms();
      } else if (this.action === "email") {
        this.sendEmail();
      } else {
        console.log("Error");
      }
    },
    async sendEmail() {
      const sender = JSON.parse(sessionStorage.getItem("loginSession")).name;

      // extract emails from student data and save as array
      this.emails = this.newList.map((student) => student.email);

      const params = {
        sender: sender,
        subject: this.subject,
        text: this.message,
        receivers: this.emails,
      };

      try {
        const res = await axios.post("/api/sendEmail", { params });
        if (res.data.message) {
          window.alert("Your mail has been sent!");
        }
      } catch (error) {}
    },
    async sendsms() {
      const sender = JSON.parse(sessionStorage.getItem("loginSession")).name;

      // extract phone numbers from student data and save as an array
      this.phoneNumbers = this.newList.map((student) => student.phone_Number);
      console.log(this.phoneNumbers);

      const params = {
        message: this.message,
        recipients: this.phoneNumbers,
      };

      const res = await axios.post("/api/sendsms", { params });
      if (res.data.status === "success") {
        window.alert("Your message has been sent!");
      }
    },
  },
  mounted() {
    this.courses = JSON.parse(sessionStorage.getItem("loginSession")).courses;
  },
};
</script>

<style scoped>
.container {
  width: 350px;
  height: 500px;
  border: none;
  border-radius: 15px;
  margin: 15px;
  padding: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  background-color: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 50%;
}

.menu {
  width: 100%;
  height: 80%;
}

.course {
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  /* background-color: whitesmoke; */
  height: 100%;
}

button {
  /* background-color: rgb(78, 78, 245); */
  border: none;
  color: white;
  border-radius: 4px;
  margin: 15px;
  padding: 10px;
}

#sms {
  background-color: orange;
}

#email {
  background-color: rgb(78, 78, 245);
}

button:hover {
  background-color: lightblue;
}

h1 {
  color: orange;
}

.text {
  width: 80%;
  height: 10%;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  font-size: larger;
  border: 1px solid grey;
  border-radius: 15px;
}

.class {
  display: flex;
  /* height: 2%;
  flex-wrap: wrap; */
  justify-content: space-evenly;
  width: 80%;
}

form {
  height: 100%;
  align-items: center;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>
