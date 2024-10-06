<script lang="ts" setup>
import type { FetchError } from "ofetch";
const { t } = useI18n();

const isOpen = ref(false);
const isLoading = ref(false);

function askConfirmation() {
  isOpen.value = true;
}

function closeConfirmation() {
  isOpen.value = false;
}

const { session } = useUserSession();

async function onDeleteAccount() {
  isLoading.value = true;

  try {
    await $fetch("/api/me", {
      method: "DELETE",
    });

    await $fetch("/api/_auth/session", {
      method: "DELETE",
    });

    session.value = {};

    useSuccessToast(t("account-deleted-successfully"));

    await navigateTo("/");
  } catch (error) {
    console.error(error);
    useErrorToast(
      t("an-error-occurred-while-deleting-your-account"),
      (error as FetchError).data.message,
    );
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <ProfileSection
    :title="$t('delete-account')"
    :description="$t('permanently-delete-your-account')"
  >
    <UCard>
      <p>
        {{
          $t(
            "deleting-your-account-is-irreversible-all-your-data-will-be-lost-are-you-sure-you-want-to-delete-your-account",
          )
        }}
      </p>
      
      <UButton class="mt-4" color="red" @click="askConfirmation">
        {{ $t("delete-account") }}
      </UButton>
    </UCard>

    <UModal v-model="isOpen">
      <UCard :ui="{ footer: { base: 'flex justify-end' } }">
        <template #header>
          <h2 class="text-lg font-semibold">
            {{ $t("confirm-account-deletion") }}
          </h2>
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">
            {{
              $t(
                "this-action-is-irreversible-and-will-delete-all-your-data-permanently",
              )
            }}
          </p>
        </template>

        <template #footer>
          <UButton color="black" variant="ghost" @click="closeConfirmation()">
            {{ $t("cancel") }}
          </UButton>
          <UButton color="red" :loading="isLoading" @click="onDeleteAccount()">
            {{ $t("confirm") }}
          </UButton>
        </template>
      </UCard>
    </UModal>
  </ProfileSection>
</template>
