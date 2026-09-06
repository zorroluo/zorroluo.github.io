Title: git学习笔记
Date: 2026-09-06 19:45
Category: 编程笔记
Tags: bash, git
Author: Zorro
Summary: 记录 git 的学习笔记

---

# Git 简明教程

## 0. 初始配置

```
# 查看版本
git --version

# 设置用户名邮箱（全局，所有仓库生效）
git config --global user.name "***"
git config --global user.email "***.com"

# 查看全局配置
git config --global --list
```

## 1. 创建仓库

```bash
# 方式1：本地新建仓库
mkdir myproject
cd myproject
git init   # 在当前目录初始化git仓库，生成隐藏 .git 文件夹

# 方式2：克隆远程仓库到本地
git clone git@github.com:zorroluo/demo.git
# git clone https://github.com/zorroluo/demo.git # https方式
```

## 2. 工作区、暂存区、本地仓库、远程仓库概念

- **工作区**：你肉眼看到的文件
- **暂存区 (index)**：`git add` 存放待提交快照
- **本地仓库 (.git)**：`git commit` 保存历史版本
- **远程仓库**：GitHub/Gitee 服务器端仓库

文件状态：`untracked未跟踪` → `staged已暂存` → `committed已提交`

## 3. 日常基础工作流

```
# 查看状态，最常用
git status

# 把文件加入暂存区
git add readme.md          # 单个文件
git add .                  # 当前目录全部新增/修改文件加入暂存

# 提交到本地仓库，写提交说明
git commit -m "feat: 新增readme文档"

# ---------------- 撤销操作（新版 restore，替代旧 checkout） ----------------
# 1. 工作区修改丢弃，把文件恢复成暂存区版本（会丢掉本地未保存修改）
git restore readme.md
# 旧写法：git checkout -- readme.md

# 2. 将文件从暂存区撤销回工作区（不删除文件修改，只是取消add）
git restore --staged readme.md
# 旧写法：git reset HEAD readme.md
```

## 4. 分支操作（重点！switch 替代 checkout 切换分支）

> 
> 仓库默认初始分支：**master**

```
# 查看本地分支
git branch

# 查看本地+远程全部分支
git branch -a

# 新建分支并切换到该分支【新版】
git switch -c dev
# 旧写法：git checkout -b dev

# 只切换已有分支【新版】
git switch master
# 旧写法：git checkout master

# 删除本地分支
git branch -d dev

# 强制删除未合并的分支
git branch -D dev
```

## 5. 合并分支

场景：dev 开发完成，合并到 master

```
# 1. 先切回 master
git switch master

# 2. 将dev分支合并进master
git merge dev

# 遇到冲突：手动打开文件修改冲突标记，改完后
git add .
git commit   # 冲突提交不需要-m
```

## 6. 版本回退 & log 查看

```
# 简洁查看提交历史
git log --oneline

# 完整日志
git log

# 回退本地仓库到某个commit_id，保留文件修改（soft）
git reset --soft  a123bcd

# 回退本地仓库，清空暂存区，文件保留（mixed 默认）
git reset a123bcd

# 危险：彻底回退，工作区文件全部丢弃
git reset --hard a123bcd

# 查看所有操作记录，找回误删commit
git reflog
```

## 7. Stash：临时储藏工作区改动

不想 commit，但要切分支，把修改临时存起来

```
git stash push -m "临时保存：正在写的功能"

# 查看储藏列表
git stash list

# 恢复储藏，不删除stash记录
git stash apply stash@{0}

# 恢复并删除stash记录
git stash pop

# 删除储藏
git stash drop stash@{0}
```

## 8. 远程仓库操作

```
# 查看远程仓库地址
git remote -v

# 添加远程仓库 origin 别名
git remote add origin git@github.com:zorroluo/demo.git

# 修改远程地址
git remote set-url origin git@github.com:xxx/new.git

# 拉取远程更新（不自动合并）
git fetch origin

# 拉取远程master并合并到本地master
git pull origin master
# git pull = git fetch + git merge

# 推送本地master分支到远程master
git push origin master

# 首次推送本地新建分支到远程
git push -u origin dev
# -u 设置上游关联，后续直接 git push/git pull 不用写分支名
```

## 9. .gitignore 文件

在仓库根目录新建 `.gitignore`，填写要忽略的文件，示例：

```
*.log
.DS_Store
venv/
__pycache__/
*.pyc
.vscode/
```

## 10. Cherry‑pick：挑选某一个提交复制到当前分支

只拿某一个 commit，不合并整个分支

```
git cherry-pick abc123   # commit hash值
```

## 11. Rebase（变基，整理提交历史）

> 不要在多人共用远程分支上执行 rebase，只用于本地未推送的提交

```
# 将当前dev分支变基到master
git switch dev
git rebase master

# 交互式rebase，合并/修改本地多个commit
git rebase -i HEAD~3
```

## 12. 常用速查表（新版｜旧版对照）

表格

| 目标 | 新版命令（git≥2.23） | 老版本命令 |
| --- | --- | --- |
| 切换分支 | `git switch <branch>` | `git checkout <branch>` |
| 创建并切新分支 | `git switch -c <branch>` | `git checkout -b <branch>` |
| 丢弃工作区修改 | `git restore <file>` | `git checkout -- <file>` |
| 取消暂存 | `git restore --staged <file>` | `git reset HEAD <file>` |

## 13. 标准团队开发简单工作流（master 为主分支）

1. `git switch master`，`git pull origin master` 更新本地主分支
2. `git switch -c feature/xxx` 创建功能分支开发
3. 多次 `git add` / `git commit`
4. 完成后 push 到远程：`git push -u origin feature/xxx`
5. 在 github 提交 PR/MR，代码评审
6. 评审通过后合并到 master
7. 本地 master 拉取最新代码：`git switch master && git pull`

---

### 补充小提示

1. **commit 规范建议**`feat:` 新功能；`fix:` bug 修复；`docs:`文档；`refactor:`重构；`test:`测试；`chore:`构建 / 工具改动
示例：`git commit -m "feat: 实现用户登录接口"`
2. SSH vs HTTPS

- SSH：配置密钥后不用输密码，推荐（`git@github.com:...`）
- HTTPS：每次需要账号 token

3. 危险操作提醒
`reset --hard`、`rebase` 不要对已经推送到远程、多人共用的分支执行，会破坏别人本地仓库。

> 声明：以上内容由 AI 生成，我仅作简单编辑。