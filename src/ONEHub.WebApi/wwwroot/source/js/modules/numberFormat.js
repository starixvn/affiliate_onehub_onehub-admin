export function formatDecimal(value) {
    return format(value, 2)
}

export function format(value, digits = 0) {
    if (typeof value !== "number" || isNaN(value)) {
        return "";
    }

    const roundedValue = round(value, digits);

    return roundedValue.toFixed(digits).replace(digits > 2 ? /(\d)(?=(\d{3})+(\.))/g : /(\d)(?=(\d{3})+(\.|$))/g, "$1,");
}

export function formatDecimalWithCurrencySymbol(value, currencySymbol = "") {
    return isNegativeDecimal(value) ? `-${currencySymbol}${formatDecimal(Math.abs(value))}` : `${currencySymbol}${formatDecimal(value)}`;
}

function isNegativeDecimal(value) {
    //-$0.00xy (x < 5), the amount must be shown as $0.00
    if (value * 1000 > -5) {
        return false;
    }

    return true;
}

export function round(value, digits) {
    const sign = value < 0 ? -1 : 1;
    const absoluteValue = Math.abs(value);
    const rounded = Number(Math.round(absoluteValue + 'e' + digits) + 'e-' + digits);

    return sign * rounded;
}