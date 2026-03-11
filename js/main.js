/**
 * 十一养成日记 - 主脚本
 * 负责动态数据更新和交互功能
 */

// 配置信息
const CONFIG = {
  startDate: '2026-03-09',  // 开始日期
  currentVersion: 'v0.5',   // 最新版本
  githubRepo: 'https://github.com/wangzhfeng/openclaw-diary',
  markdownViewerRepo: 'https://github.com/wangzhfeng/MarkdownViewer'
};

/**
 * 计算运行天数
 */
function calculateRunningDays() {
  const start = new Date(CONFIG.startDate);
  const today = new Date();
  const diffTime = Math.abs(today - start);
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}

/**
 * 更新统计数据
 */
function updateStats() {
  // 运行天数
  const runningDaysEl = document.querySelector('.stat-card:nth-child(1) .stat-number');
  if (runningDaysEl) {
    runningDaysEl.textContent = calculateRunningDays();
  }
  
  // 最新版本
  const versionEl = document.querySelector('.stat-card:nth-child(4) .stat-number');
  if (versionEl) {
    versionEl.textContent = CONFIG.currentVersion;
  }
}

/**
 * 更新日期
 */
function updateLastUpdated() {
  const footer = document.querySelector('footer p');
  if (footer) {
    const today = new Date();
    const dateStr = today.getFullYear() + '-' + 
                   String(today.getMonth() + 1).padStart(2, '0') + '-' + 
                   String(today.getDate()).padStart(2, '0');
    footer.textContent = '最后更新：' + dateStr;
  }
}

/**
 * 添加平滑滚动
 */
function initSmoothScroll() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const targetId = this.getAttribute('href');
      const target = document.querySelector(targetId);
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });
}

/**
 * 添加标签点击效果
 */
function initTagEffects() {
  document.querySelectorAll('.tag').forEach(tag => {
    tag.style.cursor = 'pointer';
    tag.addEventListener('click', function() {
      // 未来可以扩展为筛选功能
      console.log('Tag clicked:', this.textContent);
    });
  });
}

/**
 * 初始化
 */
document.addEventListener('DOMContentLoaded', function() {
  updateStats();
  updateLastUpdated();
  initSmoothScroll();
  initTagEffects();
  
  console.log('🤖 十一养成日记已加载');
  console.log('运行天数：' + calculateRunningDays());
  console.log('当前版本：' + CONFIG.currentVersion);
});
