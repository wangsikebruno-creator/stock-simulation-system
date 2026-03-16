#!/usr/bin/env node

/**
 * API 测试脚本
 * 用于测试 Tushare API 和项目 API 端点
 */

const https = require('https');

// 配置
const TUSHARE_TOKEN = process.env.TUSHARE_TOKEN;
const API_URL = process.env.API_URL || 'http://localhost:5173';

// 颜色输出
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m'
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

// 测试 Tushare API
async function testTushareAPI() {
  log('\n📊 测试 Tushare API...', 'blue');

  if (!TUSHARE_TOKEN) {
    log('✗ TUSHARE_TOKEN 未设置', 'red');
    log('  请设置环境变量: export TUSHARE_TOKEN=你的Token', 'yellow');
    return false;
  }

  try {
    const axios = require('axios');
    const today = new Date().toISOString().slice(0, 10).replace(/-/g, '');

    const response = await axios.post('http://api.tushare.pro', {
      api_name: 'daily',
      token: TUSHARE_TOKEN,
      params: {
        ts_code: '600000.SH',
        trade_date: today
      },
      fields: 'ts_code,trade_date,close,pct_chg'
    });

    if (response.data.code === 0) {
      log('✓ Tushare API 连接成功', 'green');
      log(`  返回数据: ${JSON.stringify(response.data.data)}`, 'yellow');
      return true;
    } else {
      log(`✗ Tushare API 错误: ${response.data.msg}`, 'red');
      return false;
    }
  } catch (error) {
    log(`✗ Tushare API 请求失败: ${error.message}`, 'red');
    return false;
  }
}

// 测试项目 API
async function testProjectAPI() {
  log('\n🔧 测试项目 API...', 'blue');

  try {
    const axios = require('axios');

    // 测试 /api/quotes
    log('\n  测试 /api/quotes...', 'yellow');
    const quotesResponse = await axios.get(`${API_URL}/api/quotes`);

    if (quotesResponse.data.success) {
      log('  ✓ /api/quotes 正常', 'green');
      log(`    返回 ${quotesResponse.data.data.length} 只股票`, 'yellow');
    } else {
      log(`  ✗ /api/quotes 失败: ${quotesResponse.data.error}`, 'red');
    }

    // 测试 /api/history
    log('\n  测试 /api/history...', 'yellow');
    const historyResponse = await axios.get(`${API_URL}/api/history?symbol=600000.SH&days=7`);

    if (historyResponse.data.success) {
      log('  ✓ /api/history 正常', 'green');
      log(`    返回 ${historyResponse.data.data.length} 条历史数据`, 'yellow');
    } else {
      log(`  ✗ /api/history 失败: ${historyResponse.data.error}`, 'red');
    }

    return true;
  } catch (error) {
    log(`✗ 项目 API 请求失败: ${error.message}`, 'red');
    log('  提示: 请确保开发服务器正在运行 (npm run dev)', 'yellow');
    return false;
  }
}

// 主函数
async function main() {
  log('='.repeat(60), 'blue');
  log('模拟股票实验系统 - API 测试工具', 'blue');
  log('='.repeat(60), 'blue');

  // 检查依赖
  try {
    require('axios');
  } catch (e) {
    log('\n✗ 缺少依赖: axios', 'red');
    log('  请运行: npm install axios', 'yellow');
    process.exit(1);
  }

  await testTushareAPI();
  await testProjectAPI();

  log('\n' + '='.repeat(60), 'blue');
  log('测试完成！', 'green');
  log('='.repeat(60), 'blue');
}

// 运行测试
main().catch(error => {
  log(`\n✗ 测试失败: ${error.message}`, 'red');
  process.exit(1);
});
