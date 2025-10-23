import React from 'react'
import { connect } from 'react-redux';
import { globalResource } from '../../../../../modules/globalResource';
import { formatDecimal } from '../../../../../modules/numberFormat';
import { setDealId, toggleDealPopup, setAffName } from '../../actions';
import { resolveClientUrl } from '../../../../../modules/utils';

const RowData = ({ data, rowNumber, setDealId, toggleDealPopup, setAffName }) => {
    const handleClickDeal = () => {
        setDealId(data.groupId);
        setAffName(data.affiliate);
        toggleDealPopup();
    }

    const cpaAmount = formatDecimal(data.cpaAmount);
    const estimatedCPAAmount = formatDecimal(data.estimatedCPAAmount);
    const approvedCPAAmount = formatDecimal(data.approvedCPAAmount);

    return (
        <tr key={`dataRow-${rowNumber}`}>
            <td title={rowNumber} className="text-center">{rowNumber}</td>
            <td title={data.month} className="text-center">{data.month}</td>
            <td title={data.affiliate}><a target='_blank' href={resolveClientUrl(`Portal/Customer?user=${data.affiliate}`)}>{data.affiliate}</a></td>
            <td title={data.dealName}><span className="btn-link" onClick={handleClickDeal}>{data.dealName}</span></td>
            <td title={data.dealType} className="text-center">{data.dealType}</td>
            <td title={data.paymentFrequency} className="text-center">{data.paymentFrequency}</td>
            <td title={data.quota} className="text-center">{data.quota}</td>
            <td title={cpaAmount} className="text-right">{cpaAmount}</td>
            <td title={estimatedCPAAmount} className="text-right">{estimatedCPAAmount}</td>
            <td title={approvedCPAAmount} className="text-right">{approvedCPAAmount}</td>
        </tr>
    )
}
export function TableBody({
    data,
    pagingOption,
    setDealId,
    toggleDealPopup,
    setAffName
}) {
    if (!data || data.length === 0) {
        return (
            <tbody>
                <tr>
                    <td className="text-center" colSpan={10}>{globalResource.NoInfo}</td>
                </tr>
            </tbody>
        )
    }

    const getRowNumber = (index) => {
        return (pagingOption.PageIndex - 1) * pagingOption.PageSize + index + 1;
    }

    return (
        <tbody>
            {
                data && data.map((item, index) => (
                    <RowData
                        key={index}
                        data={item}
                        rowNumber={getRowNumber(index)}
                        setDealId={setDealId}
                        toggleDealPopup={toggleDealPopup}
                        setAffName={setAffName}
                    />
                ))
            }
        </tbody>
    )
}

const mapDispatchToProps = (dispatch) => {
    return {
        setDealId: (data) => dispatch(setDealId(data)),
        toggleDealPopup: () => dispatch(toggleDealPopup()),
        setAffName: (data) => dispatch(setAffName(data))
    }
}

export default connect(null, mapDispatchToProps)(TableBody);