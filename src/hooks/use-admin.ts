import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { apiClient } from '@/api/client'

// Types for admin API responses
export interface AdminUser {
  id: string
  username: string
  email: string
  avatar_url?: string
  role: string
  active: boolean
  created_at: string
  updated_at: string
}

export interface AdminSpace {
  id: string
  name: string
  description?: string
  icon?: string
  type: string
  owner_id?: string
  owner_name?: string
  created_at: string
  updated_at: string
}

export interface AdminApiKey {
  id: string
  name: string
  key_prefix: string
  user_id: string
  username?: string
  permissions: string[]
  expires_at?: string
  last_used_at?: string
  created_at: string
}

interface ListUsersResponse {
  users: AdminUser[]
  total_count: number
}

interface ListSpacesResponse {
  spaces: AdminSpace[]
  total_count: number
}

interface ListApiKeysResponse {
  api_keys: AdminApiKey[]
  total_count: number
}

// Users
export function useAdminUsers(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'users', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<ListUsersResponse>(
        `/admin/users?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, role }: { userId: string; role: string }) => {
      await apiClient.put(`/admin/users/${userId}/role`, { role })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useUpdateUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ userId, active }: { userId: string; active: boolean }) => {
      await apiClient.put(`/admin/users/${userId}/active`, { active })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (userId: string) => {
      await apiClient.delete(`/admin/users/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ email, role }: { email: string; role: string }) => {
      await apiClient.post('/admin/users/invite', { email, role })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

// Spaces
export function useAdminSpaces(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'spaces', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<ListSpacesResponse>(
        `/admin/spaces?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
  })
}

export interface AdminSpacePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: string
  created_at: string
}

interface ListSpacePermissionsResponse {
  permissions: AdminSpacePermission[]
}

interface CreateSpaceResponse {
  id: string
  message: string
}

export function useCreateAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, icon, iconColor, type, ownerId }: {
      name: string
      icon?: string
      iconColor?: string
      type: string
      ownerId?: string | null
    }) => {
      const response = await apiClient.post<CreateSpaceResponse>('/admin/spaces', {
        name,
        icon: icon || '',
        icon_color: iconColor || '',
        type,
        owner_id: ownerId || null
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useUpdateAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, name, icon, iconColor, type, ownerId }: {
      spaceId: string
      name: string
      icon?: string
      iconColor?: string
      type: string
      ownerId?: string | null
    }) => {
      await apiClient.put(`/admin/spaces/${spaceId}`, {
        name,
        icon: icon || '',
        icon_color: iconColor || '',
        type,
        owner_id: ownerId || null
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useDeleteAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (spaceId: string) => {
      await apiClient.delete(`/admin/spaces/${spaceId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useAdminSpacePermissions(spaceId: string | null) {
  return useQuery({
    queryKey: ['admin', 'spaces', spaceId, 'permissions'],
    queryFn: async () => {
      const response = await apiClient.get<ListSpacePermissionsResponse>(
        `/admin/spaces/${spaceId}/permissions`
      )
      return response.data
    },
    enabled: !!spaceId,
  })
}

export function useAddSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, userId, role }: { spaceId: string; userId: string; role: string }) => {
      await apiClient.post(`/admin/spaces/${spaceId}/permissions/users`, { user_id: userId, role })
    },
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces', spaceId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] }) // Refresh user's spaces list with updated permissions
    },
  })
}

export function useRemoveSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, userId }: { spaceId: string; userId: string }) => {
      await apiClient.delete(`/admin/spaces/${spaceId}/permissions/users/${userId}`)
    },
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces', spaceId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] }) // Refresh user's spaces list with updated permissions
    },
  })
}

export function useAddSpaceGroupPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, groupId, role }: { spaceId: string; groupId: string; role: string }) => {
      await apiClient.post(`/admin/spaces/${spaceId}/permissions/groups`, { group_id: groupId, role })
    },
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces', spaceId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] }) // Refresh user's spaces list with updated permissions
    },
  })
}

export function useRemoveSpaceGroupPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ spaceId, groupId }: { spaceId: string; groupId: string }) => {
      await apiClient.delete(`/admin/spaces/${spaceId}/permissions/groups/${groupId}`)
    },
    onSuccess: (_, { spaceId }) => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces', spaceId, 'permissions'] })
      queryClient.invalidateQueries({ queryKey: ['spaces'] }) // Refresh user's spaces list with updated permissions
    },
  })
}

// API Keys
export function useAdminApiKeys(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'apikeys', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<ListApiKeysResponse>(
        `/admin/apikeys?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (apiKeyId: string) => {
      await apiClient.delete(`/admin/apikeys/${apiKeyId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apikeys'] })
    },
  })
}

// Groups
export interface AdminGroupMember {
  id: string
  username: string
  email: string
  avatar_url?: string
}

export interface AdminGroup {
  id: string
  name: string
  description: string
  role: string
  owner_id: string
  owner_name?: string
  member_count: number
  members?: AdminGroupMember[]
  created_at: string
  updated_at: string
}

interface ListGroupsResponse {
  groups: AdminGroup[]
  total_count: number
}

interface CreateGroupResponse {
  id: string
  message: string
}

export function useAdminGroups(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'groups', limit, offset],
    queryFn: async () => {
      const response = await apiClient.get<ListGroupsResponse>(
        `/admin/groups?limit=${limit}&offset=${offset}`
      )
      return response.data
    },
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ name, description, role }: { name: string; description: string; role: string }) => {
      const response = await apiClient.post<CreateGroupResponse>('/admin/groups', { name, description, role })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, name, description, role }: { groupId: string; name: string; description: string; role: string }) => {
      await apiClient.put(`/admin/groups/${groupId}`, { name, description, role })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (groupId: string) => {
      await apiClient.delete(`/admin/groups/${groupId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useAddGroupMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      await apiClient.post(`/admin/groups/${groupId}/members`, { user_id: userId })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ groupId, userId }: { groupId: string; userId: string }) => {
      await apiClient.delete(`/admin/groups/${groupId}/members/${userId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}
