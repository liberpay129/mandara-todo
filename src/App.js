import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  // 3x3のグリッドの状態を管理  初期化時にlocalStorageからデータを読み込む
  const [grid, setGrid] = useState(() => {
    const saveGrid = localStorage.getItem('mandaraGrid');
    return saveGrid
    ? JSON.parse(saveGrid)
    : Array(9).fill().map(() => Array(9).fill(''));
  });

  // Todoリストの状態を管理 (セル位置をキーとして使用)
  const [todoLists, setTodoLists] = useState(() => {
    const saveTodoLists = localStorage.getItem('todoLists');
    return saveTodoLists
    ? JSON.parse(saveTodoLists)
    : {
    '1,1': [],
    '1,4': [],
    '1,7': [],
    '4,1': [],
    '4,7': [],
    '7,1': [],
    '7,4': [],
    '7,7': [],
    }
  });

  // 現在選択されているセル
  const [selectedCell, setSelectedCell] = useState(null);

  // モーダルのヘッダー用文字列
  const [modalHeaderStr, setModalHeaderStr] = useState("");

  // Todoモーダルの表示状態
  const [showTodoModal, setShowTodoModal] = useState(false);

  // 新しいTodo入力用の状態
  const [newTodo, setNewTodo] = useState('');

  // 使い方モーダルの表示状態
  const [showHelpModal, setShowHelpModal] = useState(false);

  // todoリストが変更されるたびにlocalStorageに保存
  useEffect(() => {
    localStorage.setItem("todoLists", JSON.stringify(todoLists));
  },[todoLists]);

   // グリッドが変更されるたびにlocalStorageに保存
   useEffect(() => {
    localStorage.setItem('mandaraGrid', JSON.stringify(grid));
  }, [grid]);

  // セルクリック時の処理
  const handleCellClick = (row, col) => {
    const cellKey = `${row},${col}`;
    if (cellKey in todoLists) {
      setSelectedCell(cellKey);
      setShowTodoModal(true);
    }
    if (row ===1 && col===1) {
      setModalHeaderStr("いくら")
    } else if (row===1 && col===4) {
      setModalHeaderStr("いつ")
    } else if (row===1 && col===7) {
      setModalHeaderStr("どこで")
    } else if (row===4 && col===1) {
      setModalHeaderStr("いくつ")
    } else if (row===4 && col===7) {
      setModalHeaderStr("誰が")
    } else if (row===7 && col===1) {
     setModalHeaderStr("方法")
    } else if (row===7 && col===4) {
      setModalHeaderStr("なぜ")
    } else if (row===7 && col===7) {
      setModalHeaderStr("何を")
  }
  }

  // todoを追加する関数
  const addTodo = () => {
    if (newTodo.trim() && selectedCell) {
      setTodoLists(prev => ({
        ...prev,
        [selectedCell]: [...prev[selectedCell], {
          id: Date.now(), 
          text: newTodo.trim(),
          completed: false
        }]
      }));
      setNewTodo("");
    }
  };

  // Todoの完了状態を切り替える関数
  const toggleTodo = (todoId) => {
    if (selectedCell) {
      setTodoLists(prev => ({
        ...prev,
        [selectedCell]: prev[selectedCell].map(todo =>
          todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
        )
      }));
    }
  }

  // Todoを削除する関数
  const deleteTodo = (todoId) => {
    if (selectedCell) {
      setTodoLists(prev => ({
        ...prev, 
        [selectedCell]: prev[selectedCell].filter(todo => todo.id !== todoId)
      }));
    }
  };

  // モーダルを閉じる関数
  const closeModal = () => {
    setShowTodoModal(false);
    setShowHelpModal(false);
    setSelectedCell(null);
    setNewTodo("");
  };


  // セルの値を更新する関数
  const handleInputChange = (row, col, value) => {
    const newGrid = [...grid];
    newGrid[row][col] = value;
    if (row === 3&&col === 3) {
      newGrid[1][1] = newGrid[3][3];
    } else if (row===3&&col===4) {
      newGrid[1][4] = newGrid[3][4];
    } else if (row===3&&col===5) {
      newGrid[1][7] = newGrid[3][5];
    } else if (row===4&&col===3) {
      newGrid[4][1] = newGrid[4][3];
    } else if (row===4&&col===5) {
      newGrid[4][7] = newGrid[4][5];
    } else if (row===5&&col===3) {
      newGrid[7][1] = newGrid[5][3];
    } else if (row===5&&col===4) {
      newGrid[7][4] = newGrid[5][4];
    } else if (row===5&&col===5) {
      newGrid[7][7] = newGrid[5][5];
    }
    setGrid(newGrid);
  };

  // 中央グリッドのplaceholderを設定
  const placeHolderText = (rowIndex, colIndex) => {
    if (rowIndex===3 && colIndex===3) {
      return "いくら"
    } else if (rowIndex===3 && colIndex===4) {
      return  "いつ"
    } else if (rowIndex===3 && colIndex===5) {
      return  "どこで"
    } else if (rowIndex===4 && colIndex===3) {
      return  "いくつ"
    } else if (rowIndex===4 && colIndex===4) {
      return  "目標"
    } else if (rowIndex===4 && colIndex===5) {
      return  "誰が"
    } else if (rowIndex===5 && colIndex===3) {
      return  "方法"
    } else if (rowIndex===5 && colIndex===4) {
      return  "なぜ"
    } else if (rowIndex===5 && colIndex===5) {
      return  "何を"
    } else if (rowIndex%3==0 && colIndex%3==0) {
      return  "1"
    } else if (rowIndex%3==0 && colIndex%3==1) {
      return  "2"
    } else if (rowIndex%3==0 && colIndex%3==2) {
      return  "3"
    } else if (rowIndex%3==1 && colIndex%3==2) {
      return  "4"
    } else if (rowIndex%3==2 && colIndex%3==2) {
      return  "5"
    } else if (rowIndex%3==2 && colIndex%3==1) {
      return  "6"
    } else if (rowIndex%3==2 && colIndex%3==0) {
      return  "7"
    } else if (rowIndex%3==1 && colIndex%3==0) {
      return  "8"
    }
  };

  // 入力を無効化するかどうかを判定する関数
  const isReadOnly = (rowIndex, colIndex) => {
    return (rowIndex === 1 && colIndex === 1) ||
           (rowIndex === 1 && colIndex === 4) ||
           (rowIndex === 1 && colIndex === 7) ||
           (rowIndex === 4 && colIndex === 1) ||
           (rowIndex === 4 && colIndex === 7) ||
           (rowIndex === 7 && colIndex === 1) ||
           (rowIndex === 7 && colIndex === 4) ||
           (rowIndex === 7 && colIndex === 7);
  };

 // 全てのデータをクリアする関数
  const clearAllData = () => {
    if (window.confirm('全てのデータを削除します。よろしいですか？')) {
      // グリッドのクリア
      const emptyGrid = Array(9).fill().map(() => Array(9).fill(''));
      setGrid(emptyGrid);

      // todoリストをクリア
      const emptyTodoList = {
        '1,1': [],
        '1,4': [],
        '1,7': [],
        '4,1': [],
        '4,7': [],
        '7,1': [],
        '7,4': [],
        '7,7': [],
        };
        setTodoLists(emptyTodoList);

        // ローカルストレージをクリア
        localStorage.removeItem('mandaraGrid');
        localStorage.removeItem('todoLists');

        // モーダルを閉じる
        setShowTodoModal(false);
    }
  };

  return (
    <div className="App">
      <div className='header-container'>
      <h1>曼荼羅チャート</h1>
      <button onClick={() => setShowHelpModal(true)} className="showHelp-button" title='使い方の表示'>使い方</button>
      <button onClick={clearAllData} className="clear-button" title="全てのデータを削除">クリア</button>
      </div>
      <div className="grid-container">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="grid-row">
            {row.map((cell, colIndex) => {
            const cellKey = `${rowIndex},${colIndex}`;
            //const hasTodos = (cellKey in todoLists) && todoLists[cellKey]?.length > 0;
            return(
              <input
                key={`${rowIndex}-${colIndex}`}
                type="text"
                value={cell}
                onChange={(e) => handleInputChange(rowIndex, colIndex, e.target.value)}
                onClick={() => handleCellClick(rowIndex, colIndex)}
                className={`grid-cell ${isReadOnly(rowIndex, colIndex) ? 'todo-enabled' : ''} ${
                 todoLists[`${rowIndex},${colIndex}`]?.length > 0 ? 'has-todos' : ''}`}
                data-row={rowIndex}
                data-col={colIndex}
                placeholder={placeHolderText(rowIndex, colIndex)}
                readOnly={isReadOnly(rowIndex, colIndex)}
              />
              );
              })}
          </div>
        ))}
      </div>

      {/* Todoモーダル */}
      {showTodoModal && (
        <div className="todo-modal-overlay" onClick={closeModal}>
          <div className="todo-modal" onClick={(e) => e.stopPropagation()}>
            <div className="todo-modal-header">
              <h3>"{modalHeaderStr}" に関するTodoリスト</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>

            <div className="todo-input-section">
              <input
                type="text"
                value={newTodo}
                onChange={(e) => setNewTodo(e.target.value)}
                placeholder="新しいTodoを入力..."
                className="todo-input"
                onKeyUp={(e) => e.key === 'Enter' && addTodo()}
              />
              <button onClick={addTodo} className="add-todo-button">追加</button>
              </div>
              
              <div className="todo-list">
              {todoLists[selectedCell]?.map(todo => (
                <div key={todo.id} className={`todo-item ${todo.completed ? 'completed' : ''}`}>
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo.id)}
                    className="todo-checkbox"
                  />
                  <span className="todo-text">{todo.text}</span>
                  <button 
                    onClick={() => deleteTodo(todo.id)}
                    className="delete-todo-button"
                  >
                    削除
                  </button>
                </div>
              ))}
              {todoLists[selectedCell]?.length === 0 && (
                <p className="no-todos">Todoがありません</p>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Heloモーダル */}
      {showHelpModal && (
        <div className="todo-modal-overlay" onClick={closeModal}>
          <div className="todo-modal-help" onClick={(e) => e.stopPropagation()}>
            <div className="todo-modal-header">
              <h3>曼荼羅チャートの使い方</h3>
              <button className="close-button" onClick={closeModal}>×</button>
            </div>

            <div>
              <ul>
                <li>初めに、あなたの目標を真ん中のマスに記入してください。</li>
                <li>目標の周囲のマスに、目標に関連する内容を記入してください。<br></br>
                　(目標の周囲のマスの内容が、色が同じマスに反映されます。)</li>
                <li>更に各色がついたマスの周囲のマスに、関連した内容を記入します。</li>
                <li>色がついたマスを選択すると、ToDoリストの編集ができます。</li>
              </ul>
            </div>



          </div>
        </div>
      )}
    </div>
  );
}

export default App;
