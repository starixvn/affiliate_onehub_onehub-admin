import { resolveClientUrl } from "../../../modules/utils"

export const menuKey = {
    affiliateReport: 'affiliateReport',
    playerGgrReport: 'playerGgrReport',
    transferReport: 'transferReport',
    affiliateCpaReport: 'affiliateCpaReport',
    playerCPA: 'playerCPA',
    redepositCpaReport: 'redepositCpaReport',
}

export const relativePath = {
    affiliateReport: resolveClientUrl('Portal/Report'),
    playerGgrReport: resolveClientUrl('Portal/PlayerGgrReport'),
    transferReport: resolveClientUrl('Portal/TransferReport'),
    affiliateCpaReport: resolveClientUrl('Portal/AffiliateCpaReport'),
    playerCPA: resolveClientUrl('Portal/PlayerCpaReport'),
    redepositCpaReport: resolveClientUrl('Portal/RedepositCpaReport'),
}

export const getMaxHeight = () => {
    const height = window.innerHeight - 350;
    return height > 300 ? height : 300;
}