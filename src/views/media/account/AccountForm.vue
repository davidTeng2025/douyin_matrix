<template>
  <Dialog :title="dialogTitle" v-model="dialogVisible">
    <el-form
      ref="formRef"
      :model="formData"
      :rules="formRules"
      label-width="100px"
      v-loading="formLoading"
    >
      <el-form-item label="账号ID" prop="accountId">
        <el-input v-model="formData.accountId" placeholder="请输入账号ID" />
      </el-form-item>
      <el-form-item label="媒体平台" prop="media">
        <el-input v-model="formData.media" placeholder="请输入媒体平台" />
      </el-form-item>
      <el-form-item label="账户描述" prop="accountDesc">
        <el-input v-model="formData.accountDesc" placeholder="请输入账户描述" />
      </el-form-item>
      <el-form-item label="是否启用" prop="isEnable">
        <el-input v-model="formData.isEnable" placeholder="请输入是否启用" />
      </el-form-item>
      <el-form-item label="Client Key" prop="clientKey">
        <el-input v-model="formData.clientKey" placeholder="请输入Client Key" />
      </el-form-item>
      <el-form-item label="Client Secret" prop="clientSecret">
        <el-input v-model="formData.clientSecret" placeholder="请输入Client Secret" />
      </el-form-item>
      <el-form-item label="公司名称" prop="companyName">
        <el-input v-model="formData.companyName" placeholder="请输入公司名称" />
      </el-form-item>
      <el-form-item label="员工号" prop="employeeAccount">
        <el-input v-model="formData.employeeAccount" placeholder="请输入员工号" />
      </el-form-item>
      <el-form-item label="最大次数" prop="refreshCountMax">
        <el-input v-model="formData.refreshCountMax" placeholder="请输入最大次数" />
      </el-form-item>
      <el-form-item label="Code地址" prop="getCodeUrl">
        <el-input v-model="formData.getCodeUrl" placeholder="请输入Code地址" />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="submitForm" type="primary" :disabled="formLoading">确 定</el-button>
      <el-button @click="dialogVisible = false">取 消</el-button>
    </template>
  </Dialog>
</template>
<script setup lang="ts">
import { AccountApi, AccountVO } from '@/api/media/account'

/** 媒体账号 表单 */
defineOptions({ name: 'AccountForm' })

const { t } = useI18n() // 国际化
const message = useMessage() // 消息弹窗

const dialogVisible = ref(false) // 弹窗的是否展示
const dialogTitle = ref('') // 弹窗的标题
const formLoading = ref(false) // 表单的加载中：1）修改时的数据加载；2）提交的按钮禁用
const formType = ref('') // 表单的类型：create - 新增；update - 修改
const formData = ref({
  id: undefined,
  accountId: undefined,
  media: undefined,
  accountDesc: undefined,
  isEnable: undefined,
  clientKey: undefined,
  clientSecret: undefined,
  companyName: undefined,
  employeeAccount: undefined,
  refreshCountMax: undefined,
  getCodeUrl: undefined
})
const formRules = reactive({
  accountId: [{ required: true, message: '账号ID不能为空', trigger: 'blur' }]
})
const formRef = ref() // 表单 Ref

/** 打开弹窗 */
const open = async (type: string, id?: number) => {
  dialogVisible.value = true
  dialogTitle.value = t('action.' + type)
  formType.value = type
  resetForm()
  // 修改时，设置数据
  if (id) {
    formLoading.value = true
    try {
      formData.value = await AccountApi.getAccount(id)
    } finally {
      formLoading.value = false
    }
  }
}
defineExpose({ open }) // 提供 open 方法，用于打开弹窗

/** 提交表单 */
const emit = defineEmits(['success']) // 定义 success 事件，用于操作成功后的回调
const submitForm = async () => {
  // 校验表单
  await formRef.value.validate()
  // 提交请求
  formLoading.value = true
  try {
    const data = formData.value as unknown as AccountVO
    if (formType.value === 'create') {
      await AccountApi.createAccount(data)
      message.success(t('common.createSuccess'))
    } else {
      await AccountApi.updateAccount(data)
      message.success(t('common.updateSuccess'))
    }
    dialogVisible.value = false
    // 发送操作成功的事件
    emit('success')
  } finally {
    formLoading.value = false
  }
}

/** 重置表单 */
const resetForm = () => {
  formData.value = {
    id: undefined,
    accountId: undefined,
    media: undefined,
    accountDesc: undefined,
    isEnable: undefined,
    clientKey: undefined,
    clientSecret: undefined,
    companyName: undefined,
    employeeAccount: undefined,
    refreshCountMax: undefined,
    getCodeUrl: undefined
  }
  formRef.value?.resetFields()
}
</script>