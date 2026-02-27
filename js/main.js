// 主题切换逻辑
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// 初始化主题：优先读取本地存储，否则跟随系统偏好
function initTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        html.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        html.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// 切换主题
themeToggle.addEventListener('click', () => {
    const currentTheme = html.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
});

// 加载并渲染博客列表
async function loadBlogList() {
    const blogGrid = document.getElementById('blog-grid');
    if (!blogGrid) return;

    try {
        // 读取博客清单文件
        const response = await fetch('blog/manifest.json');
        if (!response.ok) throw new Error('博客清单加载失败');
        const blogList = await response.json();

        // 渲染博客卡片
        blogGrid.innerHTML = blogList.map(blog => `
            <a href="blog/${blog.filename}" class="blog-card">
                <div class="card-image-wrapper">
                    <img src="${blog.cover}" alt="${blog.title}" class="card-image" loading="lazy">
                </div>
                <h2 class="card-title">${blog.title}</h2>
                <p class="card-desc">${blog.description}</p>
                <div class="card-tags">
                    ${blog.keywords.map(keyword => `<span class="tag">${keyword}</span>`).join('')}
                </div>
            </a>
        `).join('');

    } catch (error) {
        console.error(error);
        blogGrid.innerHTML = '<p>博客列表加载失败，请检查manifest.json文件</p>';
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    loadBlogList();
});