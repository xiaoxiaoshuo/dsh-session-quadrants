# 会话四象限标识

为 DSH 工作区中的会话增加持久化四色标识，不修改会话标题、聊天记录或运行状态。

## 获取与安装

这是独立的 DSH 插件源码仓库，不包含 DSH 主程序或用户会话数据。当前适配 **DSH 0.2.0-rc.2**，需要 Node.js 和 pnpm。

```sh
git clone https://github.com/xiaoxiaoshuo/dsh-session-quadrants.git
cd dsh-session-quadrants
pnpm install --frozen-lockfile --ignore-scripts --config.auto-install-peers=false
node --test operations.test.js
```

然后在 DSH 创造模式中提供克隆目录的**绝对路径**，要求通过 Plugin Manager 安装这个本地 bundle，并确认结果是 `application: applied`。不要手工改写 DSH 的 profile 文件。

此仓库暂未发布到 npm，保留本地包名 `@local/dsh-session-quadrants`。当前本地安装采用目录链接，因此安装后请保留克隆目录及其依赖。

## 使用

- 会话的 **… → 四象限标识** 打开选择器；也可点击悬停操作区的四宫格按钮。
- Q1 红色：重要且紧急。
- Q2 橙色：重要不紧急。
- Q3 蓝色：紧急不重要。
- Q4 灰色：不重要不紧急。
- 点击选项自动保存，选择 **清除标识** 恢复未标记。
- 会话左侧色条保持显示，悬停详情显示完整类别；原有状态点和定时任务图标保留。
- 原生工作区的空白新会话没有操作条，发送第一条消息后可标记。搜索结果使用独立布局；回到工作区列表查看色条。

标识由 Host 的 settings 服务按会话 ID 保存到当前 profile 配置；刷新页面、重启应用后保留，并向其他已连接页面同步。卸载不改聊天记录。配色使用 Host 的语义主题变量，跟随明暗主题。

## 实现与兼容性

包使用正式的 session row action、menu item、hover 和 shell overlay 插槽，不替换侧栏或注入第二个应用。色条由行操作组件拥有的样式实现，仅依赖当前版本的 `data-row-key="session:<id>"` 行标识；因此运行时 peer 固定为 DSH 0.2.0-rc.2，升级时需要复核此标识。所有其余样式均为插件自有 class。

UI 与 `session_quadrant` 工具均调用同一个 Host `settings.mutate` 操作；它按字段路径合并，避免更新一个会话时覆盖其他会话。工具不自动打标，仅在用户要求时使用。保存失败会保留原标识并显示错误，不伪造成功。

客户端只做一次初始读取，在设置变更、重连或打开选择器时刷新，不轮询、不激活列表里的会话。禁用插件后，插槽、样式和订阅随上下文移除。

## 验证

运行 `node --test operations.test.js` 检查四种值、清除、并发更新、错误传播、非法输入、命名空间与持久层复读。

本包是直接可加载的 JavaScript，无构建或安装脚本。首次以本地目录链接安装前，在此工作区目录运行 `pnpm install --ignore-scripts --config.auto-install-peers=false` 安装 schema 依赖，再通过 Plugin Manager 安装本目录；不要删除此目录或它的依赖。

2026-10-06 验证记录：

- JavaScript 语法、manifest、双语字典与 Config 枚举验证通过。
- 10 项操作逻辑测试全部通过。
- Plugin Manager 最终状态为 `application: applied`，无警告。
- 当前连接页面的菜单、行操作、悬停详情和选择器插槽已注册。
- 通过真实 `session_quadrant` 工具逐一设置四种类别，并在禁用、重新启用插件后读回已保存值。
- 禁用时确认行操作插槽撤销；重新启用后确认恢复。测试使用独立的临时 ID，最终已清除并读回 null，未修改用户会话的分类。

当前没有浏览器点击控制，所以真实点击、键盘、明暗主题视觉和页面刷新仍待手动确认；不以插槽注册成功替代视觉验证。
