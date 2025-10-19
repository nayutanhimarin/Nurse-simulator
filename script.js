// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    
    // ----------------------------------------
    // 要素の取得 (よく使うものを変数に入れておく)
    // ----------------------------------------
    const hourRow = document.querySelector('.hour-row');
    const minuteRow = document.querySelector('.minute-row');
    const timelineBody = document.querySelector('.timeline-body');
    const namesHeaderSpacer = document.querySelector('.names-header-spacer');
    
    const btnAm = document.getElementById('btn-am');
    const btnPm = document.getElementById('btn-pm');

    // ----------------------------------------
    // 定数 (設定値)
    // ----------------------------------------
    const totalHours = 5; // 午前も午後も5時間
    const blocksPerHour_Header = 6; // ヘッダー(分)は1時間に6ブロック
    const blocksPerHour_Body = 12; // 本体(グリッド)は1時間に12ブロック
    const minutes = ['0', '10', '20', '30', '40', '50'];

    // ----------------------------------------
    // 関数: タイムラインをクリアする
    // ----------------------------------------
    function clearTimeline() {
        hourRow.innerHTML = '';
        minuteRow.innerHTML = '';
        
        // timelineBodyの中身もクリア (看護師①の行のグリッド)
        // ※ .timeline-row 自体はHTMLに残しているので、その中身をクリア
        const timelineRows = timelineBody.querySelectorAll('.timeline-row');
        timelineRows.forEach(row => {
            row.innerHTML = '';
        });
    }

    // ----------------------------------------
    // 関数: タイムラインを描画する
    // (startHour: 8 または 13)
    // ----------------------------------------
    function createTimeline(startHour) {
        
        // --- 1. ヘッダー（時）の生成 ---
        for (let h = 0; h < totalHours; h++) {
            const hourBlock = document.createElement('div');
            hourBlock.classList.add('hour-block');
            hourBlock.textContent = startHour + h; // 8時 or 13時 から開始
            hourRow.appendChild(hourBlock);
        }

        // --- 2. ヘッダー（分）の生成 (10分ごと) ---
        for (let h = 0; h < totalHours; h++) {
            for (let m = 0; m < blocksPerHour_Header; m++) {
                const minuteBlock = document.createElement('div');
                minuteBlock.classList.add('minute-block');
                minuteBlock.textContent = minutes[m];
                if (m === 3) { // 30分
                    minuteBlock.classList.add('half-hour');
                }
                minuteRow.appendChild(minuteBlock);
            }
        }

        // --- 3. タイムライン本体（5分グリッド）の生成 ---
        const timelineRows = timelineBody.querySelectorAll('.timeline-row');
        const totalCells = totalHours * blocksPerHour_Body; // 5時間 x 12コマ = 60セル

        timelineRows.forEach(row => {
            for (let i = 0; i < totalCells; i++) {
                const cell = document.createElement('div');
                cell.classList.add('grid-cell');
                
                // 10分ごとの線 (i=1, 3, 5...)
                if ( (i + 1) % 2 === 0 && (i + 1) % 6 !== 0) {
                    cell.classList.add('ten-min-line');
                }
                // 30分ごとの線 (i=5, 17...)
                if ( (i + 1) % 6 === 0 && (i + 1) % 12 !== 0) {
                    cell.classList.add('half-hour-line');
                }
                // 1時間ごとの線 (i=11, 23...)
                if ( (i + 1) % 12 === 0) {
                    cell.classList.add('hour-line');
                }
                row.appendChild(cell);
            }
        });
        
        // --- 4. ヘッダーの高さ調整 (48.5pxを再適用) ---
        // (中身が再描画されると高さが変わる可能性があるため)
        namesHeaderSpacer.style.height = "48.5px";
    }

    // ----------------------------------------
    // イベントリスナーの設定
    // ----------------------------------------

    // 午前ボタンが押された時
    btnAm.addEventListener('click', () => {
        // 1. タブの見た目を変更
        btnAm.classList.add('active');
        btnPm.classList.remove('active');
        
        // 2. タイムラインをクリア
        clearTimeline();
        
        // 3. 午前モード (8時) で描画
        createTimeline(8); 
    });

    // 午後ボタンが押された時
    btnPm.addEventListener('click', () => {
        // 1. タブの見た目を変更
        btnPm.classList.add('active');
        btnAm.classList.remove('active');

        // 2. タイムラインをクリア
        clearTimeline();
        
        // 3. 午後モード (13時) で描画
        createTimeline(13);
    });

    // ----------------------------------------
    // 初期描画 (ページ読み込み時に「午前」を描画)
    // ----------------------------------------
    createTimeline(8);

});