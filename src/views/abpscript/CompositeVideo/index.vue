<template>
  <div class="video-template-container">
    <!-- Header -->
    <div class="header">
      <h2>视频合成</h2>
    </div>

    <!-- 步骤导航 -->
    <div class="module-navigation">
      <el-button
        v-for="step in steps"
        :key="step.id"
        class="step-button"
        :class="{ 'selected-button': currentStep === step.id }"
        @click="goToStep(step.id)"
      >
        {{ step.label }}
      </el-button>
    </div>

    <!-- 当前步骤的内容 -->
    <div v-if="currentStep === 1" class="content">
        <!-- 提示语句 -->
        <p class="description">
          请挑选视频模板，模板的结构、开头、结尾将复用到最终合成的视频。
        </p>
    
        <!-- 产品类型 -->
        <div class="product-type-wrapper">
            <p class="product-type-title">选择产品类型</p>
            <div class="product-type-container">
                <el-button
                v-for="item in sbuList"
                :key="item"
                class="product-type-button"
                :class="{ 'selected-button': selectedSbu === item }"
                @click="selectSbu(item)"
                >
                {{ item }}
                </el-button>
            </div>
        </div>
        
        <!-- 视频模板 -->
        <div class="video-template-wrapper">
            <div class="video-template-header">
                <p class="video-template-title">选择视频模板</p>
                <div class="button-group">
                    <el-button
                        class="selection-button"
                        :class="{ 'selected-button': videoTemplateSelectionMode === 'manual' }"
                        @click="setVideoTemplateSelectionMode('manual')"
                    >
                        手动选择
                    </el-button>
                    <el-button
                        class="selection-button"
                        :class="{ 'selected-button': videoTemplateSelectionMode === 'random' }"
                        @click="setVideoTemplateSelectionMode('random')"
                    >
                        随机选择
                    </el-button>
                </div>
            </div>

            <!-- 手动选择模式 -->
            <div v-if="videoTemplateSelectionMode === 'manual'" class="video-template-grid">
                <div
                    class="video-template-card"
                    v-for="videoTemplate in videoTemplates"
                    :key="videoTemplate.video_template_id"
                    :class="{ 'selected-template': selectedVideoTemplate?.video_template_id === videoTemplate.video_template_id }"
                    @click="selectAndPlayVideo(videoTemplate)"
                >
                    <img
                    :src="videoTemplate.video_cover_url"
                    class="video-cover"
                    alt="Video Cover"
                    />
                    <div class="template-info">
                        <span>产品功能展示模板</span>
                        <span>创建于 {{ formatDate(videoTemplate.updated_time) }}</span>
                    </div>
                </div>
            </div>

            <!-- 随机选择模式 -->
            <div v-if="videoTemplateSelectionMode === 'random'" class="random-selection">
                <p class="random-description">
                输入您期望获取的视频模板数量，我们将为您精心挑选合适的模板
                </p>
                <el-input
                v-model="randomTemplateCount"
                placeholder="请输入 1-10 之间的数字"
                type="number"
                min="1"
                max="10"
                class="random-input"
                />
            </div>
        </div>
        
        <!-- 下一步按钮 -->
        <div class="footer">
            <el-button class="next-step-button" type="primary" @click="nextStep">
            下一步
            </el-button>
        </div>
    </div>


    <!-- "挑选数字人" 界面 -->
    <div v-if="currentStep === 2" class="content">
      <p class="description">请挑选数字人，数字人形象将用于生成产品介绍的口播视频。若同时选择多个数字人，则可生成多个视频</p>
      <!-- 数字人视频 -->

      <div class="video-template-wrapper">
          <div class="video-template-header">
              <p class="video-template-title">选择数字人视频</p>
              <div class="button-group">
                  <el-button
                      class="selection-button"
                      :class="{ 'selected-button': abpVideoSelectionMode === 'manual' }"
                      @click="setAbpVideoSelectionMode('manual')"
                  >
                      手动选择
                  </el-button>
                  <el-button
                      class="selection-button"
                      :class="{ 'selected-button': abpVideoSelectionMode === 'random' }"
                      @click="setAbpVideoSelectionMode('random')"
                  >
                      随机选择
                  </el-button>
              </div>
          </div>
        
          <div v-if="abpVideoSelectionMode === 'manual'" class="video-template-grid">
            <div
                class="video-template-card"
                v-for="video in abpVideos"
                :key="video.uuid"
                :class="{ 'selected-template': selectedAbpVideo?.uuid === video.uuid }"
                @click="selectAbpVideo(video)"
            >
              <img
                :src="video.video_cover_url"
                class="video-cover"
                alt="Video Cover"
              />
              <div class="template-info">
                <span>{{ video.person_name }}</span>
                <span>创建于 {{ formatDate(video.updated_time) }}</span>
              </div>
            </div>
          </div>

          <!-- 随机选择模式 -->
          <div v-if="abpVideoSelectionMode === 'random'" class="random-selection">
              <p class="random-description">
              输入您期望获取的视频模板数量，我们将为您精心挑选合适的模板
              </p>
              <el-input
              v-model="randomAbpVideoCount"
              placeholder="请输入 1-10 之间的数字"
              type="number"
              min="1"
              max="10"
              class="random-input"
              />
          </div>
      </div>
      <div class="footer">
          <el-button class="next-step-button" type="primary" @click="nextStep">
          下一步
          </el-button>
      </div>
    </div>

    <!-- "生成口播脚本" 界面 -->
    <div v-if="currentStep === 3" class="content">
      <div class="select-template">
        <div style="font-size: 13px; color: black; padding-left: 15px; margin-top:10px; margin-bottom:5px;">
          请选择产品型号生成口播脚本。生成后可按您的需求修改文案，调整文案顺序。
        </div>

        <div class="div-product">

          <div 
            @click="currentStep === 3 ? moreSub() : null" 
            class="div-product-chose"
            :style="currentStep !== 3 ? 'cursor: not-allowed; opacity: 0.7;' : 'cursor: pointer;'"
          >
            <div>
              <div style="font-size: 18px; font-weight: bold;">产品</div>
              <!-- <div style="font-size: 14px; padding-top: 15px; color:gray">请选择想要推荐的产品</div> -->
            </div>
            <img :src="getImageSrcNew" style="height: 30px; width: auto; margin-left: 8px;"/>
          </div>

          <div v-if="isSelected">
            <div class="product-item">
              <!-- xmc 2025年2月27日12:33:28 域名没有设置为hotwater导致图片加载不出来 暂时不加载图片 -->
              <!-- <div class="item-img"><img :src="selectedItem.Image" /></div> -->
              <div class="item-content">
                <div class="title1">{{ selectedItem.SBU + ': ' + selectedItem.Model }}</div>
              </div>
            </div>
            <div style="text-align: center; margin-top: 20px;">
              <el-button
                type="primary"
                size="large"
                :loading="isLoading"
                @click="handleButtonClick"
                style="font-size: 18px; width: 320px; background-color: #4f46e5; color: #FFFFFF; font-weight: bold; letter-spacing: 3px;"
              >
                {{ isLoading ? '加载中...' : '生成口播脚本' }}
              </el-button>
            </div>
            <!-- 显示加载状态 -->
            <div v-if="isLoading" style="text-align: center; margin-top: 20px;">
              <div class="el-loading-spinner">
                <svg class="circular" viewBox="25 25 50 50">
                  <circle class="path" cx="50" cy="50" r="20" fill="none" />
                </svg>
                <p class="el-loading-text">加载中...</p>
              </div>
            </div>
          </div>
        </div>
        <!-- <div class="div-broadcast-script">
          <div style="font-size: 18px; font-weight: bold;">口播脚本</div>
          <div class="list-div">
            <div v-for="(item, index) in listScript" :key="index" class="list-btn-div">
              <div>
                <van-icon 
                  :name="item.type == 'human' ? 'manager' : 'video'" 
                  size="20"
                  style="margin-left: 5px; margin-right: 5px; color:#4DC592;" 
                />
              </div>
              <div class="item-script">
                <van-field
                  v-model="item.script"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 15 }"
                  label=""
                  :disabled="item.disable"
                />
              </div>
              <div>
                <van-icon
                  v-if="item.type == 'human'" 
                  name="edit" 
                  size="20"
                  style="margin-left: 5px; margin-right: 5px; color:#4DC592;"
                  @click="item.disable = !item.disable" 
                />
              </div>
            </div>
          </div>
        </div> -->
        <div class="div-broadcast-script">
          <div style="font-size: 18px; font-weight: bold;">口播脚本</div>
          <div class="list-div">
            <div v-for="(item, index) in listScript" :key="index" class="list-btn-div">
              <div>
                <van-icon 
                  :name="item.type == 'human' ? 'manager' : 'video'" 
                  size="20"
                  style="margin-left: 5px; margin-right: 5px; color:#4DC592;" 
                />
              </div>
              <div class="item-script">
                <van-field
                  v-model="item.script"
                  type="textarea"
                  :autosize="{ minRows: 10, maxRows: 15 }"
                  label=""
                  :disabled="item.disable"
                />
              </div>
              <div>
                <van-icon
                  v-if="item.type == 'human'" 
                  name="edit" 
                  size="20"
                  style="margin-left: 5px; margin-right: 5px; color:#4DC592;"
                  @click="item.disable = !item.disable" 
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div style="text-align: center; padding: 5px;">
        <el-button
          v-if="showCompositionButton"
          type="primary"
          size="large"
          style="font-size: 18px; width: 320px; background-color: #4f46e5; color: #FFFFFF; font-weight: bold; letter-spacing: 3px;"
          @click="VideoComposition()"
        >
          立即合成
        </el-button>
      </div>
    </div>

    <MaterialPreview ref="MaterialPreviewRef" />

    <!-- 修改SbuTree组件，添加Dialog包装 -->
    <el-dialog
      v-model="sbuTreeVisible"
      title="选择产品"
      width="60%"
      :destroy-on-close="true"
      :close-on-click-modal="false"
      @close="closeSbuTree"
      custom-class="sbu-tree-dialog"
    >
      <SbuTree
        ref="SbuTreeRef"
        :showBtn="false"
        :showAdd="true"
        :sbu="selectedSbu"
        :sbuOnly="true"
        :visible="true"
        :route-mode="false"
        @get-prod-detail="getProdDetail"
        @get-prod-size="getProdSize"
        @show-product3-d-image="showProduct3DImage"
        @play-video="playVideo"
        @do-select="doSelect"
        @close="closeSbuTree"
      />
    </el-dialog>

    <!-- 视频播放弹窗 -->
    <el-dialog v-model="isVideoDialogVisible" width="50%" @close="stopVideo">
      <video
        v-if="currentVideoUrl"
        ref="videoPlayer"
        :src="currentVideoUrl"
        controls
        autoplay
        style="width: 100%; max-height: 400px;"
      ></video>
    </el-dialog>
  </div>
