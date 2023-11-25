

// 添加的新函数，用于检查CSS文件的更新
function checkCSSUpdate(cssFilePath, interval) {
    let lastModified = '';

    setInterval(() => {
        fetch(cssFilePath, { method: 'HEAD' })
            .then(response => {
                const newLastModified = response.headers.get('Last-Modified');

                if (lastModified && newLastModified !== lastModified) {
                    // 如果文件已更新，重新加载CSS
                    updateCSSLink(cssFilePath);
                }

                lastModified = newLastModified;
            })
            .catch(error => console.error('Error checking for CSS update:', error));
    }, interval);
}

// 更新CSS链接的函数
function updateCSSLink(cssFilePath) {
    const cssLink = document.querySelector(`link[href="${cssFilePath}"]`);
    if (cssLink) {
        cssLink.href = cssFilePath + '?v=' + new Date().getTime();
    }
}

/*
定義一個函數用來載入並顯示Jupyter notebook文件。

`loadNotebook` 函數使用 `containerId`（顯示 notebook 内容的 HTML 元素的 ID）、
`nbUrl`（notebook 文件的 URL）、`cssPath`（CSS 文件的路徑）作為參數。
*/

function loadNotebook(containerId, nbUrl, cssPath) {
    // 如果提供了 CSS 路徑，則動態載入 CSS
    if (cssPath) {
        // 如果提供了 cssPath，則創建一個新的 link 元素
        var link = document.createElement('link');
        link.rel = 'stylesheet';   // 設置 link 元素的 rel 屬性為 stylesheet，表示這是一個樣式表
        link.href = cssPath;       // 將 link 元素的 href 屬性設置為傳入的 CSS 路徑
        document.head.appendChild(link); // 將創建的 link 元素添加到文件的 head 中，這樣樣式表就會被載入使用

        // 检查CSS更新
        checkCSSUpdate(cssPath, 30000); // 例如，每30秒检查一次
    }

    // 使用 fetch API 從指定 URL 獲取資料
    fetch(nbUrl)
        .then(response => response.json())  // 將回應轉換為 JSON
        .then(data => {
            // 將資料解析為 HTML
            const htmlContent = parseNotebook(data);
            // 將解析出的 HTML 內容設定到指定容器中
            document.getElementById(containerId).innerHTML = htmlContent;

            // highlight 所有 <pre><code></code></pre> 元素內的程式碼
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightBlock(block);
            });
        })
        .catch(error => console.error('Error loading notebook:', error));
}

// 函數用於將 Jupyter 筆記本數據轉換為 HTML
function parseNotebook(notebook) {
    let htmlContent = '';
    // 遍歷筆記本中的所有單元格
    notebook.cells.forEach((cell, index) => {
        if (cell.cell_type === 'markdown') {
            // 如果單元格是 Markdown 類型，則轉換為 HTML
            htmlContent += convertMarkdownToHtml(cell.source.join(''));
        } else if (cell.cell_type === 'code') {
            // 如果單元格是程式碼類型，則將其格式化為帶有行號的程式碼區塊
            htmlContent += `<div class="cell"><span class="input-label">IN [${index+1}]:</span><pre><code class="language-python">${cell.source.join('')}</code></pre></div>`;
            // 處理程式碼單元格的輸出
            if (cell.outputs.length > 0) {
                htmlContent += `<div class="cell-output"><span class="output-label">OUT [${index+1}]:</span>`;
                // 遍歷每個輸出並根據其類型進行處理
                cell.outputs.forEach(output => {
                    // 處理文字輸出
                    if (output.output_type === 'stream') {
                        htmlContent += `<pre>${output.text.join('')}</pre>`;
                    // 處理output或顯示數據
                    } else if (output.output_type === 'execute_result' || output.output_type === 'display_data') {
                        if (output.data['text/html']) {
                            htmlContent += output.data['text/html'].join('');
                        } else if (output.data['text/plain']) {
                            htmlContent += `<pre>${output.data['text/plain'].join('')}</pre>`;
                        }
                    }
                });
                // 結束輸出區塊的 HTML
                htmlContent += '</div>';
            }
        }
    });

    return htmlContent;
}

// 用於將 Markdown 轉換為 HTML。
function convertMarkdownToHtml(markdown) {
    return marked.parse(markdown);
}
