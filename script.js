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

    // ★モーダル関連の要素を取得
    const modalOverlay = document.getElementById('modal-overlay');
    const modalTaskName = document.getElementById('modal-task-name');
    const modalStartTime = document.getElementById('modal-start-time');
    const modalNurseList = document.getElementById('modal-nurse-list');
    const modalBedSelect = document.getElementById('modal-bed-select');
    const taskForm = document.getElementById('task-form');
    const modalCancelBtn = document.getElementById('modal-cancel-btn');
    const modalDeleteBtn = document.getElementById('modal-delete-btn');
    const timelineArea = document.querySelector('.timeline-area');
    const heatmapTimeInput = document.getElementById('heatmap-time');
    const trashCan = document.getElementById('trash-can');


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

    // ★配置済みタスクを管理する配列
    let placedTasks = [];

    // ★モーダルで設定中のタスク情報を一時的に保持する変数
    let tempTaskDataForModal = null;

    // ★編集中のタスクIDを保持する変数
    let editingTaskId = null;

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
                // ★背景グリッド用のコンテナを追加
                const gridContainer = document.createElement('div');
                gridContainer.classList.add('grid-container');
                timelineRow.appendChild(gridContainer);

                timelineRow.id = `nurse${index + 1}-row${i}`;
                rowGroup.appendChild(timelineRow);

                // --- ▼▼▼ ドラッグ＆ドロップのイベントリスナーを追加 ▼▼▼ ---
                timelineRow.addEventListener('dragover', (e) => {
                    e.preventDefault(); // ドロップを許可するために必須
                });

                timelineRow.addEventListener('drop', (e) => handleDropOnTimeline(e, timelineRow));
                // --- ▲▲▲ ドラッグ＆ドロップのイベントリスナーを追加 ▲▲▲ ---
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
            // ★背景グリッド用のコンテナを追加
            const gridContainer = document.createElement('div');
            gridContainer.classList.add('grid-container');
            timelineRow.appendChild(gridContainer);

            timelineRow.id = `bed${name}-row1`;
            rowGroup.appendChild(timelineRow);

            // --- ▼▼▼ ドラッグ＆ドロップのイベントリスナーを追加 ▼▼▼ ---
            timelineRow.addEventListener('dragover', (e) => {
                e.preventDefault(); // ドロップを許可するために必須
            });

            timelineRow.addEventListener('drop', (e) => handleDropOnTimeline(e, timelineRow));
            // --- ▲▲▲ ドラッグ＆ドロップのイベントリスナーを追加 ▲▲▲ ---
            
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
            itemEl.draggable = true; // ★ドラッグ可能にする

            itemEl.innerHTML = `
                <div class="care-item-name">${task.name}</div>
                <div class="care-item-staff">${task.staff}人</div>
                <div class="care-item-time">${task.time * 5}分</div>
            `;

            // ★ドラッグ開始時のイベント
            itemEl.addEventListener('dragstart', (e) => {
                // ドラッグするデータをJSON形式でセット
                e.dataTransfer.setData('text/plain', JSON.stringify({
                    name: task.name,
                    staff: task.staff,
                    time: task.time, // 5分単位のブロック数
                    category: category
                }));
            });

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
    // ★関数: タイムラインへのドロップを処理
    // ----------------------------------------
    function handleDropOnTimeline(e, timelineRow) {
        e.preventDefault();
        const taskData = JSON.parse(e.dataTransfer.getData('text/plain'));

        // 1. タイムラインの左端の座標を取得
        // getBoundingClientRect()はビューポートに対する要素の位置情報を返す
        const timelineRect = timelineBody.getBoundingClientRect();
        const timelineLeft = timelineRect.left;

        // 2. ドロップされたX座標（timelineBody内での相対座標）を計算
        const dropX = e.clientX - timelineLeft;

        // 3. 5分ブロックの幅を取得 (CSS変数から)
        const fiveMinBlockWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--col-width-5min'));

        // 4. 何ブロック目にドロップされたかを計算 (小数点以下は切り捨て)
        const blockIndex = Math.floor(dropX / fiveMinBlockWidth);

        // 5. シフト開始からの経過分数を計算
        const minutesFromStart = blockIndex * 5;

        // 6. 開始時刻を計算
        const startTime = new Date(); // 今日の日付を基準にする
        startTime.setHours(currentShiftStartHour, 0, 0, 0); // 今日の日付で、シフト開始時刻に設定
        startTime.setMinutes(startTime.getMinutes() + minutesFromStart); // 経過分数を加算

        // 7. 結果をコンソールに出力
        // console.log('ドロップされたタスク:', taskData);
        // console.log('ドロップされた行:', timelineRow.id);
        // console.log('計算された開始時刻:', startTime.toLocaleTimeString('it-IT')); // "HH:mm:ss" 形式で表示

        // 8. ★モーダルを開く
        openTaskModal(taskData, startTime, timelineRow.id);
    }

    // ----------------------------------------
    // ★関数: タスク設定モーダルを開く
    // ----------------------------------------
    function openTaskModal(taskData, startTime, droppedRowId) {
        // ★★★ 新規作成時のみ、編集モードをリセットし、タスク情報を一時保存する ★★★
        if (!editingTaskId) {
            document.querySelector('#task-modal h2').textContent = "タスク詳細設定"; // タイトルを戻す
            // 後で使うために、ドラッグしてきたタスク情報を一時保存
            modalDeleteBtn.style.display = 'none'; // ★新規作成時は削除ボタンを隠す
            tempTaskDataForModal = taskData;
        }

        // モーダルにタスク名と開始時刻を設定
        modalTaskName.textContent = taskData.name;
        // ★★★ 5分単位に丸めてからHH:mm 形式にフォーマット ★★★
        const roundedMinutes = Math.round(startTime.getMinutes() / 5) * 5;
        const roundedStartTime = new Date(startTime);
        roundedStartTime.setMinutes(roundedMinutes);

        modalStartTime.value = `${String(roundedStartTime.getHours()).padStart(2, '0')}:${String(roundedStartTime.getMinutes()).padStart(2, '0')}`;

        // --- ▼▼▼ ドロップされた対象を特定する処理を追加 ▼▼▼ ---
        let droppedNurseName = null;
        let droppedBedName = null;

        if (droppedRowId.startsWith('nurse')) {
            // 'nurse1-row1' のようなIDから看護師のインデックスを取得
            const match = droppedRowId.match(/nurse(\d+)/);
            const nurseIndex = match ? parseInt(match[1], 10) - 1 : -1;
            // 対応する看護師名を取得（後続の処理で生成されるnurseListを仮定）
            const tempNurseList = (currentWard === 'north') ? generateNurseList(parseInt(countNorthInput.value, 10), 1, '北') : generateNurseList(parseInt(countSouthInput.value, 10), parseInt(countNorthInput.value, 10), '南');
            if (nurseIndex >= 0 && nurseIndex < tempNurseList.length) {
                droppedNurseName = tempNurseList[nurseIndex];
            }
        } else if (droppedRowId.startsWith('bed')) {
            // 'bedA-row1' のようなIDからベッド名を取得
            const match = droppedRowId.match(/bed(.+)-row1/);
            if (match) {
                droppedBedName = match[1];
            }
        }

        // --- ▼▼▼ 看護師リストとベッドリストを動的に生成する処理を追加 ▼▼▼ ---

        // 1. いったん中身を空にする
        modalNurseList.innerHTML = '';
        modalBedSelect.innerHTML = '';

        // 2. 現在の病棟の看護師リストを取得してチェックボックスを生成
        const northCount = parseInt(countNorthInput.value, 10);
        const southCount = parseInt(countSouthInput.value, 10);
        let nurseList;
        if (currentWard === 'north') {
            nurseList = generateNurseList(northCount, 1, '北');
        } else {
            const southStartNumber = northCount;
            nurseList = generateNurseList(southCount, southStartNumber, '南');
        }

        nurseList.forEach((nurseName, index) => {
            const nurseId = `modal-nurse-${index}`;
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('modal-checkbox-item'); // ★スタイル適用のためクラス追加
            const isChecked = (nurseName === droppedNurseName) ? 'checked' : ''; // ★ドロップされた看護師か判定
            itemDiv.innerHTML = `
                <input type="checkbox" id="${nurseId}" name="nurses" value="${nurseName}" ${isChecked}>
                <label for="${nurseId}">${nurseName}</label>
            `;
            modalNurseList.appendChild(itemDiv);
        });

        // 3. 現在の病棟のベッドリストを取得してドロップダウンを生成
        const bedConfig = beds[currentWard];
        const bedList = generateBedList(bedConfig);
        // 南病棟の場合はリストを逆順にする
        if (currentWard === 'south') {
            bedList.reverse();
        }

        bedList.forEach(bedName => {
            const option = document.createElement('option');
            option.value = bedName;
            option.textContent = bedName;
            modalBedSelect.appendChild(option);
        });

        // ★ドロップされたベッドがあれば、それを選択状態にする
        if (droppedBedName) {
            modalBedSelect.value = droppedBedName;
        }
        // --- ▲▲▲ ここまでの処理を修正・追加 ▲▲▲ ---

        // モーダルを表示
        modalOverlay.classList.remove('modal-hidden');
    }

    // ----------------------------------------
    // ★関数: タスク設定モーダルを閉じる
    // ----------------------------------------
    function closeTaskModal() {
        modalOverlay.classList.add('modal-hidden');
        // フォームの内容をリセット（次回開いたときのために）
        editingTaskId = null; // 編集モードを解除
        tempTaskDataForModal = null;
        taskForm.reset();
        modalNurseList.innerHTML = '';
        modalBedSelect.innerHTML = '';
    }

    // ----------------------------------------
    // ★イベントリスナー: モーダルの操作
    // ----------------------------------------
    // キャンセルボタン
    modalCancelBtn.addEventListener('click', closeTaskModal);

    // オーバーレイ（背景）クリックでも閉じる
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) {
            closeTaskModal();
        }
    });

    // ★モーダル内の削除ボタンのイベントリスナー
    modalDeleteBtn.addEventListener('click', () => {
        if (!editingTaskId) return; // 編集モードでなければ何もしない

        if (confirm('このタスクを本当に削除しますか？')) {
            const taskIndex = placedTasks.findIndex(t => t.id === editingTaskId);
            if (taskIndex > -1) {
                placedTasks.splice(taskIndex, 1); // 配列からタスクを削除
                renderAllTasks(); // 画面を再描画
                closeTaskModal(); // モーダルを閉じる
            }
        }
    });


    // フォーム送信（決定ボタン）
    taskForm.addEventListener('submit', (e) => {
        e.preventDefault(); // ページの再読み込みを防ぐ

        // ★編集モードか新規作成モードかを判定
        if (editingTaskId) {
            updateTask();
        } else {
            createNewTask();
        }
    });

    // --- ▼▼▼ ゴミ箱のドラッグ＆ドロップ処理を追加 ▼▼▼ ---
    trashCan.addEventListener('dragover', (e) => {
        e.preventDefault(); // ドロップを許可
        // text/task-idを持っている場合のみ反応する
        if (Array.from(e.dataTransfer.types).includes('text/task-id')) {
            trashCan.classList.add('drag-over');
        }
    });

    trashCan.addEventListener('dragleave', () => {
        trashCan.classList.remove('drag-over');
    });

    trashCan.addEventListener('drop', (e) => {
        e.preventDefault();
        trashCan.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/task-id');
        const taskIndex = placedTasks.findIndex(t => t.id === taskId);
        if (taskIndex > -1) {
            placedTasks.splice(taskIndex, 1);
            renderAllTasks();
        }
    });
    // --- ▲▲▲ ゴミ箱の処理を追加 ▲▲▲ ---

    // ----------------------------------------
    // ★関数: タスクの重複をチェックする
    // ----------------------------------------
    function isOverlapping(taskA, taskB) {
        return taskA.startTime < taskB.endTime && taskA.endTime > taskB.startTime;
    }

    // ----------------------------------------
    // ★関数: タスクの配置場所（行）を決定する
    // ----------------------------------------
    function findPlacement(taskToPlace) {
        // ★★★ 1. ベッドの重複チェックを追加 ★★★
        const tasksOnSameBed = placedTasks.filter(t =>
            t.id !== taskToPlace.id && // 編集中のタスク自身は除外
            t.assignedBed === taskToPlace.assignedBed
        );
        const bedHasOverlap = tasksOnSameBed.some(existingTask => isOverlapping(taskToPlace, existingTask));
        if (bedHasOverlap) {
            // ベッドが重複している場合は、エラーを示すオブジェクトを返す
            return { error: 'bed' };
        }

        // ★★★ 2. 看護師の重複チェック（既存のロジック） ★★★
        const displayRows = {};
        for (const nurseName of taskToPlace.assignedNurses) {
            let placed = false;
            for (let row = 1; row <= 3; row++) {
                const tasksOnRow = placedTasks.filter(t =>
                    t.id !== taskToPlace.id && // 編集中のタスク自身は除外
                    t.assignedNurses.includes(nurseName) &&
                    t.displayRows[nurseName] === row
                );
                const hasOverlap = tasksOnRow.some(existingTask => isOverlapping(taskToPlace, existingTask));
                if (!hasOverlap) {
                    displayRows[nurseName] = row;
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                return { error: 'nurse' }; // 3行とも埋まっていたらエラーオブジェクトを返す
            }
        }
        return { displayRows: displayRows }; // 成功
    }

    // ----------------------------------------
    // ★関数: 配置済みのすべてのタスクをタイムラインに描画 (この関数が抜けていました)
    // ----------------------------------------
    function renderAllTasks() {
        // 1. 既存のタスクブロックをすべて削除
        document.querySelectorAll('.task-block').forEach(el => el.remove());

        // 2. 5分ブロックの幅を取得
        const fiveMinBlockWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--col-width-5min'));

        // 3. 現在のシフトの開始時刻と終了時刻をDateオブジェクトで定義
        const shiftStart = new Date();
        shiftStart.setHours(currentShiftStartHour, 0, 0, 0);
        const shiftEnd = new Date(shiftStart.getTime() + totalHours * 60 * 60000);

        // 4. 配置済みタスクをループして描画
        placedTasks.forEach(task => {
            // タスクが現在のシフト時間外ならスキップ
            if (task.endTime <= shiftStart || task.startTime >= shiftEnd) {
                return;
            }

            // 5. タスクの描画位置（左端からのオフセット）と幅を計算
            const offsetMinutes = (task.startTime - shiftStart) / 60000;
            const left = (offsetMinutes / 5) * fiveMinBlockWidth;
            const width = (task.duration / 5) * fiveMinBlockWidth;

            // 6. 現在のビューモードに応じて描画対象の行を探す
            if (currentViewMode === 'nurse') {
                // 看護師ボードの場合
                const northCount = parseInt(countNorthInput.value, 10);
                const southCount = parseInt(countSouthInput.value, 10);
                const currentNurseList = (currentWard === 'north') ? generateNurseList(northCount, 1, '北') : generateNurseList(southCount, northCount, '南');
                const nurseRowGroups = timelineBody.querySelectorAll('.nurse-row-group');

                task.assignedNurses.forEach(nurseName => {
                    const nurseIndex = currentNurseList.indexOf(nurseName);
                    if (nurseIndex !== -1 && nurseRowGroups[nurseIndex]) {
                        const targetRowGroup = nurseRowGroups[nurseIndex];
                        const displayRowIndex = task.displayRows[nurseName] - 1;
                        if (displayRowIndex === undefined || displayRowIndex < 0) return;
                        const targetRow = targetRowGroup.querySelectorAll('.timeline-row')[displayRowIndex];
                        if (targetRow) createTaskElement(task, targetRow, left, width);
                    }
                });
            } else { // ベッドボードの場合
                const targetRow = document.getElementById(`bed${task.assignedBed}-row1`);
                if (targetRow) createTaskElement(task, targetRow, left, width);
            }
        });
    }

    // ----------------------------------------
    // ★関数: 新しいタスクを作成する
    // ----------------------------------------
    function createNewTask() {
        // 1. モーダルから情報を収集
        const selectedNurseElements = modalNurseList.querySelectorAll('input[name="nurses"]:checked');
        const assignedNurses = Array.from(selectedNurseElements).map(el => el.value);
        const assignedBed = modalBedSelect.value;
        const [hour, minute] = modalStartTime.value.split(':');

        // ★★★ 人数チェックのロジックを追加 ★★★
        const requiredStaff = tempTaskDataForModal.staff;
        const selectedStaff = assignedNurses.length;
        if (requiredStaff !== selectedStaff) {
            alert(`このタスクには ${requiredStaff} 人の看護師が必要です。\n現在 ${selectedStaff} 人選択されています。`);
            return; // 人数が合わない場合は処理を中断
        }

        // 2. 開始時刻と終了時刻をDateオブジェクトとして生成
        const startTime = new Date();
        startTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);

        const durationMinutes = tempTaskDataForModal.time * 5;
        const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

        // 3. 新しいタスクオブジェクトを作成
        const newTask = {
            id: `task_${Date.now()}`, // ユニークID
            name: tempTaskDataForModal.name,
            category: tempTaskDataForModal.category,
            startTime: startTime,
            endTime: endTime,
            duration: durationMinutes,
            assignedNurses: assignedNurses,
            assignedBed: assignedBed,
            displayRows: {} // この時点では空
        };

        // ★★★ 4. 配置場所を探す（重複チェック） ★★★
        const placementResult = findPlacement(newTask);
        if (placementResult.error) {
            if (placementResult.error === 'bed') {
                alert(`タスクを配置できません。ベッド「${newTask.assignedBed}」のスケジュールが重複しています。`);
            } else {
                alert('タスクを配置できません。担当看護師のスケジュールが重複しています。');
            }
            return;
        }

        newTask.displayRows = placementResult.displayRows;

        // 5. タスクをデータストアに追加し、再描画
        placedTasks.push(newTask);
        renderAllTasks();
        closeTaskModal();
    }

    // ----------------------------------------
    // ★関数: タスク要素を生成してDOMに追加
    // ----------------------------------------
    function createTaskElement(task, parentRow, left, width) {
        const taskEl = document.createElement('div');
        taskEl.className = 'task-block';
        taskEl.dataset.taskId = task.id;
        taskEl.dataset.category = task.category;
        taskEl.style.left = `${left}px`;
        taskEl.style.width = `${width}px`;
        taskEl.textContent = task.name;

        // ★タスクブロックをドラッグ可能にする
        taskEl.draggable = true;
        taskEl.addEventListener('dragstart', (e) => {
            // ゴミ箱へのドロップ用にタスクIDをセット
            e.dataTransfer.setData('text/task-id', task.id);
            e.stopPropagation(); // ケアリストからのドラッグと区別
        });

        // --- ▼▼▼ クリックイベントを追加して編集機能を持たせる ▼▼▼ ---
        taskEl.addEventListener('click', (e) => {
            // 1. 編集対象のタスク情報を取得
            const taskToEdit = placedTasks.find(t => t.id === task.id);
            if (!taskToEdit) return;

            // 2. モーダルを「編集モード」で開く
            editingTaskId = taskToEdit.id; // 編集モードに設定
            // staffプロパティが保存されていないため、元のタスク定義から取得し直す
            const originalTaskDefinition = careTasks[taskToEdit.category]?.items.find(item => item.name === taskToEdit.name);
            tempTaskDataForModal = { ...taskToEdit, staff: originalTaskDefinition ? originalTaskDefinition.staff : 1 };

            // 3. モーダルの内容をタスク情報で埋める
            document.querySelector('#task-modal h2').textContent = "タスク編集"; // タイトル変更
            modalDeleteBtn.style.display = 'inline-block'; // ★編集時は削除ボタンを表示
            openTaskModal(taskToEdit, taskToEdit.startTime, ''); // openTaskModalを再利用

            // 4. openTaskModalの後の追加処理
            //    担当看護師のチェックボックスを復元
            const nurseCheckboxes = modalNurseList.querySelectorAll('input[name="nurses"]');
            nurseCheckboxes.forEach(checkbox => {
                checkbox.checked = taskToEdit.assignedNurses.includes(checkbox.value);
            });
            //    担当ベッドを復元
            modalBedSelect.value = taskToEdit.assignedBed;
        });
        // --- ▲▲▲ イベントを追加 ▲▲▲ ---

        parentRow.appendChild(taskEl);
    }

    // ----------------------------------------
    // ★関数: 既存のタスクを更新する
    // ----------------------------------------
    function updateTask() {
        const taskIndex = placedTasks.findIndex(t => t.id === editingTaskId);
        if (taskIndex === -1) return;

        // 1. モーダルから情報を収集
        const selectedNurseElements = modalNurseList.querySelectorAll('input[name="nurses"]:checked');
        const assignedNurses = Array.from(selectedNurseElements).map(el => el.value);
        const assignedBed = modalBedSelect.value;
        const [hour, minute] = modalStartTime.value.split(':');

        // ★★★ 人数チェック ★★★
        const requiredStaff = tempTaskDataForModal.staff;
        if (requiredStaff && requiredStaff !== assignedNurses.length) {
            alert(`このタスクには ${requiredStaff} 人の看護師が必要です。\n現在 ${assignedNurses.length} 人選択されています。`);
            return;
        }

        // 2. 更新後のタスク情報で仮オブジェクトを作成
        const taskToUpdate = { ...placedTasks[taskIndex] }; // コピーを作成
        taskToUpdate.startTime.setHours(parseInt(hour, 10), parseInt(minute, 10));
        taskToUpdate.endTime = new Date(taskToUpdate.startTime.getTime() + taskToUpdate.duration * 60000);
        taskToUpdate.assignedNurses = assignedNurses;
        taskToUpdate.assignedBed = assignedBed;

        // ★★★ 3. 配置場所を探す（重複チェック） ★★★
        const placementResult = findPlacement(taskToUpdate);
        if (placementResult.error) {
            if (placementResult.error === 'bed') {
                alert(`タスクを配置できません。ベッド「${taskToUpdate.assignedBed}」のスケジュールが重複しています。`);
            } else {
                alert('タスクを配置できません。担当看護師のスケジュールが重複しています。');
            }
            return;
        }
        taskToUpdate.displayRows = placementResult.displayRows;

        // 4. 元のタスクを更新し、再描画
        placedTasks[taskIndex] = taskToUpdate;
        renderAllTasks();
        closeTaskModal();
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

        // ★ボード描画後に、配置済みタスクも描画する
        renderAllTasks();
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
        const gridContainers = timelineBody.querySelectorAll('.grid-container');
        const totalCells = totalHours * blocksPerHour_Body;

        gridContainers.forEach(container => {
            container.innerHTML = ''; // グリッドをクリア
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                if ((i + 1) % 12 === 0) { cell.classList.add('hour-line'); } // 1時間ごとの線
                else if ((i + 1) % 6 === 0) { cell.classList.add('half-hour-line'); } // 30分ごとの線
                else if ((i + 1) % 2 === 0) { cell.classList.add('ten-min-line'); } // 10分ごとの線
                container.appendChild(cell);
            }
        });
        
        // --- 4. ヘッダーの高さ調整 (CSSで一元管理するため不要に) ---
        if (namesHeaderSpacer) {
            // namesHeaderSpacer.style.height = "48.5px";
        }
    }

    // ----------------------------------------
    // 関数: 画面全体を更新
    // ----------------------------------------
    function updateDisplay() {
        renderMainArea(); // renderWardから変更
        createTimeline(currentShiftStartHour);
        timelineArea.scrollLeft = 0; // スクロール位置をリセット
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
        createTimeline(currentShiftStartHour);
        renderAllTasks();
    });

    btnPm.addEventListener('click', () => {
        currentShiftStartHour = 13;
        btnPm.classList.add('active');
        btnAm.classList.remove('active');
        createTimeline(currentShiftStartHour);
        renderAllTasks();
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

    // ★ヒートマップの時刻が変更されたら5分単位に丸める
    heatmapTimeInput.addEventListener('change', () => {
        const [hour, minute] = heatmapTimeInput.value.split(':').map(Number);
        const roundedMinute = Math.round(minute / 5) * 5;
        
        const newDate = new Date();
        newDate.setHours(hour, roundedMinute, 0, 0);

        heatmapTimeInput.value = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
        // TODO: ここでヒートマップを更新する関数を呼び出す
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