</template> 

<script setup>
import { ref, watch, onMounted, reactive, computed } from 'vue';
import { useRouter } from 'vue-router';
import dayjs from 'dayjs';
import SbuTree from '@/components/SbuTree.vue';
import MaterialPreview from '@/components/MaterialPreview.vue';
import { getSbuList, getVideoTemplateBySbu, getAbpTemplateVideo } from '@/api/abpscriptYudao.js';
import { getUserProfile } from "@/api/system/user/profile";
import { ElMessage, ElDialog, ElButton, ElInput, ElLoading } from 'element-plus';

// xmc 2025年2月26日08:58:56 sbutree + 合成
import { sleep, getOralVideo, fetchMaterialIdByModel, fetchProduct3DImage, getOralScript } from "@/api/abpscriptYudao.js";
import { showToast, showImagePreview, Icon as VanIcon, Field as VanField } from 'vant';

// 引入 Element Plus 样式
import 'element-plus/theme-chalk/base.css'; // 通用样式
import 'element-plus/theme-chalk/el-dialog.css'; // 对话框
import 'element-plus/theme-chalk/el-loading.css'; // Loading 组件的样式
import 'element-plus/theme-chalk/el-input.css'; // 输入框
import 'element-plus/theme-chalk/el-button.css'; // 按钮
import 'element-plus/theme-chalk/el-message.css'; // 消息提示样式

