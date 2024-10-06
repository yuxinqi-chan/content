<script lang="ts" setup>
import { type FetchError } from "ofetch";
import type { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

const { user, fetch: fetchUserSession } = useUserSession();

async function onFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (!file) return;

  const formData = new FormData();
  formData.append("file", file);

  try {
    await $fetch("/api/me/profile-pictures", {
      method: "PUT",
      body: formData,
    });

    await fetchUserSession();
  } catch (error) {
    console.error(error);
    useErrorToast(
      "An error occurred while uploading your profile picture",
      (error as FetchError).data?.message,
    );
  }
}

async function removeAvatar() {
  try {
    await $fetch("/api/me/profile-pictures", {
      method: "DELETE",
    });

    await fetchUserSession();
  } catch (error) {
    console.error(error);
    useErrorToast(
      "An error occurred while removing your profile picture",
      (error as FetchError).data.message,
    );
  }
}

const fileInput = ref<HTMLInputElement | null>(null);
function triggerFileInput() {
  if (fileInput.value) fileInput.value.click();
}

const state = reactive({
  email: user.value?.email,
  name: user.value?.name,
});

type Schema = z.output<typeof patchUserValidator>;

async function onSubmitProfileInformation(event: FormSubmitEvent<Schema>) {
  try {
    await $fetch("/api/me", {
      method: "PATCH",
      body: event.data,
    });

    await fetchUserSession();

    useSuccessToast("Profile information updated successfully");
  } catch (error) {
    console.error(error);
    useErrorToast(
      "An error occurred while updating your profile information",
      (error as FetchError).data.message,
    );
  }
}
</script>

<template>
  <ProfileSection
    :title="$t('profile-information')"
    :description="
      $t('update-your-accounts-profile-information-and-email-address')
    "
  >
    <div class="grow space-y-8">
      <UCard v-if="user">
        <div class="flex justify-start">
          <div class="flex flex-col items-center gap-4">
            <div class="group relative h-20 w-20">
              <AppAvatar size="3xl" :src="user.avatar" />

              <label
                class="group-hover:border-primary absolute inset-0 flex cursor-pointer items-center justify-center rounded-full border border-dashed border-transparent text-sm font-semibold text-transparent transition-all ease-in group-hover:bg-gray-700/50 group-hover:text-gray-200 group-hover:backdrop-blur"
              >
                {{ $t("edit") }}
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  hidden
                  @change="onFileChange($event)"
                />
              </label>
            </div>

            <div class="flex flex-row gap-4">
              <UButton v-if="user.avatar" color="gray" @click="removeAvatar()">
                {{ $t("remove") }}
              </UButton>
              <UButton v-else color="gray" @click="triggerFileInput()">
                {{ $t("upload") }}
              </UButton>
            </div>
          </div>
        </div>
      </UCard>

      <UCard>
        <UForm
          class="space-y-4"
          :state
          :schema="patchUserValidator"
          @submit="onSubmitProfileInformation"
        >
          <div class="max-w-sm space-y-4">
            <UFormGroup :label="$t('Email')" name="email">
              <UInput v-model="state.email" required />
            </UFormGroup>
            <p
              v-if="!user?.verifiedAt"
              class="text-sm text-red-500 dark:text-red-400"
            >
              {{ $t("your-email-address") }} '{{ user?.emailToVerify }}'
              {{
                $t(
                  "is-not-verified-please-check-your-inbox-for-the-verification-email-before-continuing-to-use-the-application",
                )
              }}
            </p>

            <UFormGroup :label="$t('Nickname')" name="name">
              <UInput v-model="state.name" required />
            </UFormGroup>
          </div>

          <div class="flex flex-row justify-end">
            <UButton type="submit" color="primary"> {{ $t("save") }} </UButton>
          </div>
        </UForm>
      </UCard>
    </div>
  </ProfileSection>
</template>
