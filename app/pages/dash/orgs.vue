<script setup lang="ts">
import * as z from 'zod'

definePageMeta({ auth: true })

const { client } = useAuth()

const toast = useToast()

// Fetch organizations user owns/created
const { data: organizations, refresh: refreshOrgs } = await useAsyncData(
  'organizations',
  async () => {
    const result = await client.organization.list()
    return result.data || []
  },
)

// Fetch memberships (organizations user is a member of)
const { data: memberships, refresh: refreshMemberships } = await useAsyncData(
  'memberships',
  async () => {
    // @ts-expect-error - listMemberships is a method of the organization plugin
    const result = await client.organization.listMemberships()
    return result.data || []
  },
)

// Fetch active organization
const { data: activeOrg, refresh: refreshActive } = await useAsyncData(
  'active-organization',
  async () => {
    const result = await client.organization.getFullOrganization()
    return result.data
  },
)

// Create organization form
const createSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  slug: z.string().min(1, 'Slug is required').regex(/^[a-z0-9-]+$/, 'Slug must be lowercase alphanumeric'),
})
const createState = reactive({ name: '', slug: '' })
const createLoading = ref(false)

async function handleCreate(data: z.output<typeof createSchema>) {
  createLoading.value = true
  try {
    await client.organization.create({ name: data.name, slug: data.slug })
    createState.name = ''
    createState.slug = ''
    await Promise.all([refreshOrgs(), refreshActive(), refreshMemberships()])
  }
  finally {
    createLoading.value = false
  }
}

// Set active organization
async function setActive(orgId: string) {
  await client.organization.setActive({ organizationId: orgId })
  await Promise.all([refreshActive(), refreshMemberships()])
}

// Invite member form
const inviteSchema = z.object({
  email: z.string().email('Invalid email'),
  role: z.enum(['member', 'admin']),
})
const inviteState = reactive({ email: '', role: 'member' as const })
const inviteLoading = ref(false)

