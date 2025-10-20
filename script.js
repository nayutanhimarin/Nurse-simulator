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
    const patientSummaryArea = document.querySelector('.patient-summary-area');
    const patientSummaryHeader = document.querySelector('.patient-summary-header');
    
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
    const btnUpdateHeatmap = document.getElementById('btn-update-heatmap'); // ★ヒートマップ表示ボタン
    const trashCan = document.getElementById('trash-can');

    // ★ケアセット関連の要素
    const careSetContainer = document.getElementById('care-set-container');
    const careSetDeptSelect = document.getElementById('care-set-dept-select');
    const careSetSummarySelect = document.getElementById('care-set-summary-select');
    const careSetAmList = document.getElementById('care-set-am-list');
    const careSetPmList = document.getElementById('care-set-pm-list');
    // ★ケアセットの操作ボタン
    const btnNewCareSet = document.getElementById('btn-new-careset');
    const btnEditCareSet = document.getElementById('btn-edit-careset');
    const btnSaveCareSet = document.getElementById('btn-save-careset');
    const btnDeleteCareSet = document.getElementById('btn-delete-careset');


    // 患者情報モーダル要素
    const patientModalOverlay = document.getElementById('patient-modal-overlay');
    const patientModalTitle = document.getElementById('patient-modal-title');
    const patientForm = document.getElementById('patient-form');
    const patientModalCancelBtn = document.getElementById('patient-modal-cancel');
    const patientIsEmpty = document.getElementById('patient-is-empty');
    const patientDept = document.getElementById('patient-dept');
    const patientSeverity = document.getElementById('patient-severity');
    const patientSummary = document.getElementById('patient-summary');
    const patientVent = document.getElementById('patient-vent');
    const patientPurification = document.getElementById('patient-purification');
    const patientAssist = document.getElementById('patient-assist');
    const patientDelirium = document.getElementById('patient-delirium');
    const patientMobility = document.getElementById('patient-mobility');
    const patientDischargePlan = document.getElementById('patient-discharge-plan');
    const patientDischargeTime = document.getElementById('patient-discharge-time');
    const patientAdmissionPlan = document.getElementById('patient-admission-plan');
    const patientAdmissionTime = document.getElementById('patient-admission-time');
    // ★患者概要の新しい要素
    const patientSummarySelect = document.getElementById('patient-summary-select');
    const patientSummaryText = document.getElementById('patient-summary-text');

    // 看護師設定モーダル要素
    const nurseModalOverlay = document.getElementById('nurse-modal-overlay');
    const nurseModalTitle = document.getElementById('nurse-modal-title');
    const nurseForm = document.getElementById('nurse-form');
    const nurseModalCancelBtn = document.getElementById('nurse-modal-cancel');
    const nurseLevelSelect = document.getElementById('nurse-level');
    const nurseBedList = document.getElementById('nurse-bed-list');

    // シナリオ管理要素
    const scenarioSelect = document.getElementById('scenario-select');
    const scenarioNameInput = document.getElementById('scenario-name');
    const btnSaveScenario = document.getElementById('btn-save-scenario');
    const btnDeleteScenario = document.getElementById('btn-delete-scenario');


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

    // ★科と患者概要のデータを追加
    const departmentSummaries = {
        '呼外': ['VATS'],
        '心外': ['開胸術後', 'TEVAR/EVAR'],
        '脳外': ['SAH', '血栓回収', '脳腫瘍'],
        '肝外': ['肝移植', 'PD/肝切'],
        '消外': ['食道', 'パンペリ'],
        '泌尿器': ['腎移植', 'RARC'],
        '産婦': ['子宮体癌/卵巣癌', '産科緊急'],
        '脊外': ['TES'],
        '救急': ['中毒', '外傷', '熱傷'],
        '循内': ['AMI', 'TAVI/Mitra clip', '心不全', '心原性ショック'],
        '消内': ['消化管出血', '肝不全', '敗血症性ショック', '膵炎'],
        '他内科': ['敗血症性ショック'],
        '皮膚科/形成外科': ['壊死性筋膜炎', '熱傷'],
        'その他': [],
        '小児/小児外科': ['<1歳', '1-3歳', '4-6歳', '7歳以上'],
        '小児心外': ['<1歳', '1-3歳', '4-6歳', '7歳以上'],
    };
    const OTHER_SUMMARY_OPTION = 'その他（自由記述）';

    // ★★★ ケアセットの定義を追加 ★★★
    const careSets = {
        '心外': {
            '開胸術後': {
                am: [
                    { name: '検温', startTime: '08:30' },
                    { name: '清拭2', startTime: '10:00' },
                    { name: 'リハビリ2', startTime: '11:00' },
                ],
                pm: [
                    { name: '体位交換(挿管)', startTime: '14:00' },
                    { name: '口腔ケア(挿管)', startTime: '15:00' },
                ]
            }
        }
        // 他の科、他の概要のセットもここに追加していく
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

    // ★患者情報をベッドごとに管理
    let patientData = {};

    // ★患者情報編集中に対象のベッドIDを保持
    let editingBedId = null;

    // ★看護師ごとの設定を管理
    let nurseSettings = {};

    // ★看護師設定編集中に対象の看護師名を保持
    let editingNurseName = null;

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
            bedBox.addEventListener('click', () => openPatientModal(bedName));
            southBedsDisplay.appendChild(bedBox);
        });

        // 北病棟ベッド (1 -> 10)
        const northBedList = generateBedList(beds.north);
        northBedList.forEach(bedName => {
            const bedBox = document.createElement('div');
            bedBox.classList.add('bed-box');
            bedBox.textContent = bedName;
            bedBox.addEventListener('click', () => openPatientModal(bedName));
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
            nameBlock.dataset.nurseName = name; // ★★★ 修正: data属性に純粋な看護師名を保存 ★★★
            nameBlock.textContent = name;
            
            // ★★★ 修正: 看護師レベルに応じたマークを追加 ★★★
            const settings = nurseSettings[name] || {};
            if (settings.level === '新人') {
                nameBlock.textContent = `🔰 ${name}`;
            } else if (settings.level === 'リーダー') {
                nameBlock.textContent = `👑 ${name}`;
            } else {
                nameBlock.textContent = name;
            }
            namesArea.appendChild(nameBlock);
            nameBlock.addEventListener('click', () => openNurseModal(name));

            // ★基本担当ベッド表示欄を追加
            const assignedBedBlock = document.createElement('div');
            assignedBedBlock.classList.add('nurse-assigned-beds-block');
            assignedBedBlock.id = `nurse-${name}-beds`;
            assignedBedBlock.textContent = nurseSettings[name]?.assignedBeds.join(', ') || '';
            patientSummaryArea.appendChild(assignedBedBlock);

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
            nameBlock.addEventListener('click', () => openPatientModal(name));
            namesArea.appendChild(nameBlock);

            // ★患者サマリー欄を追加
            const summaryBlock = document.createElement('div');
            summaryBlock.classList.add('patient-summary-block');
            summaryBlock.id = `bed${name}-summary`;
            patientSummaryArea.appendChild(summaryBlock);

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

        // ★★★ ドロップされたのが「既存タスク」か「新規タスク」かを判断 ★★★
        const taskId = e.dataTransfer.getData('text/task-id');
        if (taskId) {
            // 既存タスクの移動
            handleMoveTask(e, timelineRow, taskId);
        } else if (e.dataTransfer.getData('text/plain')) {
            // 新規タスクのドロップ
            handleNewTaskDrop(e, timelineRow);
        }
    }

    function handleNewTaskDrop(e, timelineRow) {
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

    function handleMoveTask(e, timelineRow, taskId) {
        const taskIndex = placedTasks.findIndex(t => t.id === taskId);
        if (taskIndex === -1) return;

        const originalTask = placedTasks[taskIndex];

        // 1. 新しい開始時刻を計算
        const timelineRect = timelineBody.getBoundingClientRect();
        const timelineLeft = timelineRect.left;
        const dropX = e.clientX - timelineLeft;
        const fiveMinBlockWidth = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--col-width-5min'));
        const blockIndex = Math.floor(dropX / fiveMinBlockWidth);
        const minutesFromStart = blockIndex * 5;
        const newStartTime = new Date();
        newStartTime.setHours(currentShiftStartHour, 0, 0, 0);
        newStartTime.setMinutes(newStartTime.getMinutes() + minutesFromStart);

        // 5分単位に丸める
        const roundedMinutes = Math.round(newStartTime.getMinutes() / 5) * 5;
        newStartTime.setMinutes(roundedMinutes);

        // 2. 更新後のタスク情報で仮オブジェクトを作成
        const updatedTask = { ...originalTask }; // コピーを作成
        updatedTask.startTime = newStartTime;
        updatedTask.endTime = new Date(newStartTime.getTime() + originalTask.duration * 60000);

        // ★★★ 3. ドロップ先に応じて担当者/ベッドを更新 ★★★
        if (currentViewMode === 'nurse') {
            // 看護師ボード表示の場合
            const sourceNurseName = e.dataTransfer.getData('text/source-nurse');

            // ドロップ先の看護師名を取得
            const match = timelineRow.id.match(/nurse(\d+)/);
            const nurseIndex = match ? parseInt(match[1], 10) - 1 : -1;
            const northCount = parseInt(countNorthInput.value, 10);
            const tempNurseList = (currentWard === 'north') ? generateNurseList(northCount, 1, '北') : generateNurseList(parseInt(countSouthInput.value, 10), northCount, '南');
            const destinationNurseName = (nurseIndex >= 0) ? tempNurseList[nurseIndex] : null;

            if (sourceNurseName && destinationNurseName && sourceNurseName !== destinationNurseName) {
                // 担当者リストを更新（移動元の看護師を移動先の看護師に入れ替える）
                const nurseIndexInTask = updatedTask.assignedNurses.indexOf(sourceNurseName);
                if (nurseIndexInTask > -1) {
                    // 移動先の看護師が既にタスクに含まれているかチェック
                    if (updatedTask.assignedNurses.includes(destinationNurseName)) {
                        alert(`移動できません。${destinationNurseName}は既にこのタスクの担当者です。`);
                        return;
                    }
                    updatedTask.assignedNurses.splice(nurseIndexInTask, 1, destinationNurseName);
                }
            } else {
                // 同じ看護師の別の時間/行に移動した場合など
                // 担当者の変更はないので何もしない
            }

        } else if (currentViewMode === 'bed') {
            // ベッドボード表示の場合、ドロップ先のベッド名を取得して更新
            const match = timelineRow.id.match(/bed(.+)-row1/);
            if (match) {
                const newBedName = match[1];
                updatedTask.assignedBed = newBedName;
            }
        }


        // 4. 配置場所を探す（重複チェック）
        const placementResult = findPlacement(updatedTask);
        if (placementResult.error) {
            if (placementResult.error === 'bed') {
                alert(`移動できません。ベッド「${updatedTask.assignedBed}」のスケジュールが重複しています。`);
            } else {
                alert('移動できません。担当看護師のスケジュールが重複しています。');
            }
            return; // 重複がある場合は移動しない
        }
        updatedTask.displayRows = placementResult.displayRows;

        // 5. 元のタスクを更新し、再描画
        placedTasks[taskIndex] = updatedTask;
        renderAllTasks();
    }

    // ----------------------------------------
    // ★★★ 関数: ケアセットのドロップを処理 ★★★
    // ----------------------------------------
    function handleCareSetDrop(e, bedId) {
        e.preventDefault();
        const careSetDataJSON = e.dataTransfer.getData('application/json');
        if (!careSetDataJSON) return; // ケアセットのデータでなければ何もしない

        const { shift, tasks: taskSet } = JSON.parse(careSetDataJSON);

        // 1. 担当看護師を探す
        // このベッドを「基本担当ベッド」に設定している看護師を探す
        let assignedNurse = null;
        for (const nurseName in nurseSettings) {
            if (nurseSettings[nurseName].assignedBeds?.includes(bedId)) {
                assignedNurse = nurseName;
                break; // 1人見つけたらループを抜ける
            }
        }

        if (!assignedNurse) {
            alert(`ベッド ${bedId} の担当看護師が見つかりません。\n先に看護師設定で基本担当ベッドを割り当ててください。`);
            return;
        }

        // 2. セット内のタスクを一つずつ配置していく
        const addedTasks = [];
        for (const taskInfo of taskSet) {
            const originalTask = careTasks[taskInfo.category].items.find(t => t.name === taskInfo.name);
            if (!originalTask) continue;

            const [hour, minute] = taskInfo.startTime.split(':');
            const startTime = new Date();
            startTime.setHours(parseInt(hour, 10), parseInt(minute, 10), 0, 0);
            const durationMinutes = originalTask.time * 5;
            const endTime = new Date(startTime.getTime() + durationMinutes * 60000);

            // ★複数人必要なタスクでも、まず担当看護師1人を割り当てる
            const assignedNurses = [assignedNurse];

            const newTask = {
                id: `task_${Date.now()}_${Math.random()}`,
                name: originalTask.name,
                category: taskInfo.category,
                startTime,
                endTime,
                duration: durationMinutes,
                assignedNurses,
                assignedBed: bedId,
                displayRows: {},
                // ★人員不足フラグを追加
                isUnderstaffed: originalTask.staff > assignedNurses.length
            };

            // 重複チェック（簡易版：ここでは省略。厳密にはfindPlacementをここでも使う）
            // 実際には、ここで重複チェックを行い、配置できない場合はユーザーに通知するべき

            addedTasks.push(newTask);
        }

        // 3. 全てのタスクをまとめて追加
        placedTasks.push(...addedTasks);
        renderAllTasks();
        updateHeatmap();
    }

    // ----------------------------------------
    // ★★★ 関数: ケアセットプランナーを初期化・更新 ★★★
    // ----------------------------------------
    function initializeCareSetPlanner() {
        // 科の選択肢を作成
        careSetDeptSelect.innerHTML = '<option value="">科を選択...</option>';
        Object.keys(careSets).forEach(dept => {
            careSetDeptSelect.innerHTML += `<option value="${dept}">${dept}</option>`;
        });

        // イベントリスナー
        careSetDeptSelect.addEventListener('change', updateCareSetSummaryOptions);
        careSetSummarySelect.addEventListener('change', renderCareSet);

        // ドラッグ開始イベント
        document.getElementById('care-set-am').addEventListener('dragstart', (e) => handleCareSetDrag(e, 'am'));
        document.getElementById('care-set-pm').addEventListener('dragstart', (e) => handleCareSetDrag(e, 'pm'));
    }

    function updateCareSetSummaryOptions() {
        const selectedDept = careSetDeptSelect.value;
        careSetSummarySelect.innerHTML = '<option value="">患者概要を選択...</option>';
        if (selectedDept && careSets[selectedDept]) {
            Object.keys(careSets[selectedDept]).forEach(summary => {
                careSetSummarySelect.innerHTML += `<option value="${summary}">${summary}</option>`;
            });
        }
        renderCareSet(); // 概要の選択肢が変わったら表示もクリア
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
    // ★関数: 看護師設定モーダルを開く
    // ----------------------------------------
    function openNurseModal(nurseName) {
        editingNurseName = nurseName;
        nurseModalTitle.textContent = `${nurseName} - 設定`;

        // 既存データをフォームに反映
        const settings = nurseSettings[nurseName] || {};
        nurseLevelSelect.value = settings.level || '新人';

        // ベッドのチェックボックスを生成
        nurseBedList.innerHTML = '';
        const bedConfig = beds[currentWard];
        const bedList = generateBedList(bedConfig);
        bedList.forEach(bedId => {
            const isChecked = settings.assignedBeds?.includes(bedId) ? 'checked' : '';
            const itemDiv = document.createElement('div');
            itemDiv.classList.add('modal-checkbox-item');
            itemDiv.innerHTML = `
                <input type="checkbox" id="nurse-bed-${bedId}" name="nurse-beds" value="${bedId}" ${isChecked}>
                <label for="nurse-bed-${bedId}">${bedId}</label>
            `;
            nurseBedList.appendChild(itemDiv);
        });

        nurseModalOverlay.classList.remove('modal-hidden');
    }

    // ----------------------------------------
    // ★関数: 看護師設定モーダルを閉じる
    // ----------------------------------------
    function closeNurseModal() {
        nurseModalOverlay.classList.add('modal-hidden');
        nurseForm.reset();
        editingNurseName = null;
    }

    // ----------------------------------------
    // ★イベントリスナー: 看護師設定モーダル
    // ----------------------------------------
    nurseModalCancelBtn.addEventListener('click', closeNurseModal);
    nurseModalOverlay.addEventListener('click', (e) => {
        if (e.target === nurseModalOverlay) {
            closeNurseModal();
        }
    });

    nurseForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingNurseName) return;

        const selectedBeds = Array.from(nurseBedList.querySelectorAll('input:checked')).map(el => el.value);

        if (selectedBeds.length > 3) {
            alert('基本担当ベッドは3つまでしか選択できません。');
            return;
        }

        nurseSettings[editingNurseName] = {
            level: nurseLevelSelect.value,
            assignedBeds: selectedBeds
        };

        // 表示を更新
        const assignedBedBlock = document.getElementById(`nurse-${editingNurseName}-beds`);
        if (assignedBedBlock) {
            assignedBedBlock.textContent = selectedBeds.join(', ');
        }

        // ★★★ 修正: 看護師名の表示（マーク含む）も更新する ★★★
        const nurseNameBlocks = namesArea.querySelectorAll('.nurse-name-block');
        nurseNameBlocks.forEach(block => {
            // data-nurse-name 属性を使って、マークの有無に関わらず対象の要素を特定する
            if (block.dataset.nurseName === editingNurseName) {
                if (nurseLevelSelect.value === '新人') block.textContent = `🔰 ${editingNurseName}`;
                else if (nurseLevelSelect.value === 'リーダー') block.textContent = `👑 ${editingNurseName}`;
                else block.textContent = editingNurseName;
            }
        });

        // ★★★ 修正: 設定変更後にヒートマップを即時更新する ★★★
        updateHeatmap();

        closeNurseModal();
    });

    // ----------------------------------------
    // ★関数: ヒートマップを更新する
    // ----------------------------------------
    function updateHeatmap() {
        const [hour, minute] = heatmapTimeInput.value.split(':').map(Number);
        const targetTime = new Date();
        targetTime.setHours(hour, minute, 0, 0);
    
        const nurseNameBlocks = document.querySelectorAll('.nurse-name-block');
        nurseNameBlocks.forEach(block => {
            const nurseName = block.dataset.nurseName; // ★★★ 修正: data属性から純粋な名前を取得 ★★★

            // 1. 担当患者の重症度合計とせん妄の有無を計算
            let totalSeverity = 0;
            let patientCount = 0;
            let hasHighNeedsPatient = false; // ★せん妄 or 小児科系

            // ★★★ 修正: 全看護師の設定から担当ベッドを取得する ★★★
            // nurseSettingsは病棟に依存しないため、全データから直接参照する
            const settings = nurseSettings[nurseName];
            const assignedBeds = settings ? settings.assignedBeds : [];
            // const assignedBeds = nurseSettings[nurseName]?.assignedBeds || [];



    
            for (const bedId of assignedBeds) {
                const patient = patientData[bedId];
                // 空床でなく、データが存在する場合のみ計算
                if (patient && !patient.isEmpty) {
                    patientCount++;
                    totalSeverity += parseInt(patient.severity, 10);
                    // ★★★ 修正: せん妄 or 小児科系患者がいるかチェック ★★★
                    if (patient.delirium || patient.dept === '小児/小児外科' || patient.dept === '小児心外') {
                        hasHighNeedsPatient = true;
                    }
                }
            }
    
            // 2. 指定時刻のケア（タスク）数を計算
            const careCount = placedTasks.filter(task =>
                task.assignedNurses.includes(nurseName) &&
                task.startTime <= targetTime &&
                task.endTime > targetTime
            ).length;

            // ★★★ 3. 前後30分のタスク密度を計算 ★★★
            let densityBonus = 0;
            const windowStart = new Date(targetTime.getTime() - 30 * 60000);
            const windowEnd = new Date(targetTime.getTime() + 30 * 60000);

            const tasksInWindow = placedTasks.filter(task =>
                task.assignedNurses.includes(nurseName) &&
                task.startTime < windowEnd &&
                task.endTime > windowStart
            );

            if (tasksInWindow.length >= 2) {
                // 多忙ボーナス: 2つ以上のタスクがあればレベル+2
                densityBonus = 2;
            } else if (tasksInWindow.length > 0) {
                // 高密度ボーナス: 1つ以上のタスクがある場合、合計時間を計算
                let totalDurationInWindow = 0;
                tasksInWindow.forEach(task => {
                    const overlapStart = Math.max(task.startTime, windowStart);
                    const overlapEnd = Math.min(task.endTime, windowEnd);
                    totalDurationInWindow += (overlapEnd - overlapStart) / 60000; // 分に変換
                });
                if (totalDurationInWindow >= 55) {
                    densityBonus = 1;
                }
            }
    
            // 3. 新しいルールに基づいてヒートマップレベルを決定
            let level = 1; // デフォルトレベル

            // ★★★ 修正: せん妄患者担当時の特別ルールを最優先で判定 ★★★
            if (hasHighNeedsPatient && careCount === 0 && patientCount === 1) level = 3;
            else if (hasHighNeedsPatient && careCount === 0 && patientCount === 2) level = 4;

            // レベル5 (要応援)
            if ((totalSeverity >= 10 || hasHighNeedsPatient) && careCount >= 1) level = 5;
            else if (totalSeverity >= 8 && totalSeverity <= 9 && careCount >= 2) level = 5;
            else if (totalSeverity <= 7 && careCount >= 3) level = 5;
            // レベル4
            else if ((totalSeverity >= 10 || hasHighNeedsPatient) && careCount === 0) level = 4;
            // レベル3 (標準)
            else if (totalSeverity >= 8 && totalSeverity <= 9 && careCount === 1) level = 3;
            else if (totalSeverity >= 5 && totalSeverity <= 7 && careCount === 2) level = 3;
            // レベル2
            else if (totalSeverity >= 5 && totalSeverity <= 7 && careCount === 1) level = 2;
            else if (totalSeverity >= 1 && totalSeverity <= 4 && careCount === 2) level = 2;
            // レベル1 (応援可)
            else if (totalSeverity <= 7 && careCount === 0) level = 1;
            else if (totalSeverity >= 1 && totalSeverity <= 4 && careCount === 1) level = 1;
    
            // 4. レベルに応じた色を適用
            // ★★★ 密度ボーナスをレベルに加算（最大5） ★★★
            level = Math.min(level + densityBonus, 5);

            const colors = ['#e6f5e6', '#ffffcc', '#ffe6b3', '#ffcc99', '#ffb380']; // 1, 2, 3, 4, 5
            block.style.backgroundColor = colors[level - 1];
        });

        // ★★★ ベッドマップのヒートマップ処理を追加 ★★★
        const bedBoxes = document.querySelectorAll('.bed-box');
        bedBoxes.forEach(box => {
            const bedId = box.textContent;

            const patient = patientData[bedId] || {}; // ★ patientが存在しない場合も考慮
            if (patient.isEmpty) {
                box.style.backgroundColor = '#e0e0e0'; // 空床の色はここで設定
                return; // 空床なら以降の計算は不要
            }
            // ★★★ 修正: ヒートマップ計算時に通常色(#fff)にリセットしない ★★★
            const severity = parseInt(patient.severity, 10);
            // ★★★ 修正: せん妄 or 小児科系患者かチェック ★★★
            const isHighNeedsPatient = patient.delirium || patient.dept === '小児/小児外科' || patient.dept === '小児心外';

            const careCount = placedTasks.filter(task =>
                task.assignedBed === bedId &&
                task.startTime <= targetTime &&
                task.endTime > targetTime
            ).length;

            let level = 1; // デフォルト
            if ((severity === 5 && careCount >= 1) || (isHighNeedsPatient && careCount >= 1)) level = 5;
            else if ((severity === 4 && careCount >= 1) || (severity === 5 && careCount === 0) || (isHighNeedsPatient && careCount === 0)) level = 4;
            else if ((severity === 4 && careCount === 0) || (severity === 3 && careCount >= 1)) level = 3;
            else if ((severity === 3 && careCount === 0) || (severity === 2 && careCount >= 1)) level = 2;
            else if ((severity === 2 && careCount === 0) || severity === 1) level = 1;

            const colors = ['#e6f5e6', '#ffffcc', '#ffe6b3', '#ffcc99', '#ffb380']; // 1, 2, 3, 4, 5
            box.style.backgroundColor = colors[level - 1];
        });
    }
    
    // ----------------------------------------
    // ★関数: 患者情報モーダルを開く
    // ----------------------------------------
    function openPatientModal(bedId) {
        editingBedId = bedId;
        patientModalTitle.textContent = `ベッド ${bedId} - 情報編集`;

        // 既存のデータをフォームに反映
        const data = patientData[bedId] || {};
        patientIsEmpty.checked = data.isEmpty || false;
        patientDept.value = data.dept || Object.keys(departmentSummaries)[0]; // デフォルトはリストの先頭
        patientSeverity.value = data.severity || 1;
        patientVent.checked = data.vent || false;

        updateSummaryOptions(patientDept.value, data.summary); // ★患者概要の選択肢を更新

        patientPurification.checked = data.purification || false;
        patientAssist.checked = data.assist || false;
        patientDelirium.checked = data.delirium || false;
        patientMobility.value = data.mobility || '床上';
        patientDischargePlan.checked = data.dischargePlan || false;
        patientDischargeTime.value = data.dischargeTime || '';
        patientAdmissionPlan.checked = data.admissionPlan || false;
        patientAdmissionTime.value = data.admissionTime || '';

        // チェックボックスの状態に応じて時間入力の表示を切り替え
        patientDischargeTime.style.visibility = patientDischargePlan.checked ? 'visible' : 'hidden';
        patientAdmissionTime.style.visibility = patientAdmissionPlan.checked ? 'visible' : 'hidden';

        patientModalOverlay.classList.remove('modal-hidden');
    }

    // ----------------------------------------
    // ★関数: 患者情報モーダルを閉じる
    // ----------------------------------------
    function closePatientModal() {
        patientModalOverlay.classList.add('modal-hidden');
        patientForm.reset();
        editingBedId = null;
    }

    // ----------------------------------------
    // ★関数: 患者情報の表示を更新
    // ----------------------------------------
    function updatePatientDisplay(bedId) {
        const data = patientData[bedId] || {};
        
        // 1. ベッドボードのサマリー欄を更新
        const summaryBlock = document.getElementById(`bed${bedId}-summary`);
        if (summaryBlock) {
            if (data.isEmpty) {
                summaryBlock.textContent = '空床';
            } else {
                // ★概要と科を両方表示
                const deptText = data.dept ? `[${data.dept}] ` : '';
                const summaryText = data.summary || '';
                summaryBlock.textContent = `${deptText}${summaryText}`;
                summaryBlock.title = summaryBlock.textContent; // 全文をツールチップで表示
            }
        }

        // 2. 上部ベッドマップの表示を更新
        const allBedBoxes = document.querySelectorAll('.bed-box');
        allBedBoxes.forEach(box => {
            if (box.textContent === bedId) {
                box.style.backgroundColor = data.isEmpty ? '#e0e0e0' : '#fff';
                // ここで重症度に応じて色を変えるなどの処理も追加できる
            }
        });
    }

    // ----------------------------------------
    // ★イベントリスナー: 患者情報モーダル
    // ----------------------------------------
    patientModalCancelBtn.addEventListener('click', closePatientModal);
    patientModalOverlay.addEventListener('click', (e) => {
        if (e.target === patientModalOverlay) {
            closePatientModal();
        }
    });

    patientDischargePlan.addEventListener('change', () => {
        patientDischargeTime.style.visibility = patientDischargePlan.checked ? 'visible' : 'hidden';
    });
    patientAdmissionPlan.addEventListener('change', () => {
        patientAdmissionTime.style.visibility = patientAdmissionPlan.checked ? 'visible' : 'hidden';
    });

    // ★科が変更されたら、患者概要の選択肢を更新
    patientDept.addEventListener('change', () => {
        updateSummaryOptions(patientDept.value);
    });

    // ★患者概要の選択が変更されたら、自由記述欄の表示を切り替え
    patientSummarySelect.addEventListener('change', () => {
        patientSummaryText.style.display = (patientSummarySelect.value === OTHER_SUMMARY_OPTION) ? 'block' : 'none';
    });

    patientForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (!editingBedId) return;

        // ★患者概要の値を取得
        const summaryValue = (patientSummarySelect.value === OTHER_SUMMARY_OPTION) ? patientSummaryText.value : patientSummarySelect.value;

        // フォームからデータを収集して保存
        patientData[editingBedId] = {
            isEmpty: patientIsEmpty.checked,
            dept: patientDept.value,
            severity: patientSeverity.value,
            summary: summaryValue,
            vent: patientVent.checked,
            purification: patientPurification.checked,
            assist: patientAssist.checked,
            delirium: patientDelirium.checked,
            mobility: patientMobility.value,
            dischargePlan: patientDischargePlan.checked,
            dischargeTime: patientDischargeTime.value,
            admissionPlan: patientAdmissionPlan.checked,
            admissionTime: patientAdmissionTime.value,
        };

        updatePatientDisplay(editingBedId);
        closePatientModal();
    });

    // ----------------------------------------
    // ★関数: 患者概要の選択肢を更新する
    // ----------------------------------------
    function updateSummaryOptions(selectedDept, currentSummary = '') {
        patientSummarySelect.innerHTML = '';
        const summaries = departmentSummaries[selectedDept] || [];

        summaries.forEach(summary => {
            const option = document.createElement('option');
            option.value = summary;
            option.textContent = summary;
            patientSummarySelect.appendChild(option);
        });

        // 自由記述の選択肢を追加
        const otherOption = document.createElement('option');
        otherOption.value = OTHER_SUMMARY_OPTION;
        otherOption.textContent = OTHER_SUMMARY_OPTION;
        patientSummarySelect.appendChild(otherOption);

        // 既存データの復元
        const isPredefined = summaries.includes(currentSummary);
        patientSummarySelect.value = isPredefined ? currentSummary : OTHER_SUMMARY_OPTION;
        patientSummaryText.value = isPredefined ? '' : currentSummary;
        patientSummaryText.style.display = (patientSummarySelect.value === OTHER_SUMMARY_OPTION) ? 'block' : 'none';
    }

    // ----------------------------------------
    // ★★★ 関数: ケアセットのドラッグを開始 ★★★
    // ----------------------------------------
    function handleCareSetDrag(e, shift) {
        const selectedDept = careSetDeptSelect.value;
        const selectedSummary = careSetSummarySelect.value;

        if (!selectedDept || !selectedSummary) return;

        const taskSet = careSets[selectedDept]?.[selectedSummary]?.[shift];
        if (!taskSet) return;

        // カテゴリ情報を付与して送信
        const tasksWithCategory = taskSet.map(task => {
            for (const category in careTasks) {
                if (careTasks[category].items.some(item => item.name === task.name)) {
                    return { ...task, category };
                }
            }
            return task; // 見つからない場合
        });

        const dataToSend = {
            shift: shift,
            tasks: tasksWithCategory
        };

        e.dataTransfer.setData('application/json', JSON.stringify(dataToSend));
    }

    // ----------------------------------------
    // ★★★ 関数: 選択されたケアセットを表示 ★★★
    // ----------------------------------------
    function renderCareSet() {
        const selectedDept = careSetDeptSelect.value;
        const selectedSummary = careSetSummarySelect.value;
        const set = careSets[selectedDept]?.[selectedSummary];

        careSetAmList.innerHTML = set?.am.map(t => `<div>${t.startTime} ${t.name}</div>`).join('') || '（データなし）';
        careSetPmList.innerHTML = set?.pm.map(t => `<div>${t.startTime} ${t.name}</div>`).join('') || '（データなし）';
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
        taskEl.title = task.name; // ★ホバー時にフルネームをツールチップで表示

        // ★★★ 修正: 人員不足の場合に警告スタイルを適用 ★★★
        if (task.isUnderstaffed) {
            taskEl.classList.add('understaffed');
        }

        // ★タスクブロックをドラッグ可能にする
        taskEl.draggable = true;
        taskEl.addEventListener('dragstart', (e) => {
            // ★★★ 移動元情報をDataTransferにセット ★★★
            e.dataTransfer.setData('text/task-id', task.id);

            // 移動元の看護師を特定してセット
            if (currentViewMode === 'nurse') {
                const match = parentRow.id.match(/nurse(\d+)/);
                const nurseIndex = match ? parseInt(match[1], 10) - 1 : -1;
                const northCount = parseInt(countNorthInput.value, 10);
                const tempNurseList = (currentWard === 'north') ? generateNurseList(northCount, 1, '北') : generateNurseList(parseInt(countSouthInput.value, 10), northCount, '南');
                const sourceNurseName = (nurseIndex >= 0) ? tempNurseList[nurseIndex] : null;
                if(sourceNurseName) e.dataTransfer.setData('text/source-nurse', sourceNurseName);
            }
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
        patientSummaryArea.innerHTML = ''; // サマリーエリアをクリア
        patientSummaryArea.appendChild(patientSummaryHeader); // ヘッダーは再追加
        timelineBody.innerHTML = '';

        if (currentViewMode === 'nurse') {
            // ★看護師ボードでは患者概要列を非表示にし、名前列の幅を広げてタイムラインの位置を維持
            patientSummaryArea.style.display = 'block';
            patientSummaryHeader.textContent = '基本担当ベッド';
            namesArea.style.width = ''; // 元の幅に戻す
            renderNurseBoard(currentWard);
        } else {
            // ★ベッドボードでは両方の列を表示
            patientSummaryArea.style.display = 'block';
            patientSummaryHeader.textContent = '患者概要';
            namesArea.style.width = ''; // CSSで定義された元の幅に戻す
            renderBedBoard(currentWard);
            // ★ベッドボード表示の時だけケアセットプランナーを表示
            careSetContainer.classList.remove('care-set-container-hidden');
        }

        // ★ボード描画後に、配置済みタスクも描画する
        renderAllTasks();
        // ★★★ 修正: ボードとタスクの描画が完了した後にヒートマップを更新 ★★★
        updatePatientDisplayForAllBeds(); // まず患者概要を更新
        updateHeatmap(); // 次にヒートマップを計算・適用
    }

    // ----------------------------------------
    // ★★★ シナリオ管理機能 ★★★
    // ----------------------------------------

    // 現在のアプリケーションの状態をオブジェクトとして取得する
    function getCurrentState() {
        // DateオブジェクトはJSONに直接保存できないため、ISO文字列に変換
        const serializableTasks = placedTasks.map(task => ({
            ...task,
            startTime: task.startTime.toISOString(),
            endTime: task.endTime.toISOString(),
        }));

        return {
            northNurseCount: countNorthInput.value,
            southNurseCount: countSouthInput.value,
            patientData: patientData,
            nurseSettings: nurseSettings,
            placedTasks: serializableTasks,
        };
    }

    // 状態オブジェクトをアプリケーションに適用する
    function applyState(state) {
        // 各状態を復元
        countNorthInput.value = state.northNurseCount || '6';
        countSouthInput.value = state.southNurseCount || '7';
        patientData = state.patientData || {};
        nurseSettings = state.nurseSettings || {};

        // ISO文字列からDateオブジェクトに復元
        placedTasks = state.placedTasks.map(task => ({
            ...task,
            startTime: new Date(task.startTime),
            endTime: new Date(task.endTime),
        }));

        // 画面全体を再描画
        updateDisplay();
    }

    // 保存されているシナリオをlocalStorageから取得する
    function getSavedScenarios() {
        const scenariosJSON = localStorage.getItem('icu_scenarios');
        return scenariosJSON ? JSON.parse(scenariosJSON) : {};
    }

    // シナリオリストをドロップダウンに読み込む
    function loadScenarioList() {
        const scenarios = getSavedScenarios();
        const currentSelectedValue = scenarioSelect.value;
        scenarioSelect.innerHTML = '<option value="">シナリオを選択...</option>';

        for (const name in scenarios) {
            const option = document.createElement('option');
            option.value = name;
            option.textContent = name;
            scenarioSelect.appendChild(option);
        }
        // 以前選択されていた項目を再選択する
        if (scenarios[currentSelectedValue]) {
            scenarioSelect.value = currentSelectedValue;
        }
    }

    // 現在の状態をシナリオとして保存する
    function saveScenario() {
        const name = scenarioNameInput.value.trim();
        if (!name) {
            alert('シナリオ名を入力してください。');
            return;
        }

        const scenarios = getSavedScenarios();
        scenarios[name] = getCurrentState();

        localStorage.setItem('icu_scenarios', JSON.stringify(scenarios));
        scenarioNameInput.value = '';
        loadScenarioList();
        scenarioSelect.value = name; // 保存したシナリオを選択状態にする
        alert(`シナリオ「${name}」を保存しました。`);
    }

    // 選択されたシナリオを読み込む
    function loadScenario() {
        const name = scenarioSelect.value;
        if (!name) return;

        const scenarios = getSavedScenarios();
        const state = scenarios[name];

        if (state) {
            applyState(state);
            alert(`シナリオ「${name}」を読み込みました。`);
        }
    }

    // 選択されたシナリオを削除する
    function deleteScenario() {
        const name = scenarioSelect.value;
        if (!name) return;

        if (confirm(`シナリオ「${name}」を本当に削除しますか？`)) {
            const scenarios = getSavedScenarios();
            delete scenarios[name];
            localStorage.setItem('icu_scenarios', JSON.stringify(scenarios));
            loadScenarioList();
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
    // ★関数: 全ベッドの患者情報表示を更新
    // ----------------------------------------
    function updatePatientDisplayForAllBeds() {
        const allBedIds = [...generateBedList(beds.north), ...generateBedList(beds.south)];
        allBedIds.forEach(bedId => {
            updatePatientDisplay(bedId);
        });
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
        // ★看護師ボードではケアセットプランナーを非表示
        careSetContainer.classList.add('care-set-container-hidden');
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

    // ★ヒートマップの時刻が変更されたら5分単位に丸める（自動更新はしない）
    heatmapTimeInput.addEventListener('change', () => {
        const [hour, minute] = heatmapTimeInput.value.split(':').map(Number);
        const roundedMinute = Math.round(minute / 5) * 5;
        const newDate = new Date();
        newDate.setHours(hour, roundedMinute, 0, 0);
        heatmapTimeInput.value = `${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`;
    });
    // ★ヒートマップの「表示」ボタンが押されたら更新
    btnUpdateHeatmap.addEventListener('click', () => {
        updateHeatmap(); // ★ヒートマップを更新
    });

    // ★シナリオ管理のイベントリスナー
    btnSaveScenario.addEventListener('click', saveScenario);
    btnDeleteScenario.addEventListener('click', deleteScenario);
    scenarioSelect.addEventListener('change', loadScenario);



    // ----------------------------------------
    // 初期描画
    // ----------------------------------------
    initializeBedDisplays(); // ★ベッド表示を初期化
    updateDisplay();
    initializeCareTabs(); // ★ケアリストのタブを初期化
    renderCareList(currentCareCategory); // ★ケアリストの初期描画
    initializeCareSetPlanner(); // ★ケアセットプランナーを初期化
    loadScenarioList(); // ★保存済みシナリオを読み込む

    // ★初期の病棟選択状態をスタイルに反映
    northWardRow.classList.add('active');
});