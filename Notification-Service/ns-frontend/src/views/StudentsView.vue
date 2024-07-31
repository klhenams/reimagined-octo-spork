<template>
  <div class="container">
    <DataCard
      :course="courses"
      v-for="courses in courses"
      :key="courses"
      @display-students="showStudents"
    />
  </div>
</template>

<script>
import DataCard from "../components/DataCard.vue";
import axios from "axios";

export default {
  name: "StudentsView",
  components: {
    DataCard,
  },
  data() {
    return {
      courses: [],
    };
  },
  methods: {
    async showStudents(courseName) {
      const params = {
        name: courseName,
      };

      const res = await axios.get("/api/students", { params });
      const students = res.data;
      
      sessionStorage.setItem("students", JSON.stringify(students));
      this.$router.push('/table')
    },
  },
  created() {
    const data = JSON.parse(sessionStorage.getItem("loginSession"));
    this.courses = data.courses;
  },
};
</script>

<style scoped>
.container {
  display: flex;
  flex-wrap: wrap;
  overflow: auto;
  scrollbar-width: thin;
}
</style>
