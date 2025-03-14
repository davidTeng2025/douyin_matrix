import { AbpScriptApi, sleep } from './index.ts'

// Export individual functions for easier use in Vue components
export const getSbuList = AbpScriptApi.getSbuList
export const getVideoTemplateBySbu = AbpScriptApi.getVideoTemplateBySbu
export const getAbpTemplateVideo = AbpScriptApi.getAbpTemplateVideo
export const getCompositeSameVideo = AbpScriptApi.getCompositeSameVideo
export const deleteCompositeSameVideo = AbpScriptApi.deleteCompositeSameVideo
export const getDownloadCosFileUrl = AbpScriptApi.getDownloadCosFileUrl
export const getEmployeeAvatar = AbpScriptApi.getEmployeeAvatar
export const getAbpCompositeVideo = AbpScriptApi.getAbpCompositeVideo
export const fetchMaterialIdByModel = AbpScriptApi.fetchMaterialIdByModel
export const fetchProduct3DImage = AbpScriptApi.fetchProduct3DImage
export const getOralScript = AbpScriptApi.getOralScript
export const getOralVideo = AbpScriptApi.getOralVideo

// Export the sleep utility function
export { sleep }

// Export the entire API object as default
export default AbpScriptApi 