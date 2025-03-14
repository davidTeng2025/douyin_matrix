<template>
  <div class="sbutree-page">
    <div ref="headRef" v-if="sbuList.length > 0">
      <div class="back-title-wrapper">
        <div class="icon-wrapper">
          <van-icon @click="goBack" name="arrow-left" size=".875rem" />
        </div>
        <div class="title">
          <van-search
            class="search-div" v-model="searchValue" placeholder="请输入型号" shape="round" style="width: 60%; margin-left: 0; text-align: left;"
            @search="search" />
        </div>
      </div>
      <div class="head-bg" v-if="!props.sbuOnly">
        <div ref="sbusRef" class="sbus-div" :class="isShowAllSbu ? '' : 'fold'">
          <div class="sbu-div" v-for="item, index in sbuList" :key="index" @click="clickSbu(index)">
            <div class="sbu-img-div" :class="{ 'sub-img-checked': true, active: sbuActiveIndex == index }"><img
                :src="item.image" /> </div>
            <div class="sbu-name" :class="{ 'sbu-name-checked': true, active: sbuActiveIndex == index }">{{
              item.sbu_name }}
            </div>
          </div>
        </div>
        <div v-if="sbuList.length > 5" class="fold-btn" @click="showAllSbu">{{ isShowAllSbu ? '收起' : '全部' }}<div><i
              class="iconfont" :class="isShowAllSbu ? 'icon-toggle-left' : 'icon-toggle-right'" ></i></div>
        </div>
      </div>
      <div class="tab_div" v-if="!props.sbuOnly">
        <div
          v-for="item, index in tabArray" :key="index" @click="tabChange(index)"
          :class="tabActive == index ? 'active' : ''">
          <div>{{ item.title }}</div>
          <div v-if="tabActive == index" class="line"></div>
        </div>
      </div>
    </div>
    <div ref="tabListRef" class="tabList" :style="{ height: tabListHeight }">
      <div v-if="listData.length > 0">
        <div class="dialog-wrapper" v-for="(item, index) in listData" :key="index">
          <div v-if="item.Is_ComingSoon == 'Y'" class="title-img"><img src="@/assets/images/main/comingsoon2.png" />
          </div>
          <div class="title">
            <div class="left-wrapper" @click="showProduct3DImage(item)">
              <div class="left-img-wrapper">
                <div class="square"></div>
                <van-image :src="item.Image" width="6rem" height="6rem" fit="contain" lazy-load />
              </div>
            </div>
            <div class="right-wrapper">
              <div class="icon-div">
                <i v-if="item.Recommend_Level == '1'" class="iconfont icon-tuijian1" ></i>
                <i v-else-if="item.Recommend_Level == '2'" class="iconfont icon-tuijian1" ></i>
                <i v-else-if="item.Recommend_Level == '3'" class="iconfont icon-tuijian1" ></i>
              </div>
              <div>
                <div class="right-title elltext">
                  <div class="top-title">{{ item.SBU }}{{ item.Model }}</div>
                  <div class="tag" v-if="item.Is_AILink == '1' && item.Relation_SBU.indexOf('scene_id') > -1">智慧互联</div>
                  <div class="tag tag-dp" v-else-if="item.Is_AILink == '1'">智慧单品</div>
                </div>
                <div class="right-desc elltext3">{{ item.MainFunction }}</div>
                <div class="right-desc elltext">
                  {{ item.Install_Size }}
                </div>
              </div>
              <BtnList
                buttonStyle="S" :currentItem="item.Model" :showSimilarity="false"
                :showVideo="item.video != '' && item.video != undefined && item.video != null ? true : false"
                :showAdd="item.Is_ComingSoon == 'N' ? true : false" @get-prod-detail="getProdDetail(item)"
                @get-prod-size="getProdSize(item)" @similarity="lookSimilarity(item)" @add="addCart(item, $event)"
                @play-video="playVideo(item.video)" @do-select="handleDoSelect(item)" />
            </div>
          </div>
        </div>
      </div>
      <van-empty v-else image="search" image-size="80" description="暂无数据" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { fetchSBUTreeSort, fetchSimilarModelBySBU, sleep } from "@/api/abpscriptYudao.js";
