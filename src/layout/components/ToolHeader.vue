<script lang="tsx">
import { defineComponent, computed } from 'vue'
import { Message } from '@/layout/components//Message'
import { Collapse } from '@/layout/components/Collapse'
import { UserInfo } from '@/layout/components/UserInfo'
import { Screenfull } from '@/layout/components/Screenfull'
import { Breadcrumb } from '@/layout/components/Breadcrumb'
import { SizeDropdown } from '@/layout/components/SizeDropdown'
import { LocaleDropdown } from '@/layout/components/LocaleDropdown'
import RouterSearch from '@/components/RouterSearch/index.vue'
import { storeToRefs } from 'pinia'
import { useAppStore } from '@/store/modules/app'
import { useDesign } from '@/hooks/web/useDesign'

export default defineComponent({
  name: 'ToolHeader',
  components: {
    Message,
    Collapse,
    UserInfo,
    Screenfull,
    SizeDropdown,
    LocaleDropdown,
    Breadcrumb,
    RouterSearch
  },
  setup() {
    // 确保所有的 composable 调用都在 setup 内部
    const { getPrefixCls, variables } = useDesign()
    const prefixCls = getPrefixCls('tool-header')
    
    // 在 setup 内部使用 Pinia 存储
    const appStore = useAppStore()
    
    // 使用 storeToRefs 从存储中提取响应式状态
    const { 
      getBreadcrumb: breadcrumb,
      getHamburger: hamburger,
      getScreenfull: screenfull,
      search,
      getSize: size,
      getLayout: layout,
      getLocale: locale,
      getMessage: message
    } = storeToRefs(appStore)
    
    return {
      variables,
      prefixCls,
      breadcrumb,
      hamburger,
      screenfull,
      search,
      size,
      layout,
      locale,
      message
    }
  },
  render() {
    return (
      <div
        id={`${this.variables.namespace}-tool-header`}
        class={[
          this.prefixCls,
          'h-[var(--top-tool-height)] relative px-[var(--top-tool-p-x)] flex items-center justify-between',
          'dark:bg-[var(--el-bg-color)]'
        ]}
      >
        {this.layout !== 'top' ? (
          <div class="h-full flex items-center">
            {this.hamburger && this.layout !== 'cutMenu' ? (
              <Collapse class="custom-hover" color="var(--top-header-text-color)"></Collapse>
            ) : undefined}
            {this.breadcrumb ? <Breadcrumb class="lt-md:hidden"></Breadcrumb> : undefined}
          </div>
        ) : undefined}
        <div class="h-full flex items-center">
          {this.screenfull ? (
            <Screenfull class="custom-hover" color="var(--top-header-text-color)"></Screenfull>
          ) : undefined}
          {this.search ? <RouterSearch isModal={false} /> : undefined}
          {this.size ? (
            <SizeDropdown class="custom-hover" color="var(--top-header-text-color)"></SizeDropdown>
          ) : undefined}
          {this.locale ? (
            <LocaleDropdown
              class="custom-hover"
              color="var(--top-header-text-color)"
            ></LocaleDropdown>
          ) : undefined}
          {this.message ? (
            <Message class="custom-hover" color="var(--top-header-text-color)"></Message>
          ) : undefined}
          <UserInfo></UserInfo>
        </div>
      </div>
    )
  }
})
</script>

<style lang="scss" scoped>
$prefix-cls: #{$namespace}-tool-header;

.#{$prefix-cls} {
  transition: left var(--transition-time-02);
}
</style>
