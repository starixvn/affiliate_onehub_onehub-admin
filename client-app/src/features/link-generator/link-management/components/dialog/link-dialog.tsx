import { LinkDetailDialog } from './link-detail-dialog'
import { useLinks } from '../link-provider'

export function LinkDialogs() {
    const { open } = useLinks()

    if (!open) return null

    return (
        <>
            {open === 'detail' && <LinkDetailDialog />}
        </>
    )
}

