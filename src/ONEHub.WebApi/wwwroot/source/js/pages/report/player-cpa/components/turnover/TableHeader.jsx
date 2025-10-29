import React from 'react'

export default function TableHeader() {
  return (
    <thead>
        <tr style={{ backgroundColor: '#e9ecef' }}>
            <th title="Product Group" className="text-center">Product Group</th>
            <th title="Turnover" className="text-center" style={{ width: '150px' }}>Turnover</th>
            <th title="CPA Amount" className="text-center" style={{ width: '150px' }}>CPA Amount</th>
        </tr>
    </thead>
  )
}
