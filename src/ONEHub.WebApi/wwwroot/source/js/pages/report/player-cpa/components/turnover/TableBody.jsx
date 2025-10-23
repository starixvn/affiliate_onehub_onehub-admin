import React from 'react'
import { formatDecimal } from '../../../../../modules/numberFormat';

const ProductGroup = ({ group, index }) => {

    const groupName = `Group ${index + 1}`;
    const turnover = formatDecimal(group.turnover);
    const cpaAmount = formatDecimal(group.cpaAmount);

    return (
        <React.Fragment key={index}>
            <tr style={{ backgroundColor: '#f2f2f2' }}>
                <td title={groupName} className="font-weight-bold">{groupName}</td>
                <td title={turnover} className="text-right font-weight-bold">{turnover}</td>
                <td title={cpaAmount} className="text-right font-weight-bold">{cpaAmount}</td>
            </tr>
            {group.products.map((product, prodIndex) => {
                const productName = product.productName;
                const productTurnover = formatDecimal(product.turnover);

                return (
                    <tr key={`${index}-${prodIndex}`}>
                        <td title={productName} className="pl-4">{productName}</td>
                        <td title={productTurnover} className="text-right">{productTurnover}</td>
                        <td className="text-right"></td>
                    </tr>
                )
            })}
        </React.Fragment>
    )
}

export default function TableBody({ groups }) {
    return (
        <tbody>
            {
                groups.map((group, index) => (
                    <ProductGroup key={index} group={group} index={index} />
                ))
            }
        </tbody>
    )
}
