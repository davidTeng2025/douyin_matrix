<template>
  <van-popup v-model:show="showPopup" position="bottom" :style="{fontSize:0,height: '100vh',width:'100vw' }" @opened="showPreviewImg">
    <div
class="back-title-wrapper" :style="{
      backgroundColor: bgColor,
    }">
    <div class="icon-wrapper" @click="close">
      <van-icon name="arrow-left" size=".875rem" />
    </div>
    <div class="title">
      <van-row>
        <van-col span="4"/>
        <van-col span="16">
          <van-tabs v-model:active="active" background="transparent" v-if="showDetail">
            <van-tab title="详情页"/>
            <!-- <van-tab title="安装尺寸">
            </van-tab>
            <van-tab title="产品尺寸">
            </van-tab> -->
          </van-tabs>
          <van-tabs v-model:active="active" background="transparent" v-if="!showDetail">
            <van-tab title="安装尺寸"/>
            <!-- <van-tab title="产品尺寸">
            </van-tab> -->
          </van-tabs>
          <!-- <van-button color="#333" style="margin-left:0;width:4rem;border-radius:0;border-top-left-radius: 100px;border-bottom-left-radius:100px;" type="primary" size="small" :plain="active!=0" @click="active=0">详情页</van-button>
          <van-button color="#333" style="margin-left:0;width:4rem;border-radius:0;" type="primary" size="small" :plain="active!=1" @click="active=1">产品尺寸</van-button>
          <van-button color="#333" style="margin-left:0;width:4rem;border-radius:0;border-top-right-radius: 100px;border-bottom-right-radius:100px;" type="primary" size="small" :plain="active!=2" @click="active=2">安装尺寸</van-button> -->
        </van-col>
        <van-col span="4"/>
      </van-row>
    </div>
  </div>
  <div class="box" :style="{ height:'8vh' }"></div>
  <van-tabs v-model:active="active" :show-header="false" animated>
    <van-tab title="详情页" v-if="showDetail">
      <div>123AA{{ materialId.length }}</div>
      <Empty v-if="materialId.length < 3" description="内容持续上新中"/>
      <div v-else>
        <iframe v-if="showPopup" :src="materialUrl" border="no" style="width:100%;height:92vh;border:none;overflow:hidden;" ></iframe>
      </div>
    </van-tab>
    <van-tab title="标签 3">
      <Empty v-if="installUrl==''" description="内容持续上新中"/>
      <van-image v-else :src="installUrl" width="100%" style="padding:1rem;" @click="showPreivew(installUrl)"/>
    </van-tab>
    <van-tab title="标签 2">
      <Empty v-if="productUrl==''" />
      <van-image v-else :src="productUrl" width="100%" style="padding:1rem;" @click="showPreivew(productUrl)"/>
    </van-tab>
  </van-tabs>
    </van-popup>
</template>

<script setup>
import { computed, watch, ref } from "vue";
import { useRouter } from "vue-router";
import { showToast, showImagePreview, Popup as VanPopup, Icon as VanIcon, Row as VanRow, Col as VanCol, Tabs as VanTabs, Tab as VanTab, Image as VanImage } from 'vant';
import Empty from "@/components/Empty.vue";

const props = defineProps({
  isBack: {
    type: Boolean,
    default: true,
  },
  bgColor: {
    type: String,
    default: "#efefef",
  }
})
const router = useRouter();
const showPopup = ref(false);
const materialId = ref('');
const materialUrl = ref('');
const productUrl = ref('');
const installUrl = ref('');
const active =ref(0);
const showDetail = ref(true);
const showType = ref('');

const close = () => {
  showPopup.value = false;
};

const initDialog = (data) => {
  // console.log('******xd**data****',data);
  active.value = 0;
  // console.log('******xd**${data.material_id}****',data.material_id);
  if (data.material_id != '') {
    // console.log('******xd**${data.material_id}****',data.material_id);
    materialId.value = data.material_id;
    materialUrl.value = `https://nextm.aosmarketing.com.cn/campaign/#/material?id=${data.material_id}`;
  } else {
    materialId.value = '';
  }
  // console.log('******xd**materialId.value****',materialId.value);
  productUrl.value = data.product_size_image;
  installUrl.value = data.install_size_image;
  showPopup.value = true;
  if (data.type == 'size') {
    showDetail.value = false;
    showType.value = 'size';
  } else {
    showDetail.value = true;
    showType.value = 'detail';
  }
};

const showPreivew = (url) => {
  if (showType.value == 'size') {
    showImagePreview({
      images: [
        url
      ],closeable:true
    });
  }
};

const showPreviewImg = () => {
  if(installUrl.value.length>0) {
    showPreivew(installUrl.value);
  }
}

defineExpose({
  initDialog
});

</script>

<style scoped lang="less">
.back-title-wrapper {
  width: 100%;
  height: 8vh;
  // 固定定位在顶部
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  padding-left: 1rem;
  .icon-wrapper {
    z-index: 2;
    background-color: #ddd;
    border-radius: 50%;
    width: 1.875rem;
    height: 1.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .title {
    position: absolute;
    width:100%;
    font-size: 1rem;
    // font-weight: 500;
    color: #000;
    // margin-left: 1rem;
    text-align: center;
    margin-left: -1rem;
  }
}
.box {
  width: 100%;
}
</style> 