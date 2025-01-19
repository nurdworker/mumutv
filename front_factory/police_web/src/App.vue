<template>
  <div class="container">
    <div class="blank"></div>
    <img class="background" src="./assets/police_web.png" alt="" />
    <div class="ban_input">
      <div class="input-group mb-3">
        <span class="input-group-text" id="basic-addon1"
          >Which domain ban?</span
        >
        <input v-model="data.link" type="text" class="form-control" />

        <button class="btn btn-danger input_police" v-on:click="submit()">
          Catch!
        </button>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
import axios from "axios";

export default {
  name: "App",
  props: {
    collectionName: String,
  },
  setup(props) {
    props;
    const data = reactive({ title: "Vue 3 Guide" });

    const submit = () => {
      axios
        .post("/was", { link: data.link })
        .then((res) => {
          alert(res.data);
        })
        .catch((err) => {
          console.error(err);
        });
    };

    return {
      data,
      submit,
    };
  },
};
</script>

<style lang="scss">
.container {
  width: 100%;
  margin: 0;

  .blank {
    height: 200px;
  }

  .ban_input {
    width: 100vw;
    display: flex;
    justify-content: center;
    .input-group {
      width: 80%;
      .input_police {
        height: 50px;
      }
      input {
        height: 50px;
      }
      button {
        width: 100px;
      }
    }
  }
  .background {
    width: 100%;
    position: fixed;
    top: 0;
    left: 0;
    z-index: -1;
  }
}
</style>
