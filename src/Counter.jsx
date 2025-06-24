import { useState } from 'react'

function Counter() {
  const [count, setCount] = useState(0)

  return (
    <div className="counter">
      <h2>Counter Sederhana</h2>
      <p>Nilai saat ini: {count}</p>
      <div>
        <button onClick={() => setCount(count - 1)}>Kurang</button>
        <button onClick={() => setCount(0)}>Reset</button>
        <button onClick={() => setCount(count + 1)}>Tambah</button>
      </div>
    </div>
  )
}

export default Counter 