#!/usr/bin/env node

/**
 * CSV测试用例转Package脚本
 * 使用方式：
 *   node scripts/csv-to-package.js                    # 转换cases目录下所有CSV
 *   node scripts/csv-to-package.js cases/测试.csv     # 转换指定CSV文件
 */

const fs = require('fs');
const path = require('path');

const CONFIG = {
  casesDir: path.join(__dirname, '..', 'cases'),
  packagesDir: path.join(__dirname, '..', 'packages'),
  encoding: 'utf-8'
};

/**
 * 使用状态机解析CSV（正确处理双引号内的换行和逗号）
 */
function parseCSVWithQuotes(content) {
  // 统一换行符
  const normalizedContent = content.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  
  const rows = [];
  let currentRow = [];
  let currentField = '';
  let inQuotes = false;
  
  for (let i = 0; i < normalizedContent.length; i++) {
    const char = normalizedContent[i];
    const nextChar = normalizedContent[i + 1];
    
    if (inQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          currentField += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField.trim());
        currentField = '';
      } else if (char === '\n') {
        currentRow.push(currentField.trim());
        if (currentRow.some(cell => cell)) {
          rows.push(currentRow);
        }
        currentRow = [];
        currentField = '';
      } else {
        currentField += char;
      }
    }
  }
  
  if (currentField || currentRow.length > 0) {
    currentRow.push(currentField.trim());
    if (currentRow.some(cell => cell)) {
      rows.push(currentRow);
    }
  }
  
  return rows;
}

/**
 * 解析CSV文件
 */
function parseCSV(content) {
  const rows = parseCSVWithQuotes(content);
  if (rows.length < 3) return [];
  
  // 查找表头行（包含"编号"的行）
  let headerRowIndex = -1;
  for (let i = 0; i < Math.min(5, rows.length); i++) {
    if (rows[i].includes('编号') && rows[i].includes('模块')) {
      headerRowIndex = i;
      break;
    }
  }
  
  if (headerRowIndex === -1) return [];
  
  const headers = rows[headerRowIndex];
  const dataRows = [];
  
  // 字段映射
  const fieldMap = {
    '编号': 'id', '模块': 'module', '功能点': 'feature',
    '预置条件': 'precondition', '操作步骤': 'steps',
    '预期结果': 'expected', '用例等级': 'priority'
  };
  
  // 解析数据行
  for (let i = headerRowIndex + 1; i < rows.length; i++) {
    const values = rows[i];
    if (!values || values.length === 0) continue;
    
    // 跳过空行或说明行
    const firstCell = values[0] || '';
    if (firstCell.includes('：') || firstCell.includes(':')) continue;
    
    const rowObj = {};
    headers.forEach((header, index) => {
      const fieldName = fieldMap[header] || header;
      rowObj[fieldName] = values[index] || '';
    });
    
    // 只保留有内容的行
    if (rowObj.module || rowObj.feature || rowObj.steps || rowObj.expected) {
      dataRows.push(rowObj);
    }
  }
  
  return dataRows;
}

/**
 * 解析步骤文本为数组
 */
function parseSteps(text) {
  if (!text) return [];
  const lines = text.split('\n').filter(line => line.trim());
  return lines.map(line => line.replace(/^[\d]+[、.）)\s]+/, '').trim()).filter(s => s);
}

/**
 * 转义Markdown表格
 */
function escapeMarkdownTable(text) {
  if (!text) return '-';
  return text.replace(/\|/g, '\\|').replace(/\n/g, '<br>').trim();
}

/**
 * 转换为Markdown
 */
