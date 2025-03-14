<template>
  <div class="btn-list" :style="mobileOrPad == 'pad' ? {marginTop: '0.25rem'}: {marginTop: '0.625rem'}">
    <button
class="van-haptics-feedback" @click="getProdDetail" v-if="showDetail" :style="{
        color: props.type === 'primary' ? '#fff' : '#1989FA',
        marginRight: props.buttonStyle =='l' ? '0.4rem' : '0.2rem',
        height: props.buttonStyle=='l'?'2rem':'1.3rem',
        width: props.buttonStyle=='l'?'5rem':'3.4rem',
        fontSize: props.buttonStyle=='l'?'0.75rem':'0.625rem',
      }">
      产品详情
    </button>
    <button
class="van-haptics-feedback" @click="playVideo" v-if="showVideo" :style="{
        color: props.type === 'primary' ? '#fff' : '#1989FA',
        marginRight: props.buttonStyle =='l' ? '0.4rem' : '0.2rem',
        height: props.buttonStyle=='l'?'2rem':'1.3rem',
        width: props.buttonStyle=='l'?'5rem':'3.4rem',
        fontSize: props.buttonStyle=='l'?'0.75rem':'0.625rem'
      }">
      产品视频
    </button>
    <button
class="van-haptics-feedback" @click="getProdSize" v-if="showSize" :style="{
        color: props.type === 'primary' ? '#fff' : '#1989FA',
        marginRight: props.buttonStyle =='l' ? '0.4rem' : '0.2rem',
        height: props.buttonStyle=='l'?'2rem':'1.3rem',
        width: props.buttonStyle=='l'?'5rem':'3.4rem',
        fontSize: props.buttonStyle=='l'?'0.75rem':'0.625rem'
      }">
      尺寸图
    </button>
    <button
class="van-haptics-feedback" @click="similarity" :style="{
        color: props.type === 'primary' ? '#fff' : '#1989FA',
        marginRight: props.buttonStyle =='l' ? '0.4rem' : '0.2rem',
        height: props.buttonStyle=='l'?'2rem':'1.3rem',
        width: props.buttonStyle=='l'?'5rem':'3.4rem',
        fontSize: props.buttonStyle=='l'?'0.75rem':'0.625rem'
      }" v-if="showSimilarity">
      换型号
    </button>
    <button
class="van-haptics-feedback" @click="doSelect" :style="{
        color: props.type === 'primary' ? '#fff' : '#1989FA',
        marginRight: props.buttonStyle =='l' ? '0.4rem' : '0.2rem',
        height: props.buttonStyle=='l'?'2rem':'1.3rem',
        width: props.buttonStyle=='l'?'5rem':'3.4rem',
        fontSize: props.buttonStyle=='l'?'0.75rem':'0.625rem'
      }">
      使用
    </button>
  </div>
</template>

<script setup>
import { showToast } from "vant";
import { computed } from "vue";

const emit = defineEmits(["getProdDetail", "getProdSize", "similarity", "playVideo", "add", "doSelect"]);
const props = defineProps({
  showSize: {
    type: Boolean,
    default: true,
  },
  showVideo: {
    type: Boolean,
    default: false,
  },
  showDetail: {
    type: Boolean,
    default: true,
  },
  showSimilarity: {
    type: Boolean,
    default: true,
  },
  showAdd: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: "primary",
  },
  iconSize: {
    type: Number,
    default: 24
  },
  buttonStyle: {
    type: String,
    default: 'l'
  },
  currentItem: {
    type: String,
    default: ''
  },
  cartIndex: {
    type: Number,
    default: 0
  },
  mobileOrPad: {
    type: String,
    default: 'mobile',
  },
});

const getProdDetail = async () => {
  emit("getProdDetail");
};

const getProdSize = async () => {
  emit("getProdSize");
};

const similarity = () => {
  emit("similarity", props.cartIndex);
};

const add = (event) => {
  emit("add", event);
};

const playVideo = () => {
  emit("playVideo");
};

const doSelect = (event) => {
  emit("doSelect", event);
};
</script>

<style scoped lang="less">
.btn-list {
  display: flex;
  align-items: center;

  .add {
    border-radius: 50%;
    font-size: 1.25rem;
  }

  // 下面第一个button
  button:first-child {
    margin-right: 0.625rem;
  }

  button {
    // flex: 2;
    border-radius: 0.25rem;
    font-size: 0.625rem;
    padding-left: 0;
    padding-right: 0;
    width: 3.125rem;
    background: linear-gradient(to bottom, #253C70, #5F80B5);
  }
}
</style> 