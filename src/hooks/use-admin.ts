import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import {
  adminListUsers,
  adminUpdateUserRole,
  adminUpdateUserActive,
  adminDeleteUser,
  adminInviteUser,
  adminListAllSpaces,
  adminCreateSpace,
  adminUpdateSpace,
  adminDeleteSpace,
  adminListSpacePermissions,
  adminAddSpaceUserPermission,
  adminRemoveSpaceUserPermission,
  adminAddSpaceGroupPermission,
  adminRemoveSpaceGroupPermission,
  adminListAllApiKeys,
  adminRevokeApiKey,
  adminListGroups,
  adminCreateGroup,
  adminUpdateGroup,
  adminDeleteGroup,
  adminAddGroupMember,
  adminRemoveGroupMember,
} from '@/api/generated/admin/admin'
import type {
  AdminCreateSpaceRequest,
  AdminUpdateSpaceRequest,
  AdminAddSpaceUserPermissionRequest,
  AdminAddSpaceGroupPermissionRequest,
  UpdateUserRoleRequest,
  UpdateUserActiveRequest,
  InviteUserRequest,
  CreateGroupRequest,
  UpdateGroupRequest,
  AddGroupMemberRequest,
} from '@/api/generated/model'

// Local type definitions for admin responses
// The generated types don't accurately represent admin endpoint responses,
// so we define them here with the correct required fields.
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

export interface AdminSpacePermission {
  id: string
  user_id?: string
  username?: string
  group_id?: string
  group_name?: string
  role: string
  created_at: string
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

export interface AdminGroupMember {
  id: string
  username: string
  email: string
  avatar_url?: string
}

// Users
export function useAdminUsers(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'users', limit, offset],
    queryFn: () => adminListUsers({ limit, offset }),
    select: (data) => ({
      users: (data.users ?? []) as unknown as AdminUser[],
      total_count: data.total_count ?? 0,
    }),
  })
}

export function useUpdateUserRole() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: string }) => {
      return adminUpdateUserRole(userId, { role } as UpdateUserRoleRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useUpdateUserActive() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ userId, active }: { userId: string; active: boolean }) => {
      return adminUpdateUserActive(userId, { active } as UpdateUserActiveRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useDeleteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (userId: string) => {
      return adminDeleteUser(userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'users'] })
    },
  })
}

export function useInviteUser() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ email, role }: { email: string; role: string }) => {
      return adminInviteUser({ email, role } as InviteUserRequest)
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
    queryFn: () => adminListAllSpaces({ limit, offset }),
    select: (data) => ({
      spaces: (data.spaces ?? []) as unknown as AdminSpace[],
      total_count: data.total_count ?? 0,
    }),
  })
}

export function useCreateAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, icon, iconColor, type, ownerId }: {
      name: string
      icon?: string
      iconColor?: string
      type: string
      ownerId?: string | null
    }) => {
      return adminCreateSpace({
        name,
        icon: icon || '',
        icon_color: iconColor || '',
        type,
        owner_id: ownerId || undefined,
      } as AdminCreateSpaceRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useUpdateAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, name, icon, iconColor, type, ownerId }: {
      spaceId: string
      name: string
      icon?: string
      iconColor?: string
      type: string
      ownerId?: string | null
    }) => {
      return adminUpdateSpace(spaceId, {
        name,
        icon: icon || '',
        icon_color: iconColor || '',
        type,
        owner_id: ownerId || undefined,
      } as AdminUpdateSpaceRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useDeleteAdminSpace() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (spaceId: string) => {
      return adminDeleteSpace(spaceId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'spaces'] })
    },
  })
}

export function useAdminSpacePermissions(spaceId: string | null) {
  return useQuery({
    queryKey: ['admin', 'spaces', spaceId, 'permissions'],
    queryFn: () => adminListSpacePermissions(spaceId!),
    select: (data) => ({
      permissions: (data.permissions ?? []) as unknown as AdminSpacePermission[],
    }),
    enabled: !!spaceId,
  })
}

export function useAddSpaceUserPermission() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ spaceId, userId, role }: { spaceId: string; userId: string; role: string }) => {
      return adminAddSpaceUserPermission(spaceId, { user_id: userId, role } as AdminAddSpaceUserPermissionRequest)
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
    mutationFn: ({ spaceId, userId }: { spaceId: string; userId: string }) => {
      return adminRemoveSpaceUserPermission(spaceId, userId)
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
    mutationFn: ({ spaceId, groupId, role }: { spaceId: string; groupId: string; role: string }) => {
      return adminAddSpaceGroupPermission(spaceId, { group_id: groupId, role } as AdminAddSpaceGroupPermissionRequest)
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
    mutationFn: ({ spaceId, groupId }: { spaceId: string; groupId: string }) => {
      return adminRemoveSpaceGroupPermission(spaceId, groupId)
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
    queryFn: () => adminListAllApiKeys({ limit, offset }),
    select: (data) => ({
      api_keys: (data.api_keys ?? []) as unknown as AdminApiKey[],
      total_count: data.total_count ?? 0,
    }),
  })
}

export function useRevokeApiKey() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (apiKeyId: string) => {
      return adminRevokeApiKey(apiKeyId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'apikeys'] })
    },
  })
}

// Groups
export function useAdminGroups(limit = 50, offset = 0) {
  return useQuery({
    queryKey: ['admin', 'groups', limit, offset],
    queryFn: () => adminListGroups({ limit, offset }),
    select: (data) => ({
      groups: (data.groups ?? []) as unknown as AdminGroup[],
      total_count: data.total_count ?? 0,
    }),
  })
}

export function useCreateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ name, description, role }: { name: string; description: string; role: string }) => {
      return adminCreateGroup({ name, description, role } as CreateGroupRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useUpdateGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, name, description, role }: { groupId: string; name: string; description: string; role: string }) => {
      return adminUpdateGroup(groupId, { name, description, role } as UpdateGroupRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useDeleteGroup() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (groupId: string) => {
      return adminDeleteGroup(groupId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useAddGroupMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => {
      return adminAddGroupMember(groupId, { user_id: userId } as AddGroupMemberRequest)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ groupId, userId }: { groupId: string; userId: string }) => {
      return adminRemoveGroupMember(groupId, userId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'groups'] })
    },
  })
}
