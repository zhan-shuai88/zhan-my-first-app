// 站点数据存储
let stationsData = loadStationsData();
// 历史数据存储
let historyData = loadHistoryData();

// 从本地存储加载数据
function loadStationsData() {
    console.log('loadStationsData called - script.js:8');
    const savedData = localStorage.getItem('stationsData');
    console.log('savedData: - script.js:10', savedData);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            console.log('parsedData: - script.js:14', parsedData);
            console.log('parsedData.length: - script.js:15', parsedData.length);
            return parsedData;
        } catch (error) {
            console.error('解析本地存储数据失败: - script.js:18', error);
            return [];
        }
    }
    console.log('No saved data found - script.js:22');
    return [];
}

// 保存数据到本地存储
function saveStationsData() {
    try {
        console.log('保存站点数据到本地存储 - script.js:29', stationsData);
        localStorage.setItem('stationsData', JSON.stringify(stationsData));
        console.log('站点数据保存成功 - script.js:31');
    } catch (error) {
        console.error('保存数据到本地存储失败: - script.js:33', error);
        showMessage('保存数据失败，请检查浏览器存储空间', 'error');
    }
}

// 从本地存储加载历史数据
function loadHistoryData() {
    console.log('loadHistoryData called - script.js:40');
    const savedData = localStorage.getItem('historyData');
    console.log('savedHistoryData: - script.js:42', savedData);
    if (savedData) {
        try {
            const parsedData = JSON.parse(savedData);
            console.log('parsedHistoryData: - script.js:46', parsedData);
            return parsedData;
        } catch (error) {
            console.error('解析历史数据失败: - script.js:49', error);
            return [];
        }
    }
    console.log('No history data found - script.js:53');
    return [];
}

// 保存历史数据到本地存储
function saveHistoryData() {
    try {
        localStorage.setItem('historyData', JSON.stringify(historyData));
    } catch (error) {
        console.error('保存历史数据失败: - script.js:62', error);
    }
}

// DOM元素
const stationForm = document.getElementById('stationForm');
const addStationBtn = document.getElementById('addStationBtn');
const exportBtn = document.getElementById('exportBtn');
const stationsList = document.getElementById('stationsList');
const message = document.getElementById('message');

// 初始化
function init() {
    // 添加站点按钮事件
    addStationBtn.addEventListener('click', addStation);
    
    // 导出PDF按钮事件
    exportBtn.addEventListener('click', exportPDF);
    
    // 自动定位按钮事件
    const locateBtn = document.getElementById('locateBtn');
    if (locateBtn) {
        locateBtn.addEventListener('click', getCurrentLocation);
    }
    
    // 获取当日时间按钮事件
    const getDateBtn = document.getElementById('getDateBtn');
    if (getDateBtn) {
        getDateBtn.addEventListener('click', getCurrentDate);
    }
    
    // 查看历史数据按钮事件
    const viewHistoryBtn = document.getElementById('viewHistoryBtn');
    if (viewHistoryBtn) {
        viewHistoryBtn.addEventListener('click', showHistorySection);
    }
    
    // 返回站点列表按钮事件
    const backToStationsBtn = document.getElementById('backToStationsBtn');
    if (backToStationsBtn) {
        backToStationsBtn.addEventListener('click', showStationsSection);
    }
    
    // 分享数据按钮事件
    const shareDataBtn = document.getElementById('shareDataBtn');
    if (shareDataBtn) {
        shareDataBtn.addEventListener('click', showShareModal);
    }
    
    // 导入数据按钮事件
    const importDataBtn = document.getElementById('importDataBtn');
    if (importDataBtn) {
        importDataBtn.addEventListener('click', showImportModal);
    }
    
    // 扫描二维码按钮事件
    const scanQrCodeBtn = document.getElementById('scanQrCodeBtn');
    if (scanQrCodeBtn) {
        scanQrCodeBtn.addEventListener('click', scanQRCode);
    }
    
    // 照片预览事件
    setupPhotoPreview();
    
    // 初始化模态框
    initModal();
    
    // 初始化分享和导入模态框
    initShareImportModals();
    
    // 更新站点列表
    updateStationsList();
    
    // 更新站点数量显示
    updateStationCount();
    
    // 页面加载时预加载PDF生成库
    loadPDFLibraries().catch(() => {
        console.log('预加载PDF生成库失败，将在导出时再尝试 - script.js:140');
    });
}

