// DOMが読み込まれたら実行
document.addEventListener('DOMContentLoaded', () => {
    
    // 午前モード (8時〜12時) の5時間分
    const totalHours = 5; 

    // ----------------------------------------
    // 1. ヘッダー（分）の生成 (10分ごと)
    // ----------------------------------------
    const minuteRow = document.querySelector('.minute-row');
    const blocksPerHour_Header = 6; // 1時間あたり6ブロック (10分ごと)
    const minutes = ['0', '10', '20', '30', '40', '50'];

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

    // ----------------------------------------
    // 2. タイムライン本体（5分グリッド）の生成
    // ----------------------------------------
    
    // グリッドを追加する行 (nurse1-row1, row2, row3)
    const timelineRows = document.querySelectorAll('.timeline-row');

    // 1時間あたり12コマ (5分ごと)
    const blocksPerHour_Body = 12;
    // 合計コマ数 (5時間 x 12コマ)
    const totalCells = totalHours * blocksPerHour_Body; 

    // すべての行 (.timeline-row) に対して実行
    timelineRows.forEach(row => {
        // 60コマ分のセルを生成
        for (let i = 0; i < totalCells; i++) {
            const cell = document.createElement('div');
            cell.classList.add('grid-cell');
            
            // i=0 が 8:00, i=1 が 8:05, i=2 が 8:10 ...

            // 10分ごとの線 (iが奇数 = 5分, 15分...)
            // ※ i=1, 3, 5... (indexは0から始まるため)
            if ( (i + 1) % 2 === 0 && (i + 1) % 6 !== 0) {
                 cell.classList.add('ten-min-line');
            }
            
            // 30分ごとの線 (i=5, 17, 29...)
            // (i + 1) が 6 の倍数 (30分)
            if ( (i + 1) % 6 === 0 && (i + 1) % 12 !== 0) {
                cell.classList.add('half-hour-line');
            }
            
            // 1時間ごとの線 (i=11, 23, 35...)
            // (i + 1) が 12 の倍数 (60分)
            if ( (i + 1) % 12 === 0) {
                cell.classList.add('hour-line');
            }

            row.appendChild(cell);
        }
    });

});