import { showToast, Icon as VanIcon, Search as VanSearch, Image as VanImage, Empty as VanEmpty } from 'vant';
import BtnList from '@/components/BtnList.vue';

const router = useRouter();
const route = useRoute();

// 从路由参数中获取传递的数据
const routeSbuOnly = computed(() => route.query.sbuOnly === 'true');
const routeSbu = computed(() => route.query.sbu || '');
const routeShowBtn = computed(() => route.query.showBtn === 'true');
const routeShowAdd = computed(() => route.query.showAdd === 'true');

// 添加props接收routeMode属性
const props = defineProps({
  sbuOnly: {
    type: Boolean,
    default: false
  },
  sbu: {
    type: String,
    default: ''
  },
  showBtn: {
    type: Boolean,
    default: true
  },
  showAdd: {
    type: Boolean,
    default: false
  },
  visible: {
    type: Boolean,
    default: false
  },
  // 新增：控制是否使用router模式
  routeMode: {
    type: Boolean,
    default: true
  }
});

const searchValue = ref('');
const activeIndex = ref(0);
const sbuList = ref([]);
const sbuActiveIndex = ref(0);
const tabActive = ref(0);
const tabArray = ref([{ title: '全部', id: '0' }, { title: '智慧互联', id: '1' }, { title: '智慧单品', id: '2' }, { title: '其他', id: '3' }]);
const listData = ref([]);
const headRef = ref(null);
const headRefHeight = ref(0);
const isShowAllSbu = ref(false);
const tabListRef = ref(null);
const tabListHeight = ref('75vh');
const sbusRef = ref(null);

const emit = defineEmits(["moreSub", "getProdDetail", "getProdSize", "similarity", "addCart", "getMoreSceneProduct", "showProduct3DImage", "playVideo", "doSelect", "close"]);
const getProdDetail = (item) => emit("getProdDetail", item);
const getProdSize = (item) => emit("getProdSize", item);
const showProduct3DImage = async (item) => emit("showProduct3DImage", item);
const playVideo = (item) => emit("playVideo", item);
const lookSimilarity = (item) => emit("similarity", item);
const addCart = (item, event) => emit("addCart", item, event);

// 修改handleDoSelect方法
const handleDoSelect = (item) => {
  localStorage.setItem('selectedProduct', JSON.stringify(item));
  
  if (props.routeMode) {
    // 原有的行为 - 使用router.back()
    router.back();
  } else {
    // 新行为 - 仅触发事件，不导航
    emit("doSelect", item);
  }
};

const search = async () => {
  if (sbusRef.value) {
    sbusRef.value.scrollTo({ left: 0, behavior: 'smooth' });
  }
  if (searchValue.value.length == 0) {
    sbuActiveIndex.value = 0;
    clickSbu(sbuActiveIndex.value);
  } else if (searchValue.value.length > 2) {
    sbuActiveIndex.value = -1;
    tabActive.value = 0;
    listData.value = (
      await fetchSimilarModelBySBU({
        data: {
          sbu: props.sbu || routeSbu.value,
          channel: '专卖店',
          cityname: '',
          isailink: '0',
          sceneId: '',
          model: searchValue.value,
          category: '',
          selectOption: ''
        },
      })
    ).data;
    showAllSbu('y');
  } else {
    showToast('请输入至少3个字符');
  }
};

const clickSbu = async (index) => {
  sbuActiveIndex.value = index;
  setTimeout(() => {
    if (sbusRef.value) {
      sbusRef.value.scrollTo({ left: (index - 2 < 0 ? 0 : index - 2) * 4 * 16, behavior: 'smooth' });
    }
  }, 500);
  tabChange(0);
};

const tabChange = async (index) => {
  tabActive.value = index;
  listData.value = (
    await fetchSimilarModelBySBU({
      data: {
        sbu: props.sbuOnly ? props.sbu : searchValue.value.length > 0 && sbuActiveIndex.value == -1 ? '' : sbuList.value[sbuActiveIndex.value].sbu,
        channel: '专卖店',
        cityname: '',
        isailink: tabActive.value.toString(),
        sceneId: '',
        model: searchValue.value,
        category: '',
        selectOption: ''
      },
    })
  ).data;
  showAllSbu('y');
};