// 设置照片预览
function setupPhotoPreview() {
    const photoInputs = ['photo1', 'photo2', 'photo3'];
    
    photoInputs.forEach((photoId, index) => {
        const input = document.getElementById(photoId);
        if (input) {
            input.addEventListener('change', function(e) {
                const previewId = `photo${index + 1}Preview`;
                const preview = document.getElementById(previewId);
                
                if (e.target.files && e.target.files[0]) {
                    const reader = new FileReader();
                    
                    reader.onload = function(event) {
                        // 清空预览区域
                        preview.innerHTML = '';
                        
                        // 创建预览图片
                        const img = document.createElement('img');
                        img.src = event.target.result;
                        img.alt = `照片${index + 1}预览`;
                        
                        // 添加到预览区域
                        preview.appendChild(img);
                    };
                    
                    reader.readAsDataURL(e.target.files[0]);
                } else {
                    // 清空预览区域
                    preview.innerHTML = '';
                }
            });
        }
    });
}

// 添加站点
function addStation() {
    // 验证表单
    if (!validateForm()) {
        showMessage('请填写所有必填字段', 'error');
        return;
    }
    
    // 收集表单数据
    const stationData = {
        report_type: document.getElementById('report_type').value,
        flood_period: document.getElementById('flood_period').value,
        station_name: document.getElementById('station_name').value,
        station_address: document.getElementById('station_address').value,
        station_code: document.getElementById('station_code').value,
        longitude: document.getElementById('longitude').value,
        latitude: document.getElementById('latitude').value,
        device_model: document.getElementById('device_model').value,
        battery_info: document.getElementById('battery_info').value,
        check_results: {
            device_intact: document.querySelector('[data-item="device_intact"]').value,
            rain_gauge_clean: document.querySelector('[data-item="rain_gauge_clean"]').value,
            wiring_secure: document.querySelector('[data-item="wiring_secure"]').value,
            rtu_normal: document.querySelector('[data-item="rtu_normal"]').value,
            rtu_reading_match: document.querySelector('[data-item="rtu_reading_match"]').value,
            battery_voltage: document.querySelector('[data-item="battery_voltage"]').value
        },
        inspection_issues: document.getElementById('inspection_issues').value,
        inspector: document.getElementById('inspector').value,
        inspection_date: document.getElementById('inspection_date').value,
        photos: {
            photo1: null,
            photo2: null,
            photo3: null
        }
    };
    
    // 处理照片上传
    const photo1 = document.getElementById('photo1').files[0];
    const photo2 = document.getElementById('photo2').files[0];
    const photo3 = document.getElementById('photo3').files[0];
    
    // 使用FileReader读取照片并转换为base64
    const readers = [];
    const photos = [photo1, photo2, photo3];
    
    let loadedCount = 0;
    const totalPhotos = photos.filter(p => p).length;
    
    if (totalPhotos === 0) {
        // 没有照片，直接添加站点
        addStationWithPhotos(stationData);
        return;
    }
    
    photos.forEach((photo, index) => {
        if (photo) {
            const reader = new FileReader();
            reader.onload = function(e) {
                if (index === 0) stationData.photos.photo1 = e.target.result;
                if (index === 1) stationData.photos.photo2 = e.target.result;
                if (index === 2) stationData.photos.photo3 = e.target.result;
                
                loadedCount++;
                if (loadedCount === totalPhotos) {
                    addStationWithPhotos(stationData);
                }
            };
            reader.onerror = function() {
                loadedCount++;
                if (loadedCount === totalPhotos) {
                    addStationWithPhotos(stationData);
                }
            };
            reader.readAsDataURL(photo);
        } else {
            loadedCount++;
            if (loadedCount === totalPhotos) {
                addStationWithPhotos(stationData);
            }
        }
    });
    
    // 阻止默认的addStation执行
    return;
}

// 带照片的站点添加函数
function addStationWithPhotos(stationData) {
    // 添加到数据存储
    stationsData.push(stationData);
    
    // 保存数据到本地存储
    saveStationsData();
    
    // 清空表单
    resetForm();
    
    // 更新站点列表
    updateStationsList();
    
    // 显示成功消息
    showMessage('站点信息添加成功！', 'success');
}

// 验证表单
function validateForm() {
    const requiredFields = stationForm.querySelectorAll('[required]');
    for (const field of requiredFields) {
        if (!field.value) {
            return false;
        }
    }
    
    // 验证经纬度格式
    const longitude = document.getElementById('longitude').value;
    const latitude = document.getElementById('latitude').value;
    if (!validateCoordinates(longitude, latitude)) {
        showMessage('经纬度格式不正确，请输入有效的经纬度', 'error');
        return false;
    }
    
    return true;
}