function convertToMarkdown(testCases, title) {
  let md = `# ${title}\n\n`;
  md += `> 本文档由CSV自动转换生成，用于AI理解测试用例上下文\n\n---\n\n`;
  
  testCases.forEach((tc, index) => {
    const caseId = tc.id || `Case_${index + 1}`;
    md += `## ${index + 1}. ${caseId}\n\n`;
    
    md += `### 基本信息\n\n`;
    md += `| 属性 | 值 |\n|------|----||\n`;
    md += `| **模块** | ${tc.module || '-'} |\n`;
    md += `| **功能点** | ${tc.feature || '-'} |\n`;
    md += `| **用例等级** | ${tc.priority || '-'} |\n\n`;
    
    if (tc.precondition) {
      md += `### 预置条件\n\n${tc.precondition}\n\n`;
    }
    
    md += `### 测试步骤与预期结果\n\n`;
    const steps = parseSteps(tc.steps);
    const expected = parseSteps(tc.expected);
    
    if (steps.length > 0 || expected.length > 0) {
      md += `| 步骤 | 操作 | 预期结果 |\n|:----:|------|----------|\n`;
      const maxLen = Math.max(steps.length, expected.length);
      for (let i = 0; i < maxLen; i++) {
        md += `| ${i + 1} | ${escapeMarkdownTable(steps[i] || '')} | ${escapeMarkdownTable(expected[i] || '')} |\n`;
      }
      md += '\n';
    }
    
    md += `---\n\n`;
  });
  
  return md;
}

/**
 * 生成package名称
 */
function generatePackageName(csvFileName) {
  return path.basename(csvFileName, '.csv')
    .replace(/[\s_]+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .toLowerCase() || 'test-package';
}

/**
 * 创建package结构
 */
function createPackageStructure(packageName, markdownContent, csvFileName) {
  const packageDir = path.join(CONFIG.packagesDir, packageName);
  const casesDir = path.join(packageDir, 'cases');
  
  [packageDir, casesDir, path.join(casesDir, 'android'), path.join(casesDir, 'ios'), path.join(casesDir, 'web')]
    .forEach(dir => { if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); });
  
  const packageJson = {
    name: `@midscene/${packageName}`,
    version: '1.0.0',
    description: `${path.basename(csvFileName, '.csv')} 测试用例包`,
    private: true,
    scripts: {
      test: 'midscene cases',
      'test:android': 'midscene cases/android',
      'test:ios': 'midscene cases/ios',
      'test:web': 'midscene cases/web'
    }
  };
  
  fs.writeFileSync(path.join(packageDir, 'package.json'), JSON.stringify(packageJson, null, 2), CONFIG.encoding);
  
  const mdFileName = path.basename(csvFileName, '.csv') + '.md';
  fs.writeFileSync(path.join(casesDir, mdFileName), markdownContent, CONFIG.encoding);
  
  console.log(`✓ 生成: ${casesDir}/${mdFileName}`);
  return packageDir;
}

/**
 * 处理CSV文件
 */
function processCSVFile(csvFilePath) {
  console.log(`\n📄 处理: ${csvFilePath}`);
  
  try {
    const content = fs.readFileSync(csvFilePath, CONFIG.encoding);
    const testCases = parseCSV(content);
    
    if (testCases.length === 0) {
      console.log(`⚠️ 未找到有效用例`);
      return null;
    }
    
    console.log(`✓ 解析到 ${testCases.length} 个用例`);
    
    const packageName = generatePackageName(csvFilePath);
    const title = path.basename(csvFilePath, '.csv');
    const markdownContent = convertToMarkdown(testCases, title);
    
    return createPackageStructure(packageName, markdownContent, csvFilePath);
  } catch (error) {
    console.error(`❌ 失败: ${error.message}`);
    return null;
  }
}

// 主函数
function main() {
  const args = process.argv.slice(2);
  
  console.log('═'.repeat(50));
  console.log('  CSV转Package工具');
  console.log('═'.repeat(50));
  
  let csvFiles = args.length > 0
    ? args.map(arg => path.isAbsolute(arg) ? arg : path.join(process.cwd(), arg))
    : fs.existsSync(CONFIG.casesDir) 
      ? fs.readdirSync(CONFIG.casesDir).filter(f => f.endsWith('.csv')).map(f => path.join(CONFIG.casesDir, f))
      : [];
  
  if (csvFiles.length === 0) {
    console.log('\n⚠️ 未找到CSV文件');
    process.exit(1);
  }
  
  const results = csvFiles.filter(f => fs.existsSync(f)).map(processCSVFile).filter(Boolean);
  
  console.log('\n' + '═'.repeat(50));
  console.log(`  完成！转换 ${results.length}/${csvFiles.length} 个文件`);
  console.log('═'.repeat(50));
}

main();
