Title: Pelican上写博客以及发布博客教程  
Date: 2026-09-06 19:00  
Category: 编程笔记 
Tags: bash, Pelican  
Author: Zorro  
Summary: 记录Pelican的学习笔记  

---

# Pelican 完整写文 + 发布教程

> 适配我的个人项目： zorroluo.github.io，GitHub‑Pages gh‑pages 分支方案  
> 源码放 master；生成好的网页成品部署到 gh‑pages，两条分支职责严格分开Pelican

## 一、每次开工第一步（必做）

打开终端，进入博客根目录，激活虚拟环境

```bash
cd ~/zorroluo.github.io
source .venv/bin/activate
```

提示符出现 `(.venv)` 代表环境就绪。

> 所有文章**只能写在 `content/` 文件夹里面**，不要放到 output、themes 目录。

## 二、新建一篇博客文章

### 1. 新建 md 文件

```
touch content/my‑new‑article.md
```

文件名建议英文、小写、横杠分隔，**不要中文文件名**（避免线上链接报错）。

### 2. 文章头部元数据

用 VS‑Code 打开这个 `.md`，**最顶部必须写元数据**，Pelican 靠它识别文章信息Pelican。
完整模板，直接复制：

```
Title: Bash学习笔记
Date: 2026-09-06 17:00
Category: 编程笔记
Tags: bash, shell, 终端
Author: Zorro
Summary: 记录Bash基础命令学习心得

---

正文从此开始，正常写Markdown内容。

## 二级标题
- 清单1
- 清单2

`pelican content`
```

#### 元数据规则

1. `Title:` 不能省略，**冒号后面要有空格**
2. `Date:` 格式固定 `年‑月‑日 时:分`
3. 多个标签用英文逗号隔开：`Tags: bash, markdown, pelican`
4. 元数据写完空一行，再加 `---` 分隔头部与正文（可选，可读性更好）

> 图片存放位置：`content/images/xxx.png`；文中引用 `![截图](images/xxx.png)`

## 三、本地预览（发布前必须！）三步流程

### 第一步：生成静态网页

```
pelican content
```

读取 content 下面所有 md 文章，生成 html 网页，输出到 `output/` 文件夹Pelican。

> 如果修改文章后页面没变，清除缓存，加上参数：
> ```
> pelican content --ignore-cache
> ```

### 第二步：启动本地预览服务器

新开一个终端窗口（保持虚拟环境）

```
pelican -l
```

浏览器打开：`http://127.0.0.1:8000`，检查文章排版、图片、链接是否正常。  
看完按 `Ctrl + C` 关闭预览服务。

> **此时仅仅是你本地能看见，互联网上还看不到！**

## 四、推送到线上（发布到 GitHub Pages）

### 流程 1：保存博客源码（master 分支，你的文章、配置、主题）

```
# 查看改动
git status
# 添加修改
git add content/ pelicanconf.py themes/
# 提交
git commit -m "新增文章：Pelican学习笔记"
# 推送源码到远程master
git push origin master
```

> master 分支存**源代码**（md 文章、配置、主题），这是你的备份！**一定要提交**。

### 流程 2：把网页成品部署 gh‑pages（对外访问的网页）

```bash
ghp-import output -b gh-pages
git push origin gh-pages
```

- `ghp‑import`：读取 output 文件夹，自动更新本地 gh‑pages 分支，**不需要你手动切换 gh‑pages 分支**！
- `git push origin gh‑pages`：上传生成好的网页到远程 gh‑pages 分支，网站就更新成功了。

> 禁止手动 `git switch gh‑pages` 然后修改文件！gh‑pages 分支交给 ghp‑import 自动管理。

# 最后总结在代码：完整一键发布命令速查

```
# 1.生成网页，删除缓存
pelican content --ignore-cache
# 2.预览(新开终端)
pelican -l
# 3.提交源码 master
git add content/
git commit -m "新增文章标题"
git push origin master
# 4.部署线上网页
ghp-import output -b gh-pages
git push origin gh-pages
```

# 高频坑 & 注意事项清单

## 文章写作坑

1. 元数据冒号后面**必须空格**
2. Markdown 所有符号：`# - * [] () ` **英文半角**
3. 文件名、图片文件名**不要中文、空格**，GitHub Pages 大小写敏感
4. 图片路径：本地预览正常、线上图片丢失，90% 原因：大小写拼写错误
5. 写完文章**一定要本地预览一遍再推送线上**，不要直接上线翻车

## Git、分支管理大坑

1. **master = 源码仓库（md 文章，pelican 配置，主题）**
2. **gh‑pages = 成品网页仓库（output 输出出来的 html）**
3. **两个分支完全独立！推送 master ≠ 更新网站；推送 gh‑pages 网站才更新**
4. output 文件夹永远不要提交到 master 分支！`.gitignore` 已经写好 `output/`
5. 不要手动去 gh‑pages 分支里面修改网页，所有网页修改只能通过修改 content 文章，重新 pelican 生成

## 更新网站后旧内容依旧显示

浏览器强制刷新：Mac 快捷键 `Cmd+Shift+R`，清除 GitHub CDN 缓存；等待 1‑3 分钟生效。

> 声明：以上内容基本由 AI 生成，我做了简单编辑。