// 验证经纬度格式
function validateCoordinates(longitude, latitude) {
    // 简单的经纬度格式验证
    const lonRegex = /^-?\d+(\.\d+)?$/;
    const latRegex = /^-?\d+(\.\d+)?$/;
    
    if (!lonRegex.test(longitude) || !latRegex.test(latitude)) {
        return false;
    }
    
    const lon = parseFloat(longitude);
    const lat = parseFloat(latitude);
    
    // 经度范围：-180 到 180
    // 纬度范围：-90 到 90
    return lon >= -180 && lon <= 180 && lat >= -90 && lat <= 90;
}

// 重置表单
function resetForm() {
    stationForm.reset();
}

// 更新站点数量显示
function updateStationCount() {
    const stationCountElement = document.getElementById('stationCount');
    if (stationCountElement) {
        stationCountElement.textContent = `(${stationsData.length})`;
    }
}

// 更新站点列表
function updateStationsList() {
    stationsList.innerHTML = '';
    
    if (stationsData.length === 0) {
        stationsList.innerHTML = '<li>暂无站点信息</li>';
    } else {
        stationsData.forEach((station, index) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <input type="checkbox" class="station-checkbox" data-index="${index}">
                <span class="station-name">${station.station_name}</span>
                <div class="btn-container">
                    <button class="view-btn" data-index="${index}">查看</button>
                    <button class="remove-btn" data-index="${index}">删除</button>
                </div>
            `;
            stationsList.appendChild(li);
        });
        
        // 添加删除事件
        document.querySelectorAll('.remove-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                removeStation(index);
            });
        });
        
        // 添加查看事件
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.getAttribute('data-index'));
                viewStation(index);
            });
        });
        
        // 添加全选/取消全选事件
        document.getElementById('selectAllBtn').addEventListener('click', function() {
            document.querySelectorAll('.station-checkbox').forEach(checkbox => {
                checkbox.checked = true;
            });
        });
        
        document.getElementById('selectNoneBtn').addEventListener('click', function() {
            document.querySelectorAll('.station-checkbox').forEach(checkbox => {
                checkbox.checked = false;
            });
        });
    }
    
    // 更新站点数量显示
    updateStationCount();
}

// 删除站点
function removeStation(index) {
    stationsData.splice(index, 1);
    saveStationsData();
    updateStationsList();
    showMessage('站点信息删除成功！', 'success');
}

// 获取当前位置
function getCurrentLocation() {
    // 确保DOM元素存在
    const longitudeInput = document.getElementById('longitude');
    const latitudeInput = document.getElementById('latitude');
    
    if (!longitudeInput || !latitudeInput) {
        // 显示错误消息
        showMessage('经纬度输入框未找到', 'error');
        return;
    }
    
    // 检查浏览器是否支持地理位置API
    if (!navigator.geolocation) {
        showMessage('您的浏览器不支持地理位置功能', 'error');
        return;
    }
    
    // 显示加载消息
    showMessage('正在获取位置...', 'success');
    
    // 使用浏览器的地理位置API获取真实位置
    navigator.geolocation.getCurrentPosition(
        function(position) {
            // 获取成功
            const longitude = position.coords.longitude.toFixed(6);
            const latitude = position.coords.latitude.toFixed(6);
            
            // 填充经纬度输入框
            longitudeInput.value = longitude;
            latitudeInput.value = latitude;
            
            // 显示成功消息
            showMessage('位置获取成功！', 'success');
        },
        function(error) {
            // 获取失败
            let errorMessage = '获取位置失败';
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage = '用户拒绝了位置请求';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage = '位置信息不可用';
                    break;
                case error.TIMEOUT:
                    errorMessage = '获取位置超时';
                    break;
                case error.UNKNOWN_ERROR:
                    errorMessage = '未知错误';
                    break;
            }
            showMessage(errorMessage, 'error');
        },
        {
            enableHighAccuracy: true, // 启用高精度
            timeout: 10000, // 10秒超时
            maximumAge: 0 // 不使用缓存
        }
    );
}

// 获取当日时间
function getCurrentDate() {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    
    const formattedDate = `${year}年${month}月${day}日`;
    document.getElementById('inspection_date').value = formattedDate;
    
    showMessage('已获取当日时间！', 'success');
}

// 查看站点详情
function viewStation(index) {
    const station = stationsData[index];
    if (!station) return;
    
    // 构建站点详情HTML
    let detailsHtml = `
        <div class="detail-group">
            <span class="detail-label">报告类型：</span>
            <span>${station.report_type || '自动雨量站'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">汛期：</span>
            <span>${station.flood_period || ''}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">站点名称：</span>
            <span>${station.station_name}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">站点地址：</span>
            <span>${station.station_address}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">测站编码：</span>
            <span>${station.station_code}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">经度：</span>
            <span>${station.longitude}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">纬度：</span>
            <span>${station.latitude}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">设备型号：</span>
            <span>${station.device_model}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">电池信息：</span>
            <span>${station.battery_info}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">巡检人员：</span>
            <span>${station.inspector}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">巡检时间：</span>
            <span>${station.inspection_date}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">巡检问题：</span>
            <span>${station.inspection_issues || '无'}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">检查结果：</span>
            <ul>
                <li>设备是否完好：${station.check_results.device_intact}</li>
                <li>雨量桶是否清洁：${station.check_results.rain_gauge_clean}</li>
                <li>各接线是否牢固：${station.check_results.wiring_secure}</li>
                <li>RTU运行状态是否正常：${station.check_results.rtu_normal}</li>
                <li>加水测试RTU读数是否与平台一致：${station.check_results.rtu_reading_match}</li>
                <li>蓄电池电压是否正常：${station.check_results.battery_voltage}</li>
            </ul>
        </div>
        <div class="detail-group">
            <span class="detail-label">照片：</span>
            <div class="photos-container">
    `;
    
    // 添加照片
    if (station.photos) {
        for (let i = 1; i <= 3; i++) {
            const photoKey = `photo${i}`;
            if (station.photos[photoKey]) {
                detailsHtml += `
                    <div class="photo-thumbnail">
                        <img src="${station.photos[photoKey]}" alt="照片${i}">
                    </div>
                `;
            } else {
                detailsHtml += `
                    <div class="photo-thumbnail">
                        <span>无照片</span>
                    </div>
                `;
            }
        }
    }
    
    detailsHtml += `
            </div>
        </div>
    `;
    
    // 显示详情
    document.getElementById('stationDetails').innerHTML = detailsHtml;
    
    // 显示模态框
    document.getElementById('stationModal').style.display = 'block';
}

// 初始化模态框
function initModal() {
    // 获取所有模态框和关闭按钮
    const modals = document.querySelectorAll('.modal');
    const closeBtns = document.querySelectorAll('.close');
    
    // 为每个关闭按钮添加点击事件
    closeBtns.forEach(btn => {
        btn.onclick = function() {
            const modal = this.closest('.modal');
            if (modal) {
                modal.style.display = 'none';
            }
        }
    });
    
    // 点击模态框外部关闭
    window.onclick = function(event) {
        modals.forEach(modal => {
            if (event.target == modal) {
                modal.style.display = 'none';
            }
        });
    }
}

// 显示消息
function showMessage(text, type) {
    message.textContent = text;
    message.className = `message ${type}`;
    
    // 3秒后隐藏消息
    setTimeout(() => {
        message.className = 'message';
    }, 3000);
}

// 导出PDF
function exportPDF() {
    // 获取选中的站点
    const selectedCheckboxes = document.querySelectorAll('.station-checkbox:checked');
    const selectedIndices = Array.from(selectedCheckboxes).map(checkbox => {
        return parseInt(checkbox.getAttribute('data-index'));
    });
    
    if (selectedIndices.length === 0) {
        showMessage('请选择要导出的站点', 'error');
        return;
    }
    
    showMessage('正在准备导出PDF，请稍候...', 'success');
    
    // 检查必要的库是否加载
    if (typeof jsPDF === 'undefined' || typeof html2canvas === 'undefined') {
        // 动态加载必要的库
        loadPDFLibraries().then(() => {
            generatePDF(selectedIndices, true);
        }).catch(error => {
            console.error('加载PDF生成库失败: - script.js:635', error);
            showMessage('加载PDF生成库失败，请检查网络连接', 'error');
        });
    } else {
        generatePDF(selectedIndices, true);
    }
}

// 加载PDF生成库
function loadPDFLibraries() {
    return new Promise((resolve, reject) => {
        const scripts = [
            'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js',
            'https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js'
        ];
        
        let loadedCount = 0;
        
        scripts.forEach(src => {
            const script = document.createElement('script');
            script.src = src;
            script.onload = () => {
                loadedCount++;
                if (loadedCount === scripts.length) {
                    resolve();
                }
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    });
}

// 生成PDF
function generatePDF(selectedIndices, saveToHistory = false) {
    try {
        const { jsPDF } = window.jspdf;
        
        if (selectedIndices.length === 0) {
            showMessage('请选择要导出的站点', 'error');
            return;
        }
        
        // 创建一个PDF实例
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4'
        });
        
        let processedCount = 0;
        const totalStations = selectedIndices.length;
        const stationsToExport = [];
        
        // 处理每个选中的站点
        selectedIndices.forEach((index, idx) => {
            const station = stationsData[index];
            if (!station) {
                processedCount++;
                if (processedCount === totalStations) {
                    savePDF(pdf, totalStations, selectedIndices, saveToHistory);
                }
                return;
            }
            
            // 保存要导出的站点数据
            stationsToExport.push(station);
            
            // 创建临时HTML元素来生成PDF内容
            const tempDiv = document.createElement('div');
            tempDiv.style.position = 'absolute';
            tempDiv.style.left = '-9999px';
            tempDiv.style.top = '-9999px';
            tempDiv.style.width = '210mm';
            tempDiv.style.padding = '20mm';
            tempDiv.style.backgroundColor = '#fff';
            tempDiv.style.fontFamily = 'SimSun, serif';
            
            // 处理照片数据
            let photo1Html = '';
            if (station.photos && station.photos.photo1) {
                photo1Html = `<img src="${station.photos.photo1}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                photo1Html = '上传照片1';
            }
            
            let photo2Html = '';
            if (station.photos && station.photos.photo2) {
                photo2Html = `<img src="${station.photos.photo2}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                photo2Html = '上传照片2';
            }
            
            let photo3Html = '';
            if (station.photos && station.photos.photo3) {
                photo3Html = `<img src="${station.photos.photo3}" style="width: 100%; height: 100%; object-fit: cover;">`;
            } else {
                photo3Html = '上传照片3';
            }
            
            // 构建HTML内容，模拟Word模板的表格布局
            tempDiv.innerHTML = `
                <div style="text-align: center; font-size: 16px; font-weight: bold; margin-bottom: 30px; color: #000;">
                    ${station.report_type || '自动雨量站'}巡检报告
                    <span style="float: right; font-size: 14px; font-weight: normal; padding: 2px 8px; background-color: #f0f0f0; color: #000;">
                        ${station.flood_period || ''}
                    </span>
                </div>
                <div style="font-family: SimSun, serif; color: #000;">
                <!-- 站点信息表格 -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 12px;">
                    <!-- 第一行：站点名称和站点地址 -->
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; width: 15%;">站点名称：</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 35%;">${station.station_name}</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 15%;">站点地址：</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 35%;">${station.station_address}</td>
                    </tr>
                    <!-- 第二行：测站编码、经度、纬度 -->
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px;">测站编码：</td>
                        <td style="border: 1px solid #000; padding: 5px;">${station.station_code}</td>
                        <td style="border: 1px solid #000; padding: 5px;">经度：</td>
                        <td style="border: 1px solid #000; padding: 5px;">${station.longitude}</td>
                    </tr>
                    <!-- 第三行：设备型号、纬度 -->
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px;">设备型号：</td>
                        <td style="border: 1px solid #000; padding: 5px;">${station.device_model}</td>
                        <td style="border: 1px solid #000; padding: 5px;">纬度：</td>
                        <td style="border: 1px solid #000; padding: 5px;">${station.latitude}</td>
                    </tr>
                    <!-- 第四行：电池信息 -->
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px;">电池信息：</td>
                        <td style="border: 1px solid #000; padding: 5px;" colspan="3">${station.battery_info}</td>
                    </tr>
                </table>
                
                <!-- 检查结果表格 -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 12px;">
                    <tr>
                        <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 10%;">序号</th>
                        <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 70%;">检查项目</th>
                        <th style="border: 1px solid #000; padding: 5px; text-align: center; width: 20%;">结果</th>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">1</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">设备是否完好</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.device_intact}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">2</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">雨量桶是否清洁</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.rain_gauge_clean}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">3</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">各接线是否牢固</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.wiring_secure}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">4</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">RTU运行状态是否正常</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.rtu_normal}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">5</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">加水测试RTU读数是否与平台一致</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.rtu_reading_match}</td>
                    </tr>
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">6</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">蓄电池电压是否正常</td>
                        <td style="border: 1px solid #000; padding: 5px; text-align: center;">${station.check_results.battery_voltage}</td>
                    </tr>
                </table>
                
                <!-- 巡检问题 -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 12px;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 3px; width: 15%; vertical-align: top;">巡检问题：</td>
                        <td style="border: 1px solid #000; padding: 3px; width: 85%; height: 40px;">${station.inspection_issues || '无'}</td>
                    </tr>
                </table>
                
                <!-- 上传照片区域 -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 0; font-size: 12px;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 0; text-align: center; width: 33.33%; height: 150px;">
                            ${photo1Html}
                        </td>
                        <td style="border: 1px solid #000; padding: 0; text-align: center; width: 33.33%; height: 150px;">
                            ${photo2Html}
                        </td>
                        <td style="border: 1px solid #000; padding: 0; text-align: center; width: 33.33%; height: 150px;">
                            ${photo3Html}
                        </td>
                    </tr>
                </table>
                
                <!-- 巡检人员和时间 -->
                <table style="width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 12px;">
                    <tr>
                        <td style="border: 1px solid #000; padding: 5px; width: 15%;">巡检人员：</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 35%;">${station.inspector}</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 15%;">巡检时间：</td>
                        <td style="border: 1px solid #000; padding: 5px; width: 35%;">${station.inspection_date}</td>
                    </tr>
                </table>
                
                <!-- 底部信息 -->
                <div style="text-align: center; font-size: 10px; color: #666; margin-top: 20px;">
                    湖北鲧石物联科技有限公司
                </div>
                </div>
            `;
            
            document.body.appendChild(tempDiv);
            
            // 使用html2canvas将HTML转换为图片
            html2canvas(tempDiv, {
                scale: 2, // 提高清晰度
                useCORS: true,
                logging: false,
                allowTaint: true, // 允许加载跨域图片
                taintTest: false // 禁用污点测试
            }).then(canvas => {
                // 移除临时元素
                document.body.removeChild(tempDiv);
                
                // 转换为图片数据
                const imgData = canvas.toDataURL('image/png');
                const width = pdf.internal.pageSize.getWidth();
                const height = pdf.internal.pageSize.getHeight();
                
                // 不是第一个站点时，添加新页面
                if (idx > 0) {
                    pdf.addPage();
                }
                
                // 将图片添加到PDF
                pdf.addImage(imgData, 'PNG', 0, 0, width, height);
                
                processedCount++;
                
                // 最后一个站点处理完成后保存PDF
                if (processedCount === totalStations) {
                    savePDF(pdf, totalStations, selectedIndices, saveToHistory, stationsToExport);
                }
            }).catch(error => {
                console.error('生成PDF失败: - script.js:886', error);
                showMessage('生成PDF失败，请重试', 'error');
                // 移除临时元素
                if (tempDiv.parentNode) {
                    document.body.removeChild(tempDiv);
                }
                
                processedCount++;
                if (processedCount === totalStations) {
                    savePDF(pdf, totalStations, selectedIndices, saveToHistory, stationsToExport);
                }
            });
        });
        
    } catch (error) {
        console.error('生成PDF失败: - script.js:901', error);
        showMessage('生成PDF失败，请检查控制台错误信息', 'error');
    }
}

// 保存PDF
function savePDF(pdf, stationCount, selectedIndices, saveToHistory = false, stationsToExport = []) {
    try {
        // 生成文件名
        const now = new Date();
        const timestamp = `${now.getFullYear()}${String(now.getMonth() + 1).padStart(2, '0')}${String(now.getDate()).padStart(2, '0')}_${String(now.getHours()).padStart(2, '0')}${String(now.getMinutes()).padStart(2, '0')}`;
        const fileName = `巡检报告汇总_${timestamp}.pdf`;
        
        // 保存PDF
        pdf.save(fileName);
        
        // 显示成功消息
        showMessage(`成功导出 ${stationCount} 个站点的PDF报告汇总`, 'success');
        
        // 保存到历史数据
        if (saveToHistory && stationsToExport.length > 0) {
            const historyEntry = {
                id: Date.now(),
                timestamp: now.toISOString(),
                fileName: fileName,
                stations: stationsToExport,
                stationCount: stationCount
            };
            
            historyData.push(historyEntry);
            saveHistoryData();
            
            // 从当前站点列表中移除已导出的站点（按索引从大到小删除，避免索引错乱）
            selectedIndices.sort((a, b) => b - a).forEach(index => {
                stationsData.splice(index, 1);
            });
            
            saveStationsData();
            updateStationsList();
            updateStationCount();
        }
    } catch (error) {
        console.error('保存PDF失败: - script.js:943', error);
        showMessage('保存PDF失败，请重试', 'error');
    }
}

// 显示历史数据区域
function showHistorySection() {
    document.querySelector('.stations-list').style.display = 'none';
    document.getElementById('historySection').style.display = 'block';
    updateHistoryList();
}

// 显示站点列表区域
function showStationsSection() {
    document.getElementById('historySection').style.display = 'none';
    document.querySelector('.stations-list').style.display = 'block';
}

// 更新历史数据列表
function updateHistoryList() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    
    if (historyData.length === 0) {
        historyList.innerHTML = '<li>暂无历史数据</li>';
        return;
    }
    
    // 按时间倒序排列历史数据
    const sortedHistory = [...historyData].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    
    sortedHistory.forEach((entry, index) => {
        const li = document.createElement('li');
        const date = new Date(entry.timestamp).toLocaleString('zh-CN');
        li.innerHTML = `
            <div class="history-entry">
                <div class="history-info">
                    <div class="history-title">${entry.fileName}</div>
                    <div class="history-meta">
                        <div>时间: ${date}</div>
                        <div>站点数: ${entry.stationCount}</div>
                    </div>
                </div>
                <div class="history-actions">
                    <button class="view-history-btn" data-index="${index}">查看</button>
                    <button class="delete-history-btn" data-index="${index}">删除</button>
                </div>
            </div>
        `;
        historyList.appendChild(li);
    });
    
    // 添加查看历史数据事件
    document.querySelectorAll('.view-history-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            viewHistoryDetail(index);
        });
    });
    
    // 添加删除历史数据事件
    document.querySelectorAll('.delete-history-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.getAttribute('data-index'));
            deleteHistoryEntry(index);
        });
    });
}

// 查看历史数据详情
function viewHistoryDetail(index) {
    const entry = historyData[index];
    if (!entry) return;
    
    // 构建历史数据详情HTML
    let detailsHtml = `
        <div class="detail-group">
            <span class="detail-label">文件名：</span>
            <span>${entry.fileName}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">导出时间：</span>
            <span>${new Date(entry.timestamp).toLocaleString('zh-CN')}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">包含站点数：</span>
            <span>${entry.stationCount}</span>
        </div>
        <div class="detail-group">
            <span class="detail-label">包含站点：</span>
            <ul>
    `;
    
    entry.stations.forEach((station, stationIndex) => {
        detailsHtml += `
            <li>${stationIndex + 1}. ${station.station_name} (${station.station_address})</li>
        `;
    });
    
    detailsHtml += `
            </ul>
        </div>
    `;
    
    // 显示详情
    document.getElementById('stationDetails').innerHTML = detailsHtml;
    
    // 显示模态框
    document.getElementById('stationModal').style.display = 'block';
}

// 删除历史数据
function deleteHistoryEntry(index) {
    if (confirm('确定要删除这条历史数据吗？')) {
        historyData.splice(index, 1);
        saveHistoryData();
        updateHistoryList();
        showMessage('历史数据删除成功！', 'success');
    }
}

// 初始化分享和导入模态框
function initShareImportModals() {
    // 分享数据模态框
    const shareModal = document.getElementById('shareModal');
    const shareClose = shareModal.querySelector('.close');
    
    // 导入数据模态框
    const importModal = document.getElementById('importModal');
    const importClose = importModal.querySelector('.close');
    
    // 注意：关闭按钮和点击外部关闭的事件处理已在initModal函数中统一处理
    // 这里不再重复绑定事件，避免冲突
}

// 显示分享数据模态框
function showShareModal() {
    // 准备分享的数据
    const shareData = {
        stations: stationsData,
        history: historyData,
        timestamp: new Date().toISOString()
    };
    
    console.log('准备分享的数据 - script.js:1087', shareData);
    
    try {
        // 转换为JSON字符串
        const dataString = JSON.stringify(shareData);
        console.log('转换后的JSON字符串长度 - script.js:1092', dataString.length);
        
        // 生成二维码
        const qrcodeContainer = document.getElementById('qrcodeContainer');
        qrcodeContainer.innerHTML = '<p>正在生成二维码...</p>';
        
        // 检查QRCode库是否加载
        if (typeof QRCode === 'undefined') {
            console.error('QRCode库未加载 - script.js:1100');
            qrcodeContainer.innerHTML = '<p>二维码生成库未加载，请刷新页面重试</p>';
            return;
        }
        
        // 检查数据大小
        if (dataString.length > 2000) {
            console.warn('数据过大，可能导致二维码生成失败 - script.js:1107');
            // 尝试压缩数据
            const compressedData = {
                stations: stationsData.map(station => ({
                    station_name: station.station_name,
                    station_address: station.station_address,
                    station_code: station.station_code,
                    longitude: station.longitude,
                    latitude: station.latitude
                })),
                timestamp: new Date().toISOString()
            };
            const compressedString = JSON.stringify(compressedData);
            console.log('压缩后的数据长度: - script.js:1120', compressedString.length);
            generateQRCode(qrcodeContainer, compressedString);
        } else {
            generateQRCode(qrcodeContainer, dataString);
        }
        
        // 显示模态框
        document.getElementById('shareModal').style.display = 'block';
    } catch (error) {
        console.error('分享数据失败: - script.js:1129', error);
        showMessage('分享数据失败，请重试', 'error');
    }
}

// 生成二维码的辅助函数
function generateQRCode(container, data) {
    try {
        // 清空容器
        container.innerHTML = '';
        
        // 创建canvas元素
        const canvas = document.createElement('canvas');
        container.appendChild(canvas);
        
        // 生成二维码
        QRCode.toCanvas(canvas, data, {
            width: 300,
            margin: 1,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        }, function(error) {
            if (error) {
                console.error('生成二维码失败: - script.js:1154', error);
                container.innerHTML = '<p>生成二维码失败，请重试</p>';
            } else {
                console.log('二维码生成成功 - script.js:1157');
            }
        });
    } catch (error) {
        console.error('生成二维码过程中出错: - script.js:1161', error);
        container.innerHTML = '<p>生成二维码失败，请重试</p>';
    }
}

// 显示导入数据模态框
function showImportModal() {
    // 重置导入状态
    document.getElementById('importStatus').textContent = '';
    document.getElementById('qrCodeFile').value = '';
    
    // 显示模态框
    document.getElementById('importModal').style.display = 'block';
}

// 扫描二维码
function scanQRCode() {
    const fileInput = document.getElementById('qrCodeFile');
    const importStatus = document.getElementById('importStatus');
    
    if (!fileInput.files || fileInput.files.length === 0) {
        importStatus.textContent = '请选择一张包含二维码的图片';
        importStatus.style.color = 'red';
        return;
    }
    
    const file = fileInput.files[0];
    const reader = new FileReader();
    
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            // 创建Canvas元素
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0);
            
            // 获取图像数据
            const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            
            // 扫描二维码
            const code = jsQR(imageData.data, imageData.width, imageData.height);
            
            if (code) {
                try {
                    // 解析二维码数据
                    const importData = JSON.parse(code.data);
                    
                    // 导入数据
                    importDataFunction(importData);
                    
                    importStatus.textContent = '数据导入成功！';
                    importStatus.style.color = 'green';
                    
                    // 关闭模态框
                    setTimeout(() => {
                        document.getElementById('importModal').style.display = 'none';
                    }, 2000);
                } catch (error) {
                    console.error('解析二维码数据失败: - script.js:1223', error);
                    importStatus.textContent = '解析二维码数据失败，请确保二维码包含有效的数据';
                    importStatus.style.color = 'red';
                }
            } else {
                importStatus.textContent = '未检测到二维码，请确保图片包含有效的二维码';
                importStatus.style.color = 'red';
            }
        };
        img.src = e.target.result;
    };
    
    reader.readAsDataURL(file);
}

// 导入数据
function importDataFunction(importData) {
    if (importData.stations && Array.isArray(importData.stations)) {
        // 导入站点数据
        stationsData = stationsData.concat(importData.stations);
        saveStationsData();
    }
    
    if (importData.history && Array.isArray(importData.history)) {
        // 导入历史数据
        historyData = historyData.concat(importData.history);
        saveHistoryData();
    }
    
    // 更新站点列表和站点数量
    updateStationsList();
    updateStationCount();
    
    // 显示成功消息
    showMessage('数据导入成功！', 'success');
}

// 初始化应用
init();