// 引入 Vant 组件样式
import 'vant/lib/index.css'; // Vant 的样式

const empId = ref(""); // 定义 empId 为响应式变量
// 加载登录用户信息
const login_state = reactive({
  user: {
    userName: "", // 默认值为空字符串
    phonenumber: "",
    email: "",
    dept: { deptName: "" }, // 确保 dept 是一个对象
    createTime: ""
  },
  roleGroup: "", // 默认值为空字符串
  postGroup: "" // 默认值为空字符串
});

// 加载界面信息
const router = useRouter();
const sbuList = ref([]);
const selectedSbu = ref('');
const videoTemplates = ref([]);
const videoTemplateSelectionMode = ref('manual'); // 当前选择模式，默认为手动选择
const randomTemplateCount = ref(''); // 随机选择的模板数量
const selectedVideoTemplate = ref(null); // 选中的视频模板
const isVideoDialogVisible = ref(false);
const currentVideoUrl = ref('');
const currentStep = ref(1);
const videoPlayer = ref(null); // 视频控件引用
const scriptContent = ref(''); // 口播脚本内容
const steps = [
  { id: 1, label: '① 挑选视频模板' },
  { id: 2, label: '② 挑选数字人' },
  { id: 3, label: '③ 生成口播脚本' },
];
// 数字人参数
const abpVideos = ref([]); // 数字人视频列表
const selectedAbpVideo = ref(null); // 当前选中的数字人视频

const abpVideoSelectionMode = ref('manual'); // abp视频当前选择模式，默认为手动选择
const randomAbpVideoCount = ref(''); // 随机选择的abp视频数量

// sbutree加载 参数
const selectedItem = ref(0);
const scriptText = ref('');
const SbuTreeRef = ref(null);
const isSelected = ref(false);
const needEnable = ref(false);
const showCompositionButton = ref(false);
const MaterialPreviewRef = ref(null);
const listScript = ref([]);
let wholeBroadcastScript;

// 添加控制SbuTree显示的状态变量
const sbuTreeVisible = ref(false);

