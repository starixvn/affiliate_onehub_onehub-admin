import React from 'react'
import { formatDecimal } from '../../../../../modules/numberFormat';
import { totalText } from '../../libs/constants';

export const TableFooter = ({
    total,
    totalItem
}) => {

    if(!totalItem){
        return null;
    }

    const cpaAmount = formatDecimal(total.cpaAmount);
    const estimatedCPAAmount = formatDecimal(total.estimatedCPAAmount);
    const approvedCPAAmount = formatDecimal(total.approvedCPAAmount);

    return (
        <tfoot>
            <tr className="total-row freeze-row" style={{ backgroundColor: '#fbe5d6' }}>
                <td title={totalText} colSpan="3" className="text-left font-weight-bold freeze-column-footer">{totalText}</td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td className="text-right font-weight-bold freeze-column-footer"></td>
                <td title={cpaAmount} className="text-right font-weight-bold freeze-column-footer">{cpaAmount}</td>
                <td title={estimatedCPAAmount} className="text-right font-weight-bold freeze-column-footer">{estimatedCPAAmount}</td>
                <td title={approvedCPAAmount} className="text-right font-weight-bold freeze-column-footer">{approvedCPAAmount}</td>
            </tr>
        </tfoot>
    )
}


export default TableFooter;