import * as React from 'react'

import { SPECIAL_ROLES, type SpecialRoleId } from '@/lib/special-roles'
import { readEnabledSpecialRoles, writeEnabledSpecialRoles } from '@/lib/special-roles-storage'

function useSpecialRoles() {
  const [enabledIds, setEnabledIds] = React.useState<SpecialRoleId[]>(
    () => readEnabledSpecialRoles() ?? []
  )

  React.useEffect(() => {
    writeEnabledSpecialRoles(enabledIds)
  }, [enabledIds])

  function isEnabled(id: SpecialRoleId): boolean {
    return enabledIds.includes(id)
  }

  function toggleRole(id: SpecialRoleId) {
    setEnabledIds((prev) => (prev.includes(id) ? prev.filter((entry) => entry !== id) : [...prev, id]))
  }

  return { roles: SPECIAL_ROLES, enabledIds, isEnabled, toggleRole }
}

export { useSpecialRoles }