// >>======================================== 函数
// 获取用户信息
const getUser = async () => {
  try {
    const response = await getUserProfile();
    login_state.user = response.data || {};
    login_state.roleGroup = response.roleGroup || "";
    login_state.postGroup = response.postGroup || "";

    // 数据加载完成后更新 empId
    empId.value = login_state.user.userName;
    console.log("当前登录的账号为：", empId.value);

    empId.value = 'CE2E5A99D51E4EA58145164AE23E44CE';
    console.log("当前登录的账号为：", empId.value);
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

const formatDate = (dateStr) => {
  const date = new Date(dateStr);
  const options = { year: 'numeric', month: '2-digit', day: '2-digit' };
  return date.toLocaleDateString('zh-CN', options);
};

const fetchSbuList = async () => {
  try {
    const response = await getSbuList();
    if (response.code === 0) {
      sbuList.value = response.data;
      if (sbuList.value.length > 0) {
        selectedSbu.value = sbuList.value[0];
        fetchVideoTemplates(selectedSbu.value);
      }else {
        selectedSbu.value = '';
      }
    }
  } catch (error) {
    console.error('获取产品类型列表失败', error);
  }
};

// 切换选择模式
const setVideoTemplateSelectionMode = (mode) => {
  videoTemplateSelectionMode.value = mode;
  if (mode === 'manual') {
    randomTemplateCount.value = ''; // 清空随机选择的输入框
  }
};

const fetchVideoTemplates = async (sbu) => {
  try {
    const response = await getVideoTemplateBySbu(sbu);
    if (response.code === 0) {
      videoTemplates.value = response.data;
    }
  } catch (error) {
    console.error('获取视频模板失败', error);
  }
};

const selectSbu = (item) => {
    // 切换到新的 SBU
    selectedSbu.value = item;

    // 获取新的视频模板列表
    fetchVideoTemplates(item).then(() => {
        // 检查当前选中的模板是否仍然有效
        if (selectedVideoTemplate.value) {
            const isTemplateValid = videoTemplates.value.some(
                (template) => template.video_template_id === selectedVideoTemplate.value?.video_template_id
            );
            // 如果选中的模板无效，说明不在当前的sbu列表中，无需操作
        }
    });
};

// 如果模板没有被选中，则选中；如果模版已经被选中了，则表示取消，取消同时不需要播放视频
const selectAndPlayVideo = (videoTemplate) => {
  if (selectedVideoTemplate.value?.video_template_id === videoTemplate.video_template_id) {
      // 如果点击的是当前选中的模板，则取消选中
      selectedVideoTemplate.value = null;
  } else {
      // 如果点击的是其他模板，则选中该模板
      selectedVideoTemplate.value = videoTemplate;
      currentVideoUrl.value = videoTemplate.video_url; // 设置视频播放地址
      isVideoDialogVisible.value = true; // 打开视频播放弹窗
  }
};

const stopVideo = () => {
  isVideoDialogVisible.value = false;
  // 停止视频播放
  const video = videoPlayer.value;
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  // 清空视频 URL，确保资源被释放
  currentVideoUrl.value = '';
};

// 获取数字人视频数据
const fetchAbpVideos = async () => {
  if (abpVideos.value.length > 0) {
    // 如果数据已经加载过，则不再重复请求
    return;
  }
  try {
    const response = await getAbpTemplateVideo({ empId: empId.value });
    abpVideos.value = response.data || [];
  } catch (error) {
    console.error('获取数字人视频失败:', error);
  }
};

// 选中或取消选中数字人视频
const selectAbpVideo = (video) => {
  if (selectedAbpVideo.value?.uuid === video.uuid) {
    // 如果点击的是当前选中的视频，则取消选中
    selectedAbpVideo.value = null;
  } else {
    // 如果点击的是其他视频，则选中该视频
    selectedAbpVideo.value = video;
    currentVideoUrl.value = video.video_url; // 设置视频播放地址
    isVideoDialogVisible.value = true; // 打开视频播放弹窗
  }
};

// abpVideo切换选择模式
const setAbpVideoSelectionMode = (mode) => {
  abpVideoSelectionMode.value = mode;
  if (mode === 'manual') {
    randomAbpVideoCount.value = ''; // 清空随机选择的输入框
  }
};

// 监听 currentStep 的变化
watch(currentStep, (newStep) => {
  if (newStep === 2) {
    // 当进入步骤 2 时加载数字人视频数据
    fetchAbpVideos();
  }
});
  
const nextStep = () => {
  console.log("选中的视频模板是：", selectedVideoTemplate);
  if (currentStep.value === 1){
      if (videoTemplateSelectionMode.value === 'manual' && !selectedVideoTemplate.value) {
          // 使用 Element Plus 的消息提示组件
          ElMessage({
          message: '请选择一个视频模板或者填写随机视频模板个数',
          type: 'warning',
          center: true, // 消息居中显示
          duration: 3000, // 持续时间（毫秒）
          });
          return;
      }
      else if (videoTemplateSelectionMode.value === 'random') {
          // 随机选择模式，校验输入的数字
          const count = parseInt(randomTemplateCount.value, 10);
          if (isNaN(count) || count < 1 || count > 10) {
              // 使用 Element Plus 的消息提示组件
              ElMessage({
              message: '请输入 1-10 之间的数字',
              type: 'warning',
              center: true, // 消息居中显示
              duration: 3000, // 持续时间（毫秒）
              });
              return;
          }
          console.log(`随机选择 ${count} 个视频模板`);
          // 在这里可以添加随机选择逻辑
      }
  }
  if (currentStep.value === 2){
      if (abpVideoSelectionMode.value === 'manual' && !selectedAbpVideo.value) {
          // 使用 Element Plus 的消息提示组件
          ElMessage({
          message: '请选择一个视频模板或者填写随机视频模板个数',
          type: 'warning',
          center: true, // 消息居中显示
          duration: 3000, // 持续时间（毫秒）
          });
          return;
      }
      else if (videoTemplateSelectionMode.value === 'random') {
          // 随机选择模式，校验输入的数字
          const count = parseInt(randomTemplateCount.value, 10);
          if (isNaN(count) || count < 1 || count > 10) {
              // 使用 Element Plus 的消息提示组件
              ElMessage({
              message: '请输入 1-10 之间的数字',
              type: 'warning',
              center: true, // 消息居中显示
              duration: 3000, // 持续时间（毫秒）
              });
              return;
          }
          console.log(`随机选择 ${count} 个视频模板`);
          // 在这里可以添加随机选择逻辑
      }
  }
  if (currentStep.value === 3) {
      // 仅在第三步时允许弹出产品列表
      moreSub();
      return; // 直接返回，不改变步骤
  }
  if (currentStep.value < 3) {
      currentStep.value += 1;
  } else {
      console.log('完成！');
  }
};

const goToStep = (stepId) => {
  // 只允许从后往前跳，不能从前往后跳
  if (stepId <= currentStep.value) {
      currentStep.value = stepId;
  } else {
      // alert('请按顺序完成步骤！');
      // 使用 Element Plus 的消息提示组件
      ElMessage({
      message: '请按顺序完成步骤！',
      type: 'warning',
      center: true, // 消息居中显示
      duration: 3000, // 持续时间（毫秒）
      });
      return;
  }
};

const submitScript = () => {
  console.log('提交的脚本内容:', scriptContent.value);
  alert('脚本已提交！');
};

const moreSub = async () => {
  console.log('moreSub: currentStep =', currentStep.value);
  console.log('moreSub: sbuTreeVisible =', sbuTreeVisible.value);
  if (currentStep.value !== 3) return; // 确保只有在第三步时执行

  showCompositionButton.value = false;
  listScript.value.length = 0;

  // 打开 SbuTree 弹窗
  sbuTreeVisible.value = true;
};

const getBroadcastScript = async () => {
    try {
        let res = null;
        let model = selectedItem.value.Model;
        let emp_id = empId.value; // 从界面变量获取 emp_id
        let digital_human_id = selectedAbpVideo.value.uuid; // 从界面变量获取 digital_human_id
        let video_template_id = selectedVideoTemplate.value.video_template_id; // 从界面变量获取 video_template_id
        console.log('model:', model);
        console.log('emp_id:', emp_id);
        console.log('digital_human_id:', digital_human_id);
        console.log('video_template_id:', video_template_id);
        // 清空 listScript 的内容
        listScript.value.length = 0;

        // 调用 getOralScript API
        res = await getOralScript({
            data: {
                emp_id: emp_id,
                model: model,
                digital_human_id: digital_human_id,
                video_template_id: video_template_id
            }
        });

        // 输出完整响应，帮助调试
        console.log('API响应完整数据:', JSON.stringify(res));

        // 检查是否是直接的数据结构还是嵌套的结构
        let responseData;
        if (res.data.code === 0 && res.data.data) {
            // 嵌套结构 {data: {code: 0, data: {...}}}
            responseData = res.data.data;
        } else {
            // 直接结构 {data: {...}}
            responseData = res.data;
        }

        // 检查script字段是否存在
        if (!responseData.script) {
            throw new Error('API返回数据缺少script字段');
        }

        // 处理返回数据 - 修正数据提取路径
        wholeBroadcastScript = responseData;
        listScript.value = responseData.script.body || [];

        // 给每个对象新增 disable 属性
        listScript.value.forEach((item) => {
            item.disable = true;
        });

        // 显示组合按钮
        showCompositionButton.value = true;
    } catch (error) {
        console.error("Error fetching broadcast script:", error);
        // 显示错误消息给用户
        ElMessage({
            message: '获取口播脚本失败: ' + error.message,
            type: 'error',
            duration: 5000
        });
    }
};

const getImageSrcNew = computed(() => {
    let imageFileName = '';
    if (isSelected.value) { 
        imageFileName = 'exchange_product.png'; 
    } else {
        imageFileName = 'add_product.png';
    }
    return new URL(`/src/assets/images/main/${imageFileName}`, import.meta.url).href;
});

const doSelect = (item) => {
    selectedItem.value = item;
    isSelected.value = true;
    needEnable.value = true;
    
    // 关闭弹窗
    sbuTreeVisible.value = false;
};

const getProdDetail = async (item) => {
    //打开产品详情
    const { data } = await fetchMaterialIdByModel({
        data: { model: item.Model }
    });
    data.type = 'detail';
    MaterialPreviewRef.value.initDialog(data);
};

const getProdSize = async (item) => {
    //打开尺寸图
    const { data } = await fetchMaterialIdByModel({
        data: { model: item.Model }
    });
    data.type = 'size';
    MaterialPreviewRef.value.initDialog(data);
};

const showProduct3DImage = async (item) => {
    const { data } = await fetchProduct3DImage({
        data: { model: item.Model }
    });
    if (data.length == 0) {
        showToast({ message: '暂无产品3D图', duration: 3000 });
        return;
    } else {
        showPreivew(data);
    }
};

const showPreivew = (url) => {
    showImagePreview({
        images: url,
        closeable: true
    });
};

const playVideo = (videoUrl) => {
    router.push({
        path: "/PlayVideo",
        query: {
            videoUrl: videoUrl,
        },
    });
};

const VideoComposition = async () => {
    try {
        let dataPost;
        //如果listScript的某一项为空，那么从数组中清理掉。
        // 创建一个新数组用于存放非空脚本项
        const validScripts = [];
        listScript.value.forEach((item) => {
            // 检查 item.script 去除空格后是否为空
            if (item.script && item.script.trim() !== '') {
                // 如果不为空，添加到新数组
                validScripts.push(item);
            }
        });
        
        // 使用新数组替换原数组
        listScript.value = validScripts;

        if (listScript.value.length === 0) {
            throw new Error('口播脚本不能为空');
        }

        // 检查whoeBroadcastScript是否存在且包含必要的字段
        if (!wholeBroadcastScript || !wholeBroadcastScript.person) {
            throw new Error('合成数据不完整，请重新生成脚本');
        }

        dataPost = {
            person: wholeBroadcastScript.person,
            script: {
                body: listScript.value
            }
        };

        // 检查并添加头部和尾部脚本（如果存在）
        if (wholeBroadcastScript.script && wholeBroadcastScript.script.head) {
            dataPost.script.head = wholeBroadcastScript.script.head;
        }
        if (wholeBroadcastScript.script && wholeBroadcastScript.script.tail) {
            dataPost.script.tail = wholeBroadcastScript.script.tail;
        }

        console.log('视频合成数据:', JSON.stringify(dataPost));

        let res = await getOralVideo({ data: dataPost });
        showToast('视频合成中,大约耗时5分钟。可以点击合成记录中查看合成状态。');
        await sleep(1000);
        // 跳转到 CompositeSameResult 界面
        router.push({
            path: "/media/CompositeSameResult", // 使用完整路径代替路由名称
            query: {
                // 如果需要传递参数，可以在这里添加
            }
        });
    } catch (error) {
        console.error("视频合成失败:", error);
        showToast({ 
            message: '视频合成失败: ' + error.message, 
            duration: 3000 
        });
    }
};
  
// 在组件挂载时检查是否有从SbuTree页面返回的选中产品数据
onMounted(() => {
  getUser(); // 加载用户信息
  fetchSbuList(); // 加载 SBU 列表
  console.log('onMounted: sbuTreeVisible =', sbuTreeVisible.value);

  // 检查是否有保存的步骤
  const savedStep = localStorage.getItem('compositeVideoSavedStep');
  if (savedStep !== null) {
    currentStep.value = parseInt(savedStep);
    localStorage.removeItem('compositeVideoSavedStep');
  }

  // 确保没有错误地设置 sbuTreeVisible 为 true
  // sbuTreeVisible.value = true; // 如果有类似代码，需删除或注释
});

// 添加检查选中产品的方法
const checkSelectedProduct = () => {
  const selectedProduct = localStorage.getItem('selectedProduct');
  if (selectedProduct) {
    try {
      const item = JSON.parse(selectedProduct);
      // 处理选中的产品
      doSelect(item);
      // 清除localStorage中的数据防止重复使用
      localStorage.removeItem('selectedProduct');
    } catch (error) {
      console.error('解析选中产品数据失败:', error);
    }
  }
};

const isLoading = ref(false); // 控制加载状态
const result = ref(null); // 存储返回的结果

const handleButtonClick = async () => {
  isLoading.value = true; // 开始加载状态
  
  try {
    // 直接调用getBroadcastScript，不需要获取返回值
    await getBroadcastScript(); 
    
    // 检查listScript是否有内容
    if (listScript.value.length === 0) {
      throw new Error('未能获取到口播脚本内容');
    }
    
    console.log('脚本生成完成，共获取到', listScript.value.length, '条脚本项');
    
    // 添加滚动到脚本区域的逻辑
    setTimeout(() => {
      const scriptArea = document.querySelector('.div-broadcast-script');
      if (scriptArea) {
        scriptArea.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 200);
    
  } catch (error) {
    console.error("生成口播脚本失败：", error);
    
    // 如果API调用失败，显示一个简单的错误示例
    listScript.value = [
      { 
        type: 'human', 
        script: '生成口播脚本失败，请重试！', 
        disable: true 
      }
    ];
    
    ElMessage({
      message: '生成口播脚本失败：' + (error.message || '未知错误'),
      type: 'error',
      duration: 3000
    });
  } finally {
    isLoading.value = false; // 停止加载状态
  }
};

// 修改closeSbuTree方法
const closeSbuTree = () => {
    console.log('closeSbuTree: sbuTreeVisible =', sbuTreeVisible.value);
    sbuTreeVisible.value = false;
    // 不进行路由跳转，只关闭弹窗
};

// 修改返回方法，确保返回到正确的步骤
const goBack = () => {
  // 获取返回步骤参数
  const returnToStep = localStorage.getItem('compositeVideoStep');
  
  // 如果指定了返回步骤，恢复到该步骤
  if (returnToStep) {
    currentStep.value = parseInt(returnToStep);
    localStorage.removeItem('compositeVideoStep'); // 清除存储的步骤
  } else {
    // 默认返回到当前步骤
    router.back();
  }
};
</script>

<style scoped>
/* 容器样式 */
.video-template-container {
  padding: 20px;
}

/* Header */
.header {
  margin-bottom: 10px;
}

.header h2 {
  /* font-size: 36px;
  font-weight: bold;
  margin-bottom: 0; */
  font-family: Roboto;
  font-size: 30px;
  font-weight: bold;
  line-height: 36px;
  letter-spacing: 0px;
  color: #1F2937;
  opacity: 1;
}

/* 步骤导航 */
.module-navigation {
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
}

.video-template-header {
  display: flex;
  justify-content: space-between; /* 左右对齐 */
  align-items: center; /* 垂直居中 */
  margin-bottom: 20px; /* 与下方内容的间距 */
}

.video-template-title {
  font-size: 18px;
  font-weight: bold;
  margin: 0; /* 去掉默认的段落间距 */
}

.button-group {
  display: flex;
  gap: 10px; /* 按钮之间的间距 */
}
.selection-button {
  background-color: white; /* 默认背景颜色 */
  /* color: #4f46e5; /* 默认文字颜色 */
  /* border: 1px solid #4f46e5; /* 边框颜色 */
  transition: all 0.3s ease; /* 添加过渡效果 */
  width: 120px; /* 设置固定宽度 */
  text-align: center; /* 让文字居中 */
}
.selection-button:hover {
  background-color: #f3f4f6; /* 悬停时的背景颜色 */
}
.selection-button.selected-button {
  background-color: #4f46e5; /* 选中时的背景颜色 */
  color: white; /* 选中时的文字颜色 */
  border-color: #4f46e5; /* 选中时的边框颜色 */
}
.step-button {
  /* font-size: 16px; */
  color: #666;
  border: none;
  cursor: pointer;
  width: 120px; /* 设置固定宽度 */
  text-align: center; /* 让文字居中 */
}

.step-button.selected-button {
  background-color: #4f46e5;
  color: white;
}


/* .module-navigation span {
  font-size: 16px;
  color: #ccc;
  margin-right: 10px;
  cursor: default;
}

.module-navigation .active {
  color: #4f46e5;
  font-weight: bold;
}

.module-navigation .inactive {
  color: #666;
} */


/* 提示语 */
.description {
  margin-bottom: 20px;
  font-size: 16px;
  color: #666;
}

/* 口播脚本编辑器 */
.script-editor {
  margin-top: 20px;
}

.script-textarea {
  width: 100%;
  height: 200px;
  padding: 10px;
  font-size: 16px;
  border: 1px solid #ccc;
  border-radius: 4px;
  resize: none;
}

/* 产品类型 */
.product-type-wrapper {
  margin-bottom: 20px;
  background-color: #F9FAFB; /* 添加背景颜色 */
  padding: 5px; /* 添加内边距，让内容与背景有间距 */
  padding-left: 50px; /* 左侧增加 50px 的空白 */
  padding-bottom: 50px; /* 侧增加 50px 的空白 */
  border-radius: 8px; /* 可选：添加圆角，让背景更美观 */
}

.product-type-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}

.product-type-button {
  width: 120px; /* 设置固定宽度 */
  text-align: center; /* 让文字居中 */
}

.product-type-container {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}

.product-type-button.selected-button {
  background-color: #4f46e5;
  color: white;
}

/* 视频模板列表 */
.video-template-wrapper {
  margin-bottom:20px;
  background-color: #F9FAFB; /* 添加背景颜色 */
  padding: 5px; /* 添加内边距，让内容与背景有间距 */
  padding-left: 50px; /* 左侧增加 50px 的空白 */
  border-radius: 8px; /* 可选：添加圆角，让背景更美观 */
}

.video-template-title {
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: left;
}

.video-template-grid {
  display: grid; /* 使用 CSS Grid 布局 */
  grid-template-columns: repeat(5, 202px); /* 每行显示5个视频，每个视频宽度固定为 202px */
  gap: 20px; /* 设置视频之间的间距 */
  max-height: 400px;
  overflow-y: auto;
  justify-content: start; /* 左对齐 */
}

.video-template-card {
  width: 202px; /* 固定宽度 */
  /* height: auto; */ /* 自动调整高度以适应内容 */
  height: 350px; /* 固定高度，确保足够容纳图片和文字 */
  border-radius: 14px;
  cursor: pointer;
  overflow: hidden;
  display: flex;
  flex-direction: column; /* 确保内容垂直排列 */
}

.video-cover {
  width: 100%;
  height: 85%; /* 图片占卡片高度的 85% */
  /* height: auto;*/ /* 自动调整高度，保持图片比例 */
  object-fit: cover;
}

.template-info {
  margin-top: 10px; /* 与视频封面之间的间距 */
  font-size: 14px; /* 设置文字大小 */
  color: #333; /* 设置文字颜色 */
  display: flex; /* 使用 flex 布局 */
  flex-direction: column; /* 垂直排列内容 */
  gap: 5px; /* 每行文字之间的间距 */
}

/* 添加视频模板选中状态的样式 */
.selected-template {
  border: 2px solid #409eff; /* 蓝色边框 */
  border-radius: 4px;
}

/* 下一步按钮 */
.footer {
  margin-top: 20px;
  text-align: center;
}

.next-step-button {
  font-size: 18px; 
  width: 320px; 
  background-color: #4f46e5; 
  color: #FFFFFF; 
  font-weight: bold; 
  letter-spacing: 3px;
  /* width: 396px;
  height: 65px;
  background: #4f46e5;
  color: white;
  font-size: 16px;
  font-weight: bold;
  border-radius: 4px; */
}
/* 
font-size: 18px; 
width: 320px; 
background-color: #4f46e5; 
color: #FFFFFF; 
font-weight: bold; 
letter-spacing: 3px; 
*/

/* 随机选择的样式*/
.random-selection {
  display: flex;
  flex-direction: column; /* 垂直排列 */
  align-items: center; /* 水平居中 */
  justify-content: center; /* 垂直居中 */
  text-align: center; /* 文本居中 */
  margin-top: 20px; /* 与上方内容的间距 */
}

.random-description {
  font-size: 16px; /* 调整字体大小 */
  color: #333; /* 字体颜色 */
  margin-bottom: 10px; /* 与输入框的间距 */
}

.random-input {
  width: 100%; /* 默认占满父容器 */
  max-width: 300px; /* 最大宽度 */
  min-width: 150px; /* 最小宽度 */
  margin-bottom: 40px;
}

</style>

<style scoped lang="less">
.main-page {
    background-color: #F3F4F6;
    width: 100vw;
    height: 100vh;
    overflow: auto;
    position: relative;
    display: flex;
    flex-direction: column;
    padding-top: 0px; //van-nav-bar是从顶部往下排列的，不浮动，显示为block
    padding-bottom: 0px; //用于存放底部的van-tabbar(这个控件浮动于main-page上方，需要为其他控件留出空间)
}

.div-top {
    background-color: gray;
    display: none;
    flex-direction: row;
    justify-content: space-around;
}

.div-middle {
    position: relative;
    border-radius: 0px 0px 0px 0px;
    // background-color: magenta;
    margin: 0px;
    /* 去掉底部填充 */
    // overflow: hidden;
    /* 防止外部滚动 */
    height: calc(100% - 50px);
    width: 100%;
}

.div-header {
    width: 100%;
    height: 200px;
    background-color: #68CCA3;
    border-radius: 0px 0px 20px 20px;
}

.arrow-box-container {
    margin-top: 10px;
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    width: 100%;
}

.arrow-box {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #FFFFFF;
    width: 100px;
    height: 80px;
    border-radius: 15px 15px 15px 15px;
    border: 0px solid #ccc;
    color: #4DC592;
    font-size: 14px;

    .number {
        margin-top: 10px;
        margin-bottom: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        width: 25px;
        height: 25px;
        border-radius: 50%;
        border: 0px solid #ccc;
        background-color: #4DC592;
        text-align: center;
        color: white;
        /* 文本颜色 */
        font-size: 20px;
        /* 文本大小 */
        text-align: center;
        /* 文本居中 */
    }
}

.arrow-box::after {
    content: "";
    position: absolute;
    top: 100%;
    /* 将箭头放置在 div 的正下方 */
    left: 50%;
    /* 水平居中对齐 */
    transform: translateX(-50%);
    border-width: 15px 10px 0 10px;
    /* 设置箭头上下左右的边框宽度 */
    border-style: solid;
    border-color: #FFFFFF transparent transparent transparent;
    /* 上边可见，其他边透明 */
}

.arroww-box-unselected {
    background-color: #ADE3CD;
    color: white;

    .number {
        background-color: white;
        color: black;
    }
}

/* 这个类用于隐藏箭头 */
.no-arrow::after {
    display: none;
}

.select-template {
    border-radius: 10px;
    margin: -20px 20px 0px 20px;
    position: relative;
    width: calc(100% - 40px);
    background-color: white;
    overflow: auto;
}

.div-product {
    width: calc(100%-20px);
    padding: 10px;
    background-color: #F3F4F6;
    border-radius: 10px;
    margin: 10px;
}

.div-product-chose {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    padding: 1px 10px;
}

.product-item {
    display: flex;
    margin: 0.2rem;

    .item-img {
        flex: 1;
        padding: 0 0.5rem;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 100%;
            aspect-ratio: 1 / 1;
        }
    }

    .item-content {
        flex: 6;
        margin-left: 0.5rem;

        .title1 {
            font-size: 1rem;
        }

        .content1 {
            font-size: 0.875rem;
            margin-top: 0.5rem;
        }
    }
}

.div-broadcast-script {
    width: calc(100%-20px);
    padding: 10px;
    background-color: #F3F4F6; /* 修改背景颜色 */
    border-radius: 10px;
    margin: 10px;
}

.list-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
    -ms-overflow-style: none;
    /* Internet Explorer 和 Edge */
    scrollbar-width: none;
    /* Firefox */
}

.list-div::-webkit-scrollbar {
    display: none;
    /* Webkit 浏览器 */
}

.list-btn-div {
    display: flex;
    align-items: center;
    margin: 0.5rem 0rem;
    padding: 0.5rem 0.5rem;
    // width: 305px;
    width: 100%; /* 修改为自适应宽度 */
    max-width: 800px; /* 限制最大宽度 */
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.4) 0px 2px 6px 0;
    border-radius: 0.5rem;

    // .item-script {
    //     margin-left: 0.0rem;
    // }
}

.item-script {
  flex: 1; /* 让 item-script 自动占据剩余空间 */
  margin-left: 0.5rem;
  width: auto; /* 自动适应内容 */
}
</style> 