async function handleInvite(data: z.output<typeof inviteSchema>) {
  inviteLoading.value = true
  try {
    await client.organization.inviteMember({
      email: data.email,
      role: data.role,
      resend: true,
    })
    inviteState.email = ''
    inviteState.role = 'member'
    toast.add({
      title: 'Invitation sent',
      description: `Invitation sent to ${data.email}`,
    })
    await refreshActive()
  }
  finally {
    inviteLoading.value = false
  }
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <!-- Header -->
    <UCard>
      <div class="flex flex-col gap-6 p-4">
        <div class="flex items-center gap-3">
          <UIcon
            name="i-lucide-building-2"
            class="size-6 text-primary"
          />
          <h1 class="text-2xl font-bold">
            Organizations
          </h1>
        </div>
        <p class="text-muted">
          Manage your organizations and team members.
        </p>
      </div>
    </UCard>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Create Organization -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-plus"
              class="size-5"
            />
            <span class="font-semibold">Create Organization</span>
          </div>
        </template>

        <UForm
          :schema="createSchema"
          :state="createState"
          class="flex flex-col gap-4"
          @submit.prevent="(e) => handleCreate(e.data)"
        >
          <UFormField
            name="name"
            label="Name"
          >
            <UInput
              v-model="createState.name"
              placeholder="My Organization"
              class="w-full"
            />
          </UFormField>

          <UFormField
            name="slug"
            label="Slug"
          >
            <UInput
              v-model="createState.slug"
              placeholder="my-org"
              class="w-full"
            />
          </UFormField>

          <UButton
            type="submit"
            :loading="createLoading"
            label="Create"
          />
        </UForm>
      </UCard>

      <!-- Organizations List -->
      <UCard>
        <template #header>
          <div class="flex items-center gap-2">
            <UIcon
              name="i-lucide-list"
              class="size-5"
            />
            <span class="font-semibold">Your Organizations</span>
          </div>
        </template>

        <div
          v-if="organizations?.length"
          class="flex flex-col gap-2"
        >
          <div
            v-for="org in organizations"
            :key="org.id"
            class="flex items-center justify-between p-3 rounded-lg border border-default"
          >
            <div class="flex flex-col">
              <span class="font-medium">{{ org.name }}</span>
              <span class="text-sm text-muted">{{ org.slug }}</span>
            </div>
            <UButton
              v-if="activeOrg?.id !== org.id"
              size="sm"
              variant="outline"
              label="Set Active"
              @click="setActive(org.id)"
            />
            <UBadge
              v-else
              color="primary"
              label="Active"
            />
          </div>
        </div>
        <p
          v-else
          class="text-muted"
        >
          No organizations yet. Create one to get started.
        </p>
      </UCard>
    </div>

    <!-- Member Of Section -->
    <UCard>
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-users"
            class="size-5"
          />
          <span class="font-semibold">Member Of</span>
        </div>
      </template>

      <div
        v-if="memberships?.length"
        class="flex flex-col gap-2"
      >
        <div
          v-for="membership in memberships"
          :key="membership.id"
          class="flex items-center justify-between p-3 rounded-lg border border-default"
        >
          <div class="flex items-center gap-3">
            <UAvatar
              :alt="membership.organization.name"
              size="sm"
              icon="i-lucide-building-2"
            />
            <div class="flex flex-col">
              <span class="font-medium">{{ membership.organization.name }}</span>
              <span class="text-sm text-muted">{{ membership.organization.slug }}</span>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <UBadge
              :color="membership.role === 'owner' ? 'primary' : 'neutral'"
              :label="membership.role"
            />
            <UButton
              v-if="activeOrg?.id !== membership.organization.id"
              size="sm"
              variant="outline"
              label="Set Active"
              @click="setActive(membership.organization.id)"
            />
            <UBadge
              v-else
              color="success"
              label="Active"
            />
          </div>
        </div>
      </div>
      <p
        v-else
        class="text-muted"
      >
        You are not a member of any organizations yet.
      </p>
    </UCard>

    <!-- Active Organization Details -->
    <UCard v-if="activeOrg">
      <template #header>
        <div class="flex items-center gap-2">
          <UIcon
            name="i-lucide-building"
            class="size-5 text-primary"
          />
          <span class="font-semibold">Active: {{ activeOrg.name }}</span>
        </div>
      </template>

      <div class="flex flex-col gap-6">
        <!-- Members -->
        <div>
          <h3 class="font-medium mb-3">
            Members ({{ activeOrg.members?.length || 0 }})
          </h3>
          <div
            v-if="activeOrg.members?.length"
            class="flex flex-col gap-2"
          >
            <div
              v-for="member in activeOrg.members"
              :key="member.id"
              class="flex items-center justify-between p-3 rounded-lg border border-default"
            >
              <div class="flex items-center gap-3">
                <UAvatar
                  :alt="member.user.name"
                  size="sm"
                />
                <div class="flex flex-col">
                  <span class="font-medium">{{ member.user.name }}</span>
                  <span class="text-sm text-muted">{{ member.user.email }}</span>
                </div>
              </div>
              <UBadge :label="member.role" />
            </div>
          </div>
        </div>

        <!-- Invitations -->
        <div v-if="activeOrg.invitations?.length">
          <h3 class="font-medium mb-3">
            Pending Invitations
          </h3>
          <div class="flex flex-col gap-2">
            <div
              v-for="invite in activeOrg.invitations"
              :key="invite.id"
              class="flex items-center justify-between p-3 rounded-lg border border-default"
            >
              <div class="flex flex-col">
                <span class="font-medium">{{ invite.email }}</span>
                <span class="text-sm text-muted">Role: {{ invite.role }}</span>
              </div>
              <UBadge
                color="warning"
                :label="invite.status"
              />
            </div>
          </div>
        </div>

        <!-- Invite Member -->
        <div>
          <h3 class="font-medium mb-3">
            Invite Member
          </h3>
          <UForm
            :schema="inviteSchema"
            :state="inviteState"
            class="flex flex-col gap-4"
            @submit.prevent="(e) => handleInvite(e.data)"
          >
            <div class="flex gap-4">
              <UFormField
                name="email"
                label="Email"
                class="flex-1"
              >
                <UInput
                  v-model="inviteState.email"
                  type="email"
                  placeholder="user@example.com"
                  autocomplete="email"
                  class="w-full"
                />
              </UFormField>

              <UFormField
                name="role"
                label="Role"
              >
                <USelect
                  v-model="inviteState.role"
                  :items="[
                    { label: 'Member', value: 'member' },
                    { label: 'Admin', value: 'admin' },
                  ]"
                  class="w-32"
                />
              </UFormField>
            </div>

            <UButton
              type="submit"
              :loading="inviteLoading"
              label="Send Invitation"
            />
          </UForm>
        </div>
      </div>
    </UCard>
  </div>
</template>
