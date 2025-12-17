#!/bin/bash
# 为所有 packages 创建指向根目录的 .env 和 .gitignore 符号链接

set -e

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PACKAGES_DIR="$ROOT_DIR/packages"

echo "🔗 为所有 packages 创建共享文件符号链接..."
echo ""

# 检查根目录是否存在 .env 文件
if [ ! -f "$ROOT_DIR/.env" ]; then
    echo "⚠️  警告: 根目录不存在 .env 文件，请先创建它"
    echo "   可以复制 env-example 文件: cp env-example .env"
    echo ""
fi

# 检查根目录是否存在 .gitignore 文件
if [ ! -f "$ROOT_DIR/.gitignore" ]; then
    echo "⚠️  警告: 根目录不存在 .gitignore 文件"
    echo ""
fi

# 遍历所有 packages 目录
for pkg_dir in "$PACKAGES_DIR"/*; do
    if [ -d "$pkg_dir" ]; then
        pkg_name=$(basename "$pkg_dir")
        echo "📦 处理 $pkg_name..."
        
        # 处理 .env 文件
        env_link="$pkg_dir/.env"
        if [ -f "$ROOT_DIR/.env" ]; then
            # 如果已存在 .env 文件（非符号链接），先备份
            if [ -f "$env_link" ] && [ ! -L "$env_link" ]; then
                echo "   📝 备份现有的 .env 文件..."
                mv "$env_link" "$env_link.backup"
            fi
            
            # 创建符号链接
            if [ ! -L "$env_link" ]; then
                relative_path=$(realpath --relative-to="$pkg_dir" "$ROOT_DIR/.env" 2>/dev/null || echo "../../.env")
                ln -sf "$relative_path" "$env_link"
                echo "   ✅ .env -> $relative_path"
            else
                echo "   ℹ️  .env 符号链接已存在"
            fi
        fi
        
        # 处理 .gitignore 文件
        gitignore_link="$pkg_dir/.gitignore"
        if [ -f "$ROOT_DIR/.gitignore" ]; then
            # 如果已存在 .gitignore 文件（非符号链接），先备份
            if [ -f "$gitignore_link" ] && [ ! -L "$gitignore_link" ]; then
                echo "   📝 备份现有的 .gitignore 文件..."
                mv "$gitignore_link" "$gitignore_link.backup"
            fi
            
            # 创建符号链接
            if [ ! -L "$gitignore_link" ]; then
                relative_path=$(realpath --relative-to="$pkg_dir" "$ROOT_DIR/.gitignore" 2>/dev/null || echo "../../.gitignore")
                ln -sf "$relative_path" "$gitignore_link"
                echo "   ✅ .gitignore -> $relative_path"
            else
                echo "   ℹ️  .gitignore 符号链接已存在"
            fi
        fi
        echo ""
    fi
done

echo "✨ 完成！所有 packages 现在共享根目录的配置文件"
echo ""
echo "💡 提示:"
echo "   - 修改根目录的 .env 文件即可更新所有 packages"
echo "   - 修改根目录的 .gitignore 文件即可更新所有 packages"
echo "   - 如需为某个包单独配置，删除符号链接后创建独立的文件"

