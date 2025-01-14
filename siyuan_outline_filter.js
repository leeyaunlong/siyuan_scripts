// 右侧dock添加按钮
// see https://ld246.com/article/1735489255593
(() => {
        const fontSizes = [16, 24, 48];

        // 鼠标悬停是否显示提示信息，true显示，false不显示
        const showTips = true;

        // 手机版返回
        if (isMobile()) return;

        // 监听dock加载完毕
        whenElementExist('#dockRight .dock__items .dock__item--pin').then((pin) => {
                // 这里可以添加多个字号
                let vtext="Of";
                addButton(vtext, pin);            
        });

    // 设置字体大小
    function addButton(vtext, pin) {
        const buttonString = `<span class="dock__item ariaLabel" aria-label="${showTips ? 'filter outline' : ''}">Of</span>`;
        // 创建一个 DocumentFragment
        const fragment = document.createRange().createContextualFragment(buttonString);
        // 提取 span 元素
        const button = fragment.firstChild;
        button.onclick = (event) => {
            event.preventDefault(); // 阻止表单提交的默认行为
            event.stopPropagation(); // 阻止事件冒泡
            addFilter_outline();
        };
        pin.before(button);
    }

    function addFilter_outline() {
        // 动态添加输入框、重置按钮和关闭按钮容器
        const existingInput = document.getElementById('outline_filter_container');
        if (existingInput) existingInput.remove();

        const container = document.createElement('div');
        container.id = 'outline_filter_container';
        container.style.display = 'flex';
        container.style.alignItems = 'center';
        //container.style.marginBottom = '10px';

        const input = document.createElement('input');
        input.id = 'outline_filter';
        input.type = 'text';
        input.style.flex = '1';
        //input.style.marginRight = '10px';
        input.class = 'b3-text-field fn__block';

        const resetButton = document.createElement('button');
        resetButton.textContent = '🔄';
        //resetButton.style.padding = '5px 10px';
        //resetButton.style.marginRight = '10px';
        resetButton.style.cursor = 'pointer';

        const closeButton = document.createElement('button');
        closeButton.textContent = '✖';
        //closeButton.style.padding = '5px 10px';
        closeButton.style.cursor = 'pointer';

        container.appendChild(input);
        container.appendChild(resetButton);
        container.appendChild(closeButton);
        document.querySelector('.fn__flex-1.fn__flex-column.file-tree.sy__outline').parentElement.insertAdjacentElement('beforebegin', container);

        const resetDisplay = () => {
            const spans = document.querySelectorAll('.fn__flex-1.fn__flex-column.file-tree.sy__outline li span.b3-list-item__text.ariaLabel');
            spans.forEach(span => {
                const listItem = span.parentElement;
                listItem.style.display = ''; // 重置所有项的显示状态
            });
        };

        input.addEventListener('input', function() {
            const filterText = input.value.toLowerCase();
            const spans = document.querySelectorAll('.fn__flex-1.fn__flex-column.file-tree.sy__outline li span.b3-list-item__text.ariaLabel');

            spans.forEach(span => {
                const listItem = span.parentElement;
                const text = span.textContent.toLowerCase();

                if (text.includes(filterText)) {
                    listItem.style.display = '';
                } else {
                    listItem.style.display = 'none';
                }
            });
        });

        resetButton.addEventListener('click', function() {
            input.value = ''; // 清空输入框
            resetDisplay(); // 重置显示状态
        });

        closeButton.addEventListener('click', function() {
            input.value = ''; // 清空输入框
            resetDisplay(); // 重置显示状态
            container.remove(); // 移除输入框容器
        });
    }


    function isMobile() {
        return !!document.getElementById("sidebar");
    }

    function isIPhone() {
        return navigator.userAgent.indexOf("iPhone") > -1;
    }
    
    function isIPad() {
        return navigator.userAgent.indexOf("iPad") > -1;
    }
    
    function isMac() {
        return navigator.platform.toUpperCase().indexOf("MAC") > -1;
    }
    
    async function isWin11() {
        if (!(navigator).userAgentData || !(navigator).userAgentData.getHighEntropyValues) {
            return false;
        }
        const ua = await (navigator).userAgentData.getHighEntropyValues(["platformVersion"]);
        if ((navigator).userAgentData.platform === "Windows") {
            if (parseInt(ua.platformVersion.split(".")[0]) >= 13) {
               return true;
            }
        }
        return false;
    }

    // 请求api
    async function fetchSyncPost(url, data, returnType = 'json') {
        const init = {
            method: "POST",
        };
        if (data) {
            if (data instanceof FormData) {
                init.body = data;
            } else {
                init.body = JSON.stringify(data);
            }
        }
        try {
            const res = await fetch(url, init);
            const res2 = returnType === 'json' ? await res.json() : await res.text();
            return res2;
        } catch(e) {
            console.log(e);
            return returnType === 'json' ? {code:e.code||1, msg: e.message||"", data: null} : "";
        }
    }

    // 等待元素出现
    function whenElementExist(selector, node) {
        return new Promise(resolve => {
            const check = () => {
                const el = typeof selector==='function'?selector():(node||document).querySelector(selector);
                if (el) resolve(el); else requestAnimationFrame(check);
            };
            check();
        });
    }


})();