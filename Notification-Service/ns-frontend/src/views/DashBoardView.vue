<template>
  <div class="container">
    <div class="side-bar" v-show="showSide">
      <div class="header-sidebar">
        <h3>Admin Dashboard</h3>
      </div>
      <div class="sidebar-menu">
        <div class="menu-items">
          <!-- create links to the other views -->
          <RouterLink to="/students" class="menu-icons"
            ><i class="pi pi-users"></i>Students</RouterLink
          >
          <RouterLink to="/profile" class="menu-icons"
            ><i class="pi pi-user"></i>Profile</RouterLink
          >
          <RouterLink to="/messages" class="menu-icons"
            ><i class="pi pi-send"></i>Messages</RouterLink
          >
          <RouterLink @click="logout" to="/" class="menu-icons"
            ><i class="pi pi-sign-out"></i>Log Out</RouterLink
          >
        </div>
      </div>
    </div>
    <div class="main">
      <div class="nav-bar">
        <i class="pi pi-bars" @click="toggleSideBar" style="margin-left: 20px" />
        <div class="user-menu" @click="toggleDropDown">
          <i class="pi pi-user" style="margin-right: 10px"></i>{{ userData.name }}
        </div>
      </div>
      <div class="main-body">
        <div class="data-container">
          <router-view />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "DashBoardView",
  data() {
    return {
      showSide: true, 
      userData: [],
    };
  },
  methods: {
    // toggle side bar on or off
    toggleSideBar() {
      this.showSide = !this.showSide;
    },
    logout() {
      sessionStorage.clear();
    },
  },
  created() {
    // save lecturer data to session storage when component is created
    const user = JSON.parse(sessionStorage.getItem("loginSession"));
    this.userData = user;
  },
};
</script>

<style scoped>
.data {
  width: 200px;
  height: 100px;
  border: 1px solid grey;
  border-radius: 10px;
}
.container {
  width: 100%;
  height: 100vh;
  display: flex;
}

.nav-bar {
  height: 50px;
  background-color: lightgray;
  width: 100%;
  display: flex;
  justify-content: space-between;
  justify-self: start;
  align-items: center;
  color: black;
}

.main {
  background-color: lightgray;
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: black;
}

.main-body {
  height: 100%;
  width: 100%;
  background-color: white;
  display: flex;
  justify-content: center;
  overflow: auto;
}

.user-menu {
  margin-right: 10px;
}

.drop-down {
  border-radius: 4px;
  background-color: rgb(233, 210, 210);
  width: 100px;
  height: fit-content;
  position: absolute;
  right: 10px;
  z-index: 10px;
  margin-top: 50px;
  display: flex;
  flex-direction: column;
}

.data-container {
  /* border: 1px solid grey; */
  /* border-radius: 10px; */
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  margin: 10px;
  /* height: calc(100% - 50px); */
}

.menu-items {
  display: flex;
  width: 100%;
  flex-direction: column;
}

.menu-icons {
  /* width: 100%; */
  height: 5%;
  font-size: large;
  color: white;
  text-decoration: none;
  margin: 5px;
  border-radius: 5px;
  display: flex;
  padding: 10px;
  align-items: center;
  justify-content: space-between;
}

.menu-icons:hover {
  background-color: white;
  color: black;
}

.header-sidebar {
  height: 50px;
  background-color: rgb(43, 43, 63);
  width: 100%;
  display: flex;
  justify-content: center;
  font-weight: bold;
}
.side-bar {
  width: 250px;
  background-color: gray;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: white;
}

.sidebar-menu {
  display: flex;
  justify-content: center;
  height: 100%;
  background-color: rgb(60, 60, 75);
}

a {
  font-family: monospace;
  color: black;
  text-decoration: none;
}
</style>
