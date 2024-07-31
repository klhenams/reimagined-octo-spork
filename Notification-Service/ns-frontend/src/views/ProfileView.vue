<template>
  <div class="container">
    <div class="hero">
      <div class="profile-img">
        <img src="../assets/download.jpg" />
      </div>
    </div>
    <div class="details">
      <div class="item"><h4>Name</h4><h2>{{ lecturer.name }}</h2></div>
      <div class="item"><h4>Department</h4><h2>{{ lecturer.department }}</h2></div>
      <div class="item"><h4>Email</h4><h2>{{ lecturer.email }}</h2></div>
      <div class="item"><h4>Courses Taken</h4><h2>{{ coursesNum }}</h2></div>
    </div>
  </div>
</template>

<script>
export default {
  name: "ProfileView",
  data() {
    return {
      coursesNum: null,
      lecturer: []
    }
  }, 
  mounted() {
    const res = JSON.parse(sessionStorage.getItem('loginSession'))
    this.lecturer = res
    this.coursesNum = res.courses.length
  }
};
</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 50%;
}
.details {
  height: 70%;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.hero {
  height: 30%;
  background-image: linear-gradient(to right, rgba(255, 0, 0, 0), rgb(75, 66, 66));
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid black; */
}

.profile-img {
  /* border: 1px solid grey; */
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
  border-radius: 100%;
  width: 150px;
  height: 150px;
  z-index: 5;
  /* margin-left: 50px; */
  display: flex;
  align-items: center;
  justify-content: center;
}

.profile-img img {
  width: 100%;
  height: 100%;
  border-radius: inherit;
}

.item {
  width: 90%;
  height: 20%;
  border: none;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  margin: 10px;
  padding: 5px;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.24) 0px 3px 8px;
}

h4 {
  color: rgb(37, 34, 34);
  font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
}

h2 {
  color: rgb(44, 36, 65);
}
</style>
