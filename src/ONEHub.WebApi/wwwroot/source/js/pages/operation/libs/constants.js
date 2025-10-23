import { resolveClientUrl } from "../../../modules/utils";

export const menuKey = {
    operation: 'operation'
}

export const relativePaths = {
    [menuKey.operation]: resolveClientUrl('Portal/Operation')
}
