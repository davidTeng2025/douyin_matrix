<template>
  <ContentWrap>
    <!-- 搜索工作栏 -->
    <el-form
      class="-mb-15px"
      :model="queryParams"
      ref="queryFormRef"
      :inline="true"
      label-width="68px"
    >
      <el-form-item label="账号ID" prop="accountId">
        <el-input
          v-model="queryParams.accountId"
          placeholder="请输入账号ID"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="媒体平台" prop="media">
        <el-input
          v-model="queryParams.media"
          placeholder="请输入媒体平台"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="账户描述" prop="accountDesc">
        <el-input
          v-model="queryParams.accountDesc"
          placeholder="请输入账户描述"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input
          v-model="queryParams.companyName"
          placeholder="请输入公司名称"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item label="员工号" prop="employeeAccount">
        <el-input
          v-model="queryParams.employeeAccount"
          placeholder="请输入员工号"
          clearable
          @keyup.enter="handleQuery"
          class="!w-240px"
        />
      </el-form-item>
      <el-form-item>
        <el-button @click="handleQuery"><Icon icon="ep:search" class="mr-5px" /> 搜索</el-button>
        <el-button @click="resetQuery"><Icon icon="ep:refresh" class="mr-5px" /> 重置</el-button>
        <el-button
          type="primary"
          plain
          @click="openForm('create')"
          v-hasPermi="['media:account:create']"
        >
          <Icon icon="ep:plus" class="mr-5px" /> 新增
        </el-button>
        <el-button
          type="success"
          plain
          @click="handleExport"
          :loading="exportLoading"
          v-hasPermi="['media:account:export']"
        >
          <Icon icon="ep:download" class="mr-5px" /> 导出
        </el-button>
      </el-form-item>
    </el-form>
  </ContentWrap>

  <!-- 列表 -->
  <ContentWrap>
    <el-table v-loading="loading" :data="list" :stripe="true" :show-overflow-tooltip="true">
      <el-table-column label="编号" align="center" prop="id" />
      <el-table-column label="账号ID" align="center" prop="accountId" />
      <el-table-column label="媒体平台" align="center" prop="media" />
      <el-table-column label="账户描述" align="center" prop="accountDesc" />
      <el-table-column label="是否启用" align="center" prop="isEnable" />
      <el-table-column label="Client Key" align="center" prop="clientKey" />
      <el-table-column label="Client Secret" align="center" prop="clientSecret" />
      <el-table-column label="公司名称" align="center" prop="companyName" />
      <el-table-column label="员工号" align="center" prop="employeeAccount" />
      <el-table-column
        label="A时间"
        align="center"
        prop="accessUpdateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="A过期/秒" align="center" prop="accessExpiresIn" />
      <el-table-column
        label="R时间"
        align="center"
        prop="refreshUpdateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="R过期/秒" align="center" prop="refreshExpiresIn" />
      <el-table-column label="最大次数" align="center" prop="refreshCountMax" />
      <el-table-column label="已刷次数" align="center" prop="refreshCount" />
      <el-table-column label="Code地址" align="center" prop="getCodeUrl" />
      <el-table-column
        label="C时间"
        align="center"
        prop="clientUpdateTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="C过期/秒" align="center" prop="clientExpiresIn" />
      <el-table-column
        label="创建时间"
        align="center"
        prop="createTime"
        :formatter="dateFormatter"
        width="180px"
      />
      <el-table-column label="操作" align="center" min-width="120px" fixed="right">
        <template #default="scope">
          <el-button
            link
            type="primary"
            @click="openForm('update', scope.row.id)"
            v-hasPermi="['media:account:update']"
          >
            编辑
          </el-button>
          <el-button
            link
            type="danger"
            @click="handleDelete(scope.row.id)"
            v-hasPermi="['media:account:delete']"
          >
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <!-- 分页 -->
    <Pagination
      :total="total"
      v-model:page="queryParams.pageNo"
      v-model:limit="queryParams.pageSize"
      @pagination="getList"
    />
  </ContentWrap>

  <!-- 表单弹窗：添加/修改 -->
  <AccountForm ref="formRef" @success="getList" />
</template>

<script setup lang="ts">
import { dateFormatter } from '@/utils/formatTime'
import download from '@/utils/download'
import { AccountApi, AccountVO } from '@/api/media/account'
import AccountForm from './AccountForm.vue'

/** 媒体账号 列表 */
defineOptions({ name: 'Account' })

const message = useMessage() // 消息弹窗
const { t } = useI18n() // 国际化

const loading = ref(true) // 列表的加载中
const list = ref<AccountVO[]>([]) // 列表的数据
const total = ref(0) // 列表的总页数
const queryParams = reactive({
  pageNo: 1,
  pageSize: 10,
  accountId: undefined,
  media: undefined,
  accountDesc: undefined,
  companyName: undefined,
  employeeAccount: undefined
})
const queryFormRef = ref() // 搜索的表单
const exportLoading = ref(false) // 导出的加载中

/** 查询列表 */
const getList = async () => {
  loading.value = true
  try {
    const data = await AccountApi.getAccountPage(queryParams)
    list.value = data.list
    total.value = data.total
  } finally {
    loading.value = false
  }
}

/** 搜索按钮操作 */
const handleQuery = () => {
  queryParams.pageNo = 1
  getList()
}

/** 重置按钮操作 */
const resetQuery = () => {
  queryFormRef.value.resetFields()
  handleQuery()
}

/** 添加/修改操作 */
const formRef = ref()
const openForm = (type: string, id?: number) => {
  formRef.value.open(type, id)
}

/** 删除按钮操作 */
const handleDelete = async (id: number) => {
  try {
    // 删除的二次确认
    await message.delConfirm()
    // 发起删除
    await AccountApi.deleteAccount(id)
    message.success(t('common.delSuccess'))
    // 刷新列表
    await getList()
  } catch {}
}

/** 导出按钮操作 */
const handleExport = async () => {
  try {
    // 导出的二次确认
    await message.exportConfirm()
    // 发起导出
    exportLoading.value = true
    const data = await AccountApi.exportAccount(queryParams)
    download.excel(data, '媒体账号.xls')
  } catch {
  } finally {
    exportLoading.value = false
  }
}

/** 初始化 **/
onMounted(() => {
  getList()
})
</script>