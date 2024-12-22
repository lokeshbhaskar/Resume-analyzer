import React from 'react'
import { useSelector } from 'react-redux'
function AtsScore() {
  const result = useSelector((state) => state.analysis.result);
  return (
    <div>
        <h2>ATS Score Analysis Result</h2>
      {Array.isArray(result) ? (
        <div>
          <p>The result is an array with {result.length} items.</p>
          {result.map((item, index) => (
            <div key={index}>
              <p>{JSON.stringify(item)}</p>
            </div>
          ))}
        </div>
      ) : (
        <div>
          <p>The result is not an array.</p>
          <pre>{JSON.stringify(result, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}

export default AtsScore