const showAllSbu = (needClose) => {
  if (needClose == 'y') {
    isShowAllSbu.value = false;
    setTimeout(() => {
      if(tabListRef.value){
        tabListRef.value.scrollTo(0, 0);
      }
    }, 10);
  } else {
    isShowAllSbu.value = !isShowAllSbu.value;
  }
};

// 修改返回方法，确保返回到正确的步骤
const goBack = () => {
  // 获取返回步骤参数
  const returnToStep = route.query.returnToStep;

  // 如果指定了返回步骤，保存到 localStorage
  if (returnToStep) {
    localStorage.setItem('compositeVideoSavedStep', returnToStep.toString());
  }

  // 返回上一页
  router.back();
};

onMounted(async () => {
  const { data } = await fetchSBUTreeSort();
  sbuList.value = data.filter(item => item.sbu != '').map(item => {
    if (item.sbu != '') {
      let subNmae = '';
      if (item.sbu_name == '燃气热水器') {
        subNmae = '燃热';
      } else if (item.sbu_name == '电热水器') {
        subNmae = '电热';
      } else if (item.sbu_name == 'AI-LiNK智能件') {
        subNmae = '智能件';
      } else {
        subNmae = item.sbu_name;
      }
      return {
        sbu: item.sbu,
        sbu_name: subNmae,
        image: item.image
      }
    }
  });
  
  // 使用 props.sbu 或 routeSbu，确保两者都考虑
  const effectiveSbu = props.sbu || routeSbu.value;
  if (effectiveSbu) {
    const index = sbuList.value.findIndex(item => item.sbu === effectiveSbu);
    if (index !== -1) {
      clickSbu(index);
    } else {
      clickSbu(0);
    }
  } else {
    clickSbu(0);
  }
  
  setTimeout(() => {
    headRefHeight.value = headRef.value != null ? headRef.value.scrollHeight : 0;
    tabListHeight.value = `calc(99% - ${headRefHeight.value}px)`;
  }, 100);
});
</script>

<style scoped lang="less">
@import '@/assets/styles/variables.less';

.sbutree-page {
  height: 100vh;
  width: 100%;
  background-color: #f2f4f5;
  position: relative;
  display: flex;
  flex-direction: column;
}

.tabList::-webkit-scrollbar {
  display: none;
  scrollbar-width: none;
  -ms-overflow-style: none;
  width: 0;
}

.head-bg {
  background: @product-bdColor;
  position: relative;
  margin-top: -1px;
}

.fold-btn {
  position: absolute;
  font-size: @product-title-size;
  font-weight: @product-title-weight;
  right: 0;
  top: 0;
  width: 1rem;
  height: 5.5rem;
  padding: 1rem 1.5rem 0 1.5rem;
  background-color: @product-bdColor;
  display: flex;
  align-content: center;
  justify-content: center;
  flex-wrap: wrap;
}

.fold {
  white-space: nowrap;
  padding-right: 4rem !important;
}

