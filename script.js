// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------
    // 要素の取得
    // ----------------------------------------
    const hourRow = document.querySelector('.hour-row');
    const minuteRow = document.querySelector('.minute-row');
    const timelineBody = document.querySelector('.timeline-body');
    const namesArea = document.querySelector('.names-area');
    const namesHeaderSpacer = document.querySelector('.names-header-spacer');
    
    const btnAm = document.getElementById('btn-am');
    const btnPm = document.getElementById('btn-pm');
    const btnNorth = document.getElementById('btn-north');
    const btnSouth = document.getElementById('btn-south');
    const btnNurseBoard = document.getElementById('btn-nurse-board');
    const btnBedBoard = document.getElementById('btn-bed-board');

    // ★人数入力の要素を取得
    const countNorthInput = document.getElementById('count-north');
    const countSouthInput = document.getElementById('count-south');

    // ★ベッド表示エリアの要素を取得
    const northBedsDisplay = document.getElementById('north-beds-display');
    const southBedsDisplay = document.getElementById('south-beds-display');
    const northWardRow = document.getElementById('north-ward-row');
    const southWardRow = document.getElementById('south-ward-row');

    // ★ケアリストの要素を取得
    const careListTabsContainer = document.querySelector('.care-list-tabs');
    const careListBody = document.querySelector('.care-list-body');

    // ----------------------------------------
    // 定数・データ
    // ----------------------------------------
    const totalHours = 5;
    const blocksPerHour_Header = 6;
    const blocksPerHour_Body = 12;
    const minutes = ['0', '10', '20', '30', '40', '50'];
    
    // ★ベッドの定義を追加
    const beds = {
        north: { count: 10, type: 'number' },
        south: { count: 12, type: 'alpha' }
    };

    // ★ケアタスクのデータを追加
    const careTasks = {
        care: {
            label: 'ケア',
            items: [
                { name: '清拭1', staff: 1, time: 4 }, // 20分
                { name: '清拭2', staff: 2, time: 3 }, // 15分
                { name: '食事介助', staff: 1, time: 4 }, // 20分
                { name: 'リハビリ1', staff: 1, time: 4 }, // 20分
                { name: 'リハビリ2', staff: 2, time: 4 }, // 20分
                { name: '吸痰', staff: 1, time: 1 }, // 5分
                { name: '見守り', staff: 1, time: 2 }, // 10分
                { name: '検温', staff: 1, time: 1 }, // 5分
                { name: '口腔ケア(挿管)', staff: 1, time: 2 }, // 10分
                { name: '体位交換(挿管)', staff: 2, time: 1 }, // 5分
                { name: '体位交換(非挿管)', staff: 1, time: 2 }, // 10分
                { name: 'トイレ介助', staff: 1, time: 2 }, // 10分 
            ]
        },
        work: {
            label: '業務',
            items: [
                { name: '申し送り', staff: 1, time: 2 }, // 10分
                { name: '記録', staff: 1, time: 2 }, // 10分
                { name: '転棟後片づけ', staff: 1, time: 4 }, // 20分
                { name: '転棟準備', staff: 1, time: 2 }, // 10分
                { name: '指示受け', staff: 1, time: 4 }, // 20分
                { name: '点滴セット', staff: 1, time: 2 }, // 10分
                { name: '内服セット', staff: 1, time: 2 }, // 10分
                { name: '転室', staff: 3, time: 2 }, // 10分
                { name: 'カンファレンス', staff: 1, time: 2 }, // 10分
                { name: '転棟1', staff: 1, time: 4 }, // 20分
                { name: '転棟2', staff: 2, time: 4 }, // 20分
                { name: '休憩交代', staff: 1, time: 9 }, // 45分
            ]
        },
        treatment: {
            label: '処置',
            items: [
                { name: '採血/血ガス', staff: 1, time: 1 }, // 5分
                { name: '培養', staff: 1, time: 2 }, // 10分
                { name: 'CV/PICC', staff: 1, time: 6 }, // 30分
                { name: '挿管', staff: 2, time: 4 }, // 20分
                { name: '抜管', staff: 2, time: 4 }, // 20分
                { name: 'D抜去', staff: 1, time: 4 }, // 20分
                { name: 'BF', staff: 1, time: 4 }, // 20分
                { name: 'RRT', staff: 1, time: 6 }, // 30分
                { name: '入室', staff: 3, time: 6 }, // 30分
            ]
        },
        other: {
            label: 'その他',
            items: [
                { name: '面会/家族対応', staff: 1, time: 4 }, // 20分
                { name: 'ナースコール対応', staff: 1, time: 4 }, // 20分
            ]
        },
        break: {
            label: '休憩',
            items: [
                { name: '休憩', staff: 1, time: 9 }, // 45分
                { name: '仮眠', staff: 1, time: 24 }, // 120分
            ]
        }
    };

    // ----------------------------------------
    // 状態管理
    // ----------------------------------------
    let currentViewMode = 'nurse'; // 'nurse' or 'bed'
    let currentWard = 'north';
    let currentShiftStartHour = 8;
    let currentCareCategory = 'care'; // ★ケアリストの現在のカテゴリ

    // ----------------------------------------
    // ★関数: ベッド表示エリアを初期化
    // ----------------------------------------
    function initializeBedDisplays() {
        // 南病棟ベッド (L -> A)
        const southBedList = generateBedList(beds.south).reverse();
        southBedList.forEach(bedName => {
            const bedBox = document.createElement('div');
            bedBox.classList.add('bed-box');
            bedBox.textContent = bedName;
            southBedsDisplay.appendChild(bedBox);
        });

        // 北病棟ベッド (1 -> 10)
        const northBedList = generateBedList(beds.north);
        northBedList.forEach(bedName => {
            const bedBox = document.createElement('div');
            bedBox.classList.add('bed-box');
            bedBox.textContent = bedName;
            northBedsDisplay.appendChild(bedBox);
        });
    }

    // ----------------------------------------
    // ★関数: ベッド名リストを生成
    // ----------------------------------------
    function generateBedList(config) {
        const list = [];
        if (config.type === 'number') {
            for (let i = 1; i <= config.count; i++) {
                list.push(String(i));
            }
        } else if (config.type === 'alpha') {
            for (let i = 0; i < config.count; i++) {
                list.push(String.fromCharCode(65 + i)); // A, B, C...
            }
        }
        return list;
    }

    // ----------------------------------------
    // ★関数: 人数に応じて看護師リストを生成 (この関数が抜けていました)
    // ----------------------------------------
    function generateNurseList(count, startNumber, leaderPrefix) {
        const list = [];
        const nurseCount = count - 1;
        for (let i = 0; i < nurseCount; i++) {
            list.push(`看護師${startNumber + i}`);
        }
        list.push(`リーダー${leaderPrefix}`);
        return list;
    }

    // ----------------------------------------
    // ★関数: 看護師ボードを描画
    // ----------------------------------------
    function renderNurseBoard(ward) {
        let nurseList;
        const northCount = parseInt(countNorthInput.value, 10);
        const southCount = parseInt(countSouthInput.value, 10);

        if (ward === 'north') {
            nurseList = generateNurseList(northCount, 1, '北');
        } else {
            const southStartNumber = northCount;
            nurseList = generateNurseList(southCount, southStartNumber, '南');
        }

        nurseList.forEach((name, index) => {
            const nameBlock = document.createElement('div');
            nameBlock.classList.add('nurse-name-block');
            nameBlock.textContent = name;
            namesArea.appendChild(nameBlock);

            const rowGroup = document.createElement('div');
            rowGroup.classList.add('nurse-row-group');
            for (let i = 1; i <= 3; i++) {
                const timelineRow = document.createElement('div');
                timelineRow.classList.add('timeline-row');
                timelineRow.id = `nurse${index + 1}-row${i}`;
                rowGroup.appendChild(timelineRow);
            }
            timelineBody.appendChild(rowGroup);
        });
    }

    // ----------------------------------------
    // ★関数: ベッドボードを描画
    // ----------------------------------------
    function renderBedBoard(ward) {
        const bedConfig = beds[ward];
        const bedList = generateBedList(bedConfig);

        bedList.forEach((name, index) => {
            const nameBlock = document.createElement('div');
            nameBlock.classList.add('bed-name-block');
            nameBlock.textContent = name;
            namesArea.appendChild(nameBlock);

            const rowGroup = document.createElement('div');
            rowGroup.classList.add('bed-row-group');
            
            const timelineRow = document.createElement('div');
            timelineRow.classList.add('timeline-row');
            timelineRow.id = `bed${name}-row1`;
            rowGroup.appendChild(timelineRow);
            
            timelineBody.appendChild(rowGroup);
        });
    }

    // ----------------------------------------
    // ★関数: ケアリストを描画
    // ----------------------------------------
    function renderCareList(category) {
        careListBody.innerHTML = '';
        const tasks = careTasks[category].items;

        tasks.forEach(task => {
            const itemEl = document.createElement('div');
            itemEl.classList.add('care-item');
            itemEl.dataset.category = category;

            itemEl.innerHTML = `
                <div class="care-item-name">${task.name}</div>
                <div class="care-item-staff">${task.staff}人</div>
                <div class="care-item-time">${task.time * 5}分</div>
            `;
            careListBody.appendChild(itemEl);
        });
    }

    // ----------------------------------------
    // ★関数: ケアリストのタブを初期化
    // ----------------------------------------
    function initializeCareTabs() {
        careListTabsContainer.innerHTML = '';
        Object.keys(careTasks).forEach(key => {
            const tabEl = document.createElement('button');
            tabEl.classList.add('care-tab');
            tabEl.dataset.category = key;
            tabEl.textContent = careTasks[key].label;
            if (key === currentCareCategory) {
                tabEl.classList.add('active');
            }

            tabEl.addEventListener('click', () => {
                currentCareCategory = key;
                // すべてのタブからactiveクラスを削除
                careListTabsContainer.querySelectorAll('.care-tab').forEach(t => t.classList.remove('active'));
                // クリックされたタブにactiveクラスを追加
                tabEl.classList.add('active');
                // リストを再描画
                renderCareList(key);
            });

            careListTabsContainer.appendChild(tabEl);
        });
    }

    // ----------------------------------------
    // 関数: 左側エリアとタイムライン本体を描画（分岐処理）
    // ----------------------------------------
    function renderMainArea() {
        // 既存の内容をクリア
        namesArea.innerHTML = '';
        namesArea.appendChild(namesHeaderSpacer);
        timelineBody.innerHTML = '';

        if (currentViewMode === 'nurse') {
            renderNurseBoard(currentWard);
        } else {
            renderBedBoard(currentWard);
        }
    }

    // ----------------------------------------
    // 関数: 時間軸をクリアする
    // ----------------------------------------
    function clearTimelineHeader() {
        hourRow.innerHTML = '';
        minuteRow.innerHTML = '';
    }

    // ----------------------------------------
    // 関数: 時間軸を描画する
    // ----------------------------------------
    function createTimeline(startHour) {
        clearTimelineHeader();

        // --- 1. ヘッダー（時）の生成 ---
        for (let h = 0; h < totalHours; h++) {
            const hourBlock = document.createElement('div');
            hourBlock.classList.add('hour-block');
            hourBlock.textContent = startHour + h;
            hourRow.appendChild(hourBlock);
        }

        // --- 2. ヘッダー（分）の生成 ---
        for (let h = 0; h < totalHours; h++) {
            for (let m = 0; m < blocksPerHour_Header; m++) {
                const minuteBlock = document.createElement('div');
                minuteBlock.classList.add('minute-block');
                minuteBlock.textContent = minutes[m];
                if (m === 3) { minuteBlock.classList.add('half-hour'); }
                minuteRow.appendChild(minuteBlock);
            }
        }

        // --- 3. タイムライン本体（5分グリッド）の生成 ---
        const timelineRows = timelineBody.querySelectorAll('.timeline-row');
        const totalCells = totalHours * blocksPerHour_Body;

        timelineRows.forEach(row => {
            row.innerHTML = ''; // グリッドをクリア
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                if ((i + 1) % 12 === 0) { cell.classList.add('hour-line'); }
                else if ((i + 1) % 6 === 0) { cell.classList.add('half-hour-line'); }
                else if ((i + 1) % 2 === 0) { cell.classList.add('ten-min-line'); }
                row.appendChild(cell);
            }
        });
        
        // --- 4. ヘッダーの高さ調整 ---
        if (namesHeaderSpacer) {
            namesHeaderSpacer.style.height = "48.5px";
        }
    }

    // ----------------------------------------
    // 関数: 画面全体を更新
    // ----------------------------------------
    function updateDisplay() {
        renderMainArea(); // renderWardから変更
        createTimeline(currentShiftStartHour);
    }

    // ----------------------------------------
    // イベントリスナーの設定
    // ----------------------------------------
    btnNurseBoard.addEventListener('click', () => {
        currentViewMode = 'nurse';
        btnNurseBoard.classList.add('active');
        btnBedBoard.classList.remove('active');
        updateDisplay();
    });

    btnBedBoard.addEventListener('click', () => {
        currentViewMode = 'bed';
        btnBedBoard.classList.add('active');
        btnNurseBoard.classList.remove('active');
        updateDisplay();
    });

    btnNorth.addEventListener('click', () => {
        currentWard = 'north';
        btnNorth.classList.add('active');
        btnSouth.classList.remove('active');
        // ★病棟全体の見た目をクラスで制御するように変更
        northWardRow.classList.add('active');
        southWardRow.classList.remove('active');
        updateDisplay();
    });

    btnSouth.addEventListener('click', () => {
        currentWard = 'south';
        btnSouth.classList.add('active');
        btnNorth.classList.remove('active');
        // ★病棟全体の見た目をクラスで制御するように変更
        southWardRow.classList.add('active');
        northWardRow.classList.remove('active');
        updateDisplay();
    });

    btnAm.addEventListener('click', () => {
        currentShiftStartHour = 8;
        btnAm.classList.add('active');
        btnPm.classList.remove('active');
        createTimeline(currentShiftStartHour); // 時間軸のみ更新
    });

    btnPm.addEventListener('click', () => {
        currentShiftStartHour = 13;
        btnPm.classList.add('active');
        btnAm.classList.remove('active');
        createTimeline(currentShiftStartHour); // 時間軸のみ更新
    });

    // ★人数入力が変更されたら再描画
    countNorthInput.addEventListener('input', () => {
        // ★北病棟の人数が変わったら、どちらの病棟を表示していても全体を更新する
        updateDisplay();
    });
    countSouthInput.addEventListener('input', () => {
        if (currentWard === 'south') {
            updateDisplay();
        }
    });


    // ----------------------------------------
    // 初期描画
    // ----------------------------------------
    initializeBedDisplays(); // ★ベッド表示を初期化
    updateDisplay();
    initializeCareTabs(); // ★ケアリストのタブを初期化
    renderCareList(currentCareCategory); // ★ケアリストの初期描画

    // ★初期の病棟選択状態をスタイルに反映
    northWardRow.classList.add('active');
});