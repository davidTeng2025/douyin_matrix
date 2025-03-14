<template>
  <div class="video-list">
    <el-card class="box-card">
      <div class="header">
        <h2>拍同款合成记录</h2>
      </div>
      <el-table :data="videoList" border style="width: 100%; height: calc(100vh - 150px); overflow: auto;">
        <!-- 序号 -->
        <el-table-column label="序号" width="80">
          <template #default="scope">
            {{ scope.$index + 1 }}
          </template>
        </el-table-column>

        <!-- 封面图 -->
        <el-table-column label="封面图" width="200">
          <template #default="scope">
            <el-image
              style="width: 100px; height: 100px; cursor: pointer"
              :src="scope.row.cover_url"
              fit="cover"
              @click="handleCoverClick(scope.row)"
            />
          </template>
        </el-table-column>

        <!-- 合成状态 -->
        <el-table-column prop="generate_ready" label="合成状态" width="150">
          <template #default="scope">
            <el-tag
              :type="scope.row.generate_ready === '已完成' ? 'success' : 'warning'"
            >
              {{ scope.row.generate_ready }}
            </el-tag>
          </template>
        </el-table-column>

        <!-- 合成时间 -->
        <el-table-column prop="timestamp" label="合成时间" width="200">
          <template #default="scope">
            {{ formatTimestamp(scope.row.timestamp) }}
          </template>
        </el-table-column>

        <!-- 功能 -->
        <el-table-column label="功能" width="400">
          <template #default="scope">
            <el-button
              type="primary"
              size="small"
              @click="downloadVideo(scope.row.video_cos_key)"
            >
              下载视频
            </el-button>
            <el-button
              type="danger"
              size="small"
              @click="deleteRecord(scope.row.uuid)"
            >
              删除记录
            </el-button>
            <el-button
              type="warning"
              size="small"
            >
              跳转到发布页面
            </el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 视频播放对话框 -->
    <el-dialog v-model="dialogVisible" width="50%" @close="stopVideo">
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

<script lang="ts" setup name="CompositeSameResult">
import { ref, reactive, onMounted } from "vue";
import { getCompositeSameVideo, getDownloadCosFileUrl, deleteCompositeSameVideo } from "@/api/abpscriptYudao.js";
import { VideoItem } from "@/api/abpscriptYudao/index";
import { getUserProfile } from "@/api/system/user/profile";
import { ElMessage, ElMessageBox } from "element-plus";

// 定义状态
const empId = ref(""); // 当前用户的 empId
const videoList = ref<VideoItem[]>([]); // 视频列表数据，添加类型注解
const dialogVisible = ref(false); // 控制视频播放对话框的显示
const currentVideoUrl = ref(""); // 当前播放的视频链接
const videoPlayer = ref<HTMLVideoElement | null>(null); // 视频控件引用，添加类型注解

// 用户信息
interface LoginState {
  user: {
    userName: string;
    phonenumber: string;
    email: string;
    dept: { deptName: string };
    createTime: string;
  };
  roleGroup: string;
  postGroup: string;
}

const login_state = reactive<LoginState>({
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

// 获取用户信息
const getUser = async () => {
  try {
    // 测试用：直接使用固定的empId，跳过用户信息API调用
    empId.value = "CE2E5A99D51E4EA58145164AE23E44CE";
    console.log("当前登录的账号为：", empId.value);
    
    // 获取视频列表
    await fetchVideoList();
    
    // 暂时注释掉用户信息获取，避免API调用问题
    /*
    const response = await getUserProfile();
    if (response.data) {
      // 设置用户信息到我们自定义的结构
      login_state.user.userName = response.data.username || "";
      login_state.user.email = response.data.email || "";
      login_state.user.createTime = response.data.createTime ? response.data.createTime.toString() : "";
      if (response.data.dept) {
        login_state.user.dept.deptName = response.data.dept.name || "";
      }
    }

    // 数据加载完成后更新 empId
    empId.value = login_state.user.userName;
    console.log("当前登录的账号为：", empId.value);
    */
  } catch (error) {
    console.error("获取用户信息失败:", error);
  }
};

// 获取视频列表
const fetchVideoList = async () => {
  try {
    const response = await getCompositeSameVideo({
      empId: empId.value, // 直接传递 emp_id
    });
    if (response.code === 0) {
      videoList.value = response.data || [];
    } else {
      ElMessage.error("获取视频列表失败：" + response.msg);
    }
  } catch (error) {
    console.error("获取视频列表失败:", error);
    ElMessage.error("获取视频列表失败，请稍后重试");
  }
};

// 点击封面图的处理逻辑
const handleCoverClick = (row: VideoItem) => {
  if (row.generate_ready === "已完成") {
    currentVideoUrl.value = row.line_video_url;
    dialogVisible.value = true;
  } else {
    ElMessage.warning("视频还在推理中，请您稍等");
  }
};

// 格式化时间戳
const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// 下载视频
const downloadVideo = async (videoCosKey: string) => {
  try {
    // 调用下载接口
    const response = await getDownloadCosFileUrl({
      data: { key: videoCosKey, disposition_mode: "attachment" },
    });

    if (response.code === 0 && response.data && response.data.url) {
      const downloadUrl = response.data.url; // 获取下载链接
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.download = "video.mp4"; // 默认文件名
      link.click();
      ElMessage.success("视频下载链接已生成，正在下载...");
    } else {
      ElMessage.error("获取下载链接失败：" + response.msg);
    }
  } catch (error) {
    console.error("下载视频失败:", error);
    ElMessage.error("下载视频失败，请稍后重试");
  }
};

// 删除记录
const deleteRecord = async (uuid: string) => {
  try {
    await ElMessageBox.confirm(
      "您确定要删除这条记录吗？",
      "提示",
      {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      }
    );
    const response = await deleteCompositeSameVideo({
      data: { uuid },
    });
    if (response.code === 1) {
      ElMessage.success("删除成功");
      // 删除成功后重新获取视频列表
      await fetchVideoList();
    } else {
      ElMessage.error("删除失败：" + response.msg);
    }
  } catch (error: any) {
    if (error !== "cancel") {
      console.error("删除记录失败:", error);
      ElMessage.error("删除记录失败，请稍后重试");
    }
  }
};

// 停止视频播放
const stopVideo = () => {
  dialogVisible.value = false;
  const video = videoPlayer.value;
  if (video) {
    video.pause();
    video.currentTime = 0;
  }
  currentVideoUrl.value = ""; // 清空视频 URL
};

// 页面加载时获取用户信息
onMounted(() => {
  getUser();
});
</script>

<style scoped>
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

.video-list {
  padding: 20px;
}
.box-card {
  margin-bottom: 20px;
}
</style> 