.sbus-div {
  font-size: @product-small-title-size;
  background: @product-bdColor;
  overflow-x: scroll;
  background-color: @product-bdColor;
  padding-right: 0;

  .sbu-div {
    width: 4rem;
    display: inline-block;

    .sbu-img-div {
      width: 3rem;
      height: 3rem;
      border-radius: 50%;
      margin: 0.25rem auto;
      position: relative;

      img {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 70%;
      }
    }

    .sub-img-checked {
      background-image: url(@/assets/images/main/bubble-0.png);
      background-size: 100% 100%;

      &.active {
        background-color: #fff;
        background-image: url(@/assets/images/main/bubble-1.png);
        background-size: 100% 100%;
        width: 3.5rem;
        height: 3.5rem;
      }
    }

    .sbu-name {
      width: 3.5rem;
      margin: 0.25rem auto;
      color: @border-font-color;
      border: 0.5px solid @border-font-color;
      text-align: center;
      border-radius: @border-radius-s;
      font-size: @product-small-desc-size;
    }

    .sbu-name-checked {
      &.active {
        color: #fff;
        background: linear-gradient(180deg, #243b70, #6384ba);
      }
    }
  }
}

.tab_div {
  font-size: @product-title-size;
  display: flex;
  align-items: center;
  background: @product-bdColor;
  color: #212121;

  .active {
    color: #253C70;
    font-weight: @product-title-weight;
  }

  >div {
    flex: 1;
    text-align: center;
    padding: 0.5rem 0 0.25rem 0;
    position: relative;

    .line {
      position: absolute;
      bottom: 0;
      left: 50%;
      transform: translateX(-50%);
      width: 2rem;
      height: 0.1875rem;
      background-color: #253C70;
    }
  }
}

.tabList {
  font-size: @product-small-title-size;
  overflow-y: scroll;
  background-color: #f2f4f5;
}

.back-title-wrapper {
  width: 100%;
  height: 3rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
  background-color: @product-bdColor;

  .icon-wrapper {
    background-color: #ddd;
    border-radius: 50%;
    width: 1.875rem;
    height: 1.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  .title {
    font-size: @product-small-title-size;
    color: @border-font-color;
    margin-left: 0.5rem;
    width: 70%;

    .search-div {
      background-color: @product-bdColor;
    }
  }

  .right {
    border-radius: 50%;
    width: 1.875rem;
    height: 1.875rem;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;

    .brage {
      position: absolute;
      top: 0;
      right: 0rem;
      width: 1rem;
      height: 1rem;
      border-radius: 50%;
      background-color: #e90505;
      color: #fff;
      font-size: 0.75rem;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 9;
    }
  }
}

.dialog-wrapper {
  width: 100%;
  border-radius: @border-radius-s;
  padding: 0.625rem;
  background-color: #fff;
  position: relative;
  margin-top: @product-padding-margin-m;

  .title-img {
    width: 2rem;
    position: absolute;
    top: 0;
    left: 0;

    img {
      width: 100%;
    }
  }

  .title {
    width: 100%;
    display: flex;
    align-items: center;

    .left-wrapper {
      flex: 1;

      .img-title {
        font-size: 1rem;
        width: 3.6875rem;
        margin: auto;
        text-align: center;
        border: 1px solid #212121;
        border-radius: 0.25rem;
        font-size: 0.8rem;
      }

      .left-img-wrapper {
        position: relative;
        align-self: start;
        width: 6rem;
        height: 6rem;
        padding: 0.5rem;
        margin-right: 0.4375rem;
        display: flex;
        align-items: center;

        .square {
          width: 6rem;
          height: 6rem;
          position: absolute;
          border-radius: 0.4rem;
          margin: 0 0 0 -0.5rem;
        }

        img {
          width: 100%;
          max-height: 100%;
          object-fit: cover;
        }
      }
    }

    .right-wrapper {
      flex: 6;
      position: relative;

      .icon-div {
        position: absolute;
        top: 0.2rem;
        left: -1.5rem;
        color: #ff0015;

        i {
          font-size: 1rem;
        }
      }

      .right-title {
        width: 100%;
        font-size: @product-title-size;
        font-weight: 500;
        word-break: break-all;
        display: flex;

        .top-title {
          width: 10rem;
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
        }

        .tag {
          width: 4rem;
          padding: 0 0.25rem;
          border-radius: 0.3125rem;
          font-size: 0.625rem;
          border: 1px solid #253C70;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .tag-dp {
          border: 1px solid #253C70 !important;
        }
      }

      .right-desc {
        color: @hgray;
        font-size: @product-medium-desc-size;
        width: 100%;
        word-break: break-all;
      }
    }
  }
}
</style>

<style scoped>
:deep(.van-tabs__content) {
  padding: 0.625rem;
}

:deep(.van-search__content) {
  background-color: #fff;
}

:deep(.van-tabs__nav) {
  background-color: #f2f4f5;
}

:deep(.van-tabs__line) {
  background-color: #253C70;
}
</style> 