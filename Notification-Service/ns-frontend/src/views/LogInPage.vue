<template>
  <div class="container">
    <div class="main">
      <div class="hero">
        <img src="../assets/logo3.png" />
      </div>
      <div class="form">
        <div class="logo">
          <img src="../assets/logo - Copy.png" />
          <p>Login</p>
        </div>
        <form @submit.prevent="getFormValues">
          <!-- <div class="login-form"> -->
          <div>
            <label for="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              v-model="username"
              required
            />
          </div>
          <div>
            <label for="password">Password</label>
            <input
              type="password"
              name="password"
              id="password"
              v-model="password"
              required
            />
          </div>
          <p v-if="failed" style="color: red">Incorrect username or password</p>
          <Button type="submit">Log In</Button>
          <!-- </div> -->
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "LogInPage",
  data() {
    return {
      failed: false,
      username: "",
      password: "",
    };
  },
  methods: {
    async getFormValues(submitEvent) {
      this.username = submitEvent.target.elements.username.value;
      this.password = submitEvent.target.elements.password.value;

      const params = {
        email: this.username,
        password: this.password,
      };
      const res = await axios.get("/api/login", { params });

      // if login is successful allow the user
      if (res.data[0].success == "Success") {
        sessionStorage.setItem("loginSession", JSON.stringify(res.data[0]));
        this.$router.push("/students");
      } else if (res.data[0].success == "Failed") {
        this.failed = true;
      }
      else (
        console.log("An error occured!")
      )
    },
  },
};
</script>

<style scoped>
.container {
  width: 100svw;
  height: 100svh;
  display: flex;
  justify-content: center;
  background-color: white;
  align-items: center;
}

.main {
  height: 500px;
  width: 80%;
  margin: auto;
  border-radius: 3px;
  display: flex;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}

.hero {
  width: 50%;
  height: inherit;
  background-color: white;
  display: flex;
  justify-content: center;
  align-items: center;
}

.form {
  width: 50%;
  height: 100%;
  background-color: white;
  display: flex;
  flex-direction: column;
  margin: auto;
  align-items: center;
  justify-content: space-evenly;
}

p {
  font-family: Verdana, Geneva, Tahoma, sans-serif;
  color: green;
}

.logo {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  width: 100px;
  height: 100px;
}

.login-form {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

button {
  width: 50%;
  background-color: lightgreen;
  color: white;
  border: none;
  height: 15%;
  border-radius: 5px;
}

input {
  width: 100%;
  height: 70%;
  border-radius: 5px;
  border: 0.5px solid grey;
}

.logo img {
  width: 90%;
}

form {
  width: 100%;
  height: 50%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  font-family: Verdana, Geneva, Tahoma, sans-serif;
}

.hero img {
  width: 100%;
}
</style>
