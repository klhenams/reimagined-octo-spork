<template>
  <div>
    <div class="card">
      <div class="card-content">
        <div class="card-title">{{ course.name }}</div>
        <div class="card-desc">
          View full list of students of the {{ course.name }} class.
        </div>
      </div>
      <Button class="show" @click="submit">Show All</Button>
    </div>
  </div>
</template>

<script>
export default {
  name: "DataCard",
  props: ['course'],
  methods: {
    submit() {
      const courseName = [this.course.name]
      this.$emit("displayStudents", courseName);
    },
  },
};
</script>

<style scoped>
.card {
  max-width: 300px;
  height: 200px;
  margin: 15px;
  overflow: hidden;
  border-radius: 8px;
  border: 1px solid #ddd;
  box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;
}

.card-content {
  padding: 16px;
}

.card-title {
  margin: 0;
  font-size: 1.5rem;
}

.card-image img {
  width: 100%;
  height: 100%;
}

.card-desc {
  color: #555;
}

button {
  background-color: rgb(78, 78, 245);
  border: none;
  color: white;
  border-radius: 4px;
  margin: 15px;
  padding: 5px;
}

.show:hover {
  background-color: rgb(158, 213, 231);
}
</style>
