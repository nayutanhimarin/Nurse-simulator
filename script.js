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

    // ----------------------------------------
    // 状態管理
    // ----------------------------------------
    let currentViewMode = 'nurse'; // 'nurse' or 'bed'
    let currentWard = 'north';
    let currentShiftStartHour = 8;

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
        updateDisplay();
    });

    btnSouth.addEventListener('click', () => {
        currentWard = 'south';
        btnSouth.classList.add('active');
        btnNorth.classList.remove('active');
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
    updateDisplay();

});