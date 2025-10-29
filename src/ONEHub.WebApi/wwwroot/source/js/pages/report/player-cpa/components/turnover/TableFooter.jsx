import React from 'react'
import { formatDecimal } from '../../../../../modules/numberFormat';

export default function TableFooter({ total }) {

  const turnover = formatDecimal(total.turnover);
  const cpaAmount = formatDecimal(total.cpaAmount);

  return (
    <tfoot>
        <tr style={{ backgroundColor: '#ffc4a8' }}>
            <td title="Total" className="font-weight-bold" style={{ backgroundColor: '#ffc4a8' }}>Total</td>
            <td title={turnover} className="text-right font-weight-bold" style={{ backgroundColor: '#ffc4a8' }}>
                {turnover}
            </td>
            <td title={cpaAmount} className="text-right font-weight-bold" style={{ backgroundColor: '#ffc4a8' }}>
                {cpaAmount}
            </td>
        </tr>
    </tfoot>
  )
}
