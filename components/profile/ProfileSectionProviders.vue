<script lang="ts" setup>
import type { FetchError } from "ofetch";

const { user } = useUserSession();

const isTwitchConnected = computed(() => Boolean(user.value?.twitchId));
const isGithubConnected = computed(() => Boolean(user.value?.githubId));

const { fetch: fetchUserSession } = useUserSession();

async function disconnect(providerName: "github" | "twitch") {
  try {
    await $fetch(`/api/me/providers/${providerName}`, {
      method: "DELETE",
    });

    await fetchUserSession();

    useSuccessToast(`Disconnected from ${providerName}`);
  } catch (error) {
    console.error(error);
    useErrorToast(
      "An error occurred while disconnecting from the provider",
      (error as FetchError).data.message,
    );
  }
}
</script>

<template>
  <ProfileSection
    :title="$t('authentication')"
    :description="$t('access-to-your-account-using-another-provider')"
  >
    <UCard class="grow">
      <p>
        {{
          $t(
            "link-one-or-more-of-the-following-providers-to-your-account-to-access-it-using-them",
          )
        }}
      </p>

      <div class="mt-4 flex flex-row gap-4">
        <UButton
          color="gray"
          :to="isGithubConnected ? undefined : '/auth/github'"
          external
          icon="i-simple-icons-github"
          @click="isGithubConnected ? disconnect('github') : undefined"
        >
          {{ user?.githubId ? $t("remove-connection") : $t("connect-github") }}
        </UButton>
        <UButton
          color="gray"
          :to="isTwitchConnected ? undefined : '/auth/twitch'"
          external
          icon="i-simple-icons-twitch"
          @click="isTwitchConnected ? disconnect('twitch') : undefined"
        >
          {{ user?.twitchId ? $t("remove-connection") : $t("connect-twitch") }}
        </UButton>
      </div>
    </UCard>
  </ProfileSection>
</template>
