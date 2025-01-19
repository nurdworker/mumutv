<template>
  <div class="container">
    <img class="background" src="./assets/twitter.png" alt="" />
    <div class="blank"></div>

    <div class="table">
      <button class="reset" v-on:click="reset()">Reset</button>

      <div
        class="twit"
        v-for="(status, domain) in data.domain_list"
        :key="domain"
      >
        <div class="twit_box" v-if="status !== 'empty'">
          <div class="user_image">
            <img class="profile" src="./assets/profile_twitter.png" alt="" />
          </div>
          <div class="content">
            <p>
              domain : <span class="domain">{{ domain }}</span> is
              <span class="status" :class="class_binding(status)">{{
                status
              }}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive } from "vue";
export default {
  name: "App",
  props: {
    collectionName: String,
  },
  setup(props) {
    props;
    const data = reactive({
      domain_list: {},
    });

    const req_data = () => {
      fetch("/was_twitter")
        .then((response) => {
          return response.json();
        })
        .then((data_from_fetch) => {
          data.domain_list = data_from_fetch;
          console.log("data is " + data_from_fetch);
        })
        .catch((error) => {
          // 오류 처리
          console.error("Error:", error);
        });
    };

    req_data();
    //#E5ECF1

    const reset = () => {
      req_data();
    };

    const class_binding = (status) => {
      if (status == "empty") {
        return "empty";
      } else if (status == "ok") {
        return "ok";
      } else {
        return "detacted";
      }
    };

    return {
      data,
      reset,
      class_binding,
    };
  },
};
</script>

<style lang="scss">
.container {
  width: 100%;
  margin: 0;
  .reset {
    width: 100%;
    height: 50px;
    background-color: #0a0a23;
    color: #fff;
    border: none;
    border-radius: 10px;
    box-shadow: 0px 0px 2px 2px rgb(0, 0, 0);
    font-size: 1.2em;
  }
}
.blank {
  height: 200px;
}
.twit {
  .twit_box {
    margin: 20px;
    padding: 30px;
    border-radius: 5px;
    background-color: white;
    display: flex;
    .user_image {
      width: 100px;
      height: 100px;
      .profile {
        height: 100px;
        width: 100px;
      }
    }
    .content {
      font-size: 1.2em;
      padding-left: 20px;
    }
  }
}
.domain {
  font-size: 1.5em;
  color: blue;
}

.background {
  position: absolute;
  width: 100%;
  z-index: -2;
}

.detacted {
  color: red;
}
.empty {
  color: grey;
}
.ok {
  color: yellowgreen;
  font-size: 1.5em;
}
</style>
