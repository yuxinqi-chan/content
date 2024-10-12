<script setup lang="ts">
import { withoutTrailingSlash, joinURL } from "ufo";
import type { BlogPost } from "~/types";

const route = useRoute();

const { data: blog } = await useAsyncData(route.path, () =>
  queryContent<BlogPost>(route.path).findOne(),
);
if (!blog.value) {
  throw createError({
    statusCode: 404,
    statusMessage: "Post not found",
    fatal: true,
  });
}

const { data: surround } = await useAsyncData(
  `${route.path}-surround`,
  () =>
    queryContent("blogs")
      .where({ _extension: "md" })
      .without(["body", "excerpt"])
      .sort({ date: -1 })
      .findSurround(withoutTrailingSlash(route.path)),
  { default: () => [] },
);

const title = blog.value.head?.title || blog.value.title;
const description = blog.value.head?.description || blog.value.description;

useSeoMeta({
  title,
  ogTitle: title,
  description,
  ogDescription: description,
});

if (blog.value.image?.src) {
  const site = useSiteConfig();

  useSeoMeta({
    ogImage: joinURL(site.url, blog.value.image.src),
    twitterImage: joinURL(site.url, blog.value.image.src),
  });
} else {
  defineOgImageComponent("Blog", {
    title,
    description,
    headline: "Blog",
  });
}
</script>
<template>
  <UContainer v-if="blog">
    <PageHeader :title="blog.title" :description="blog.description">
      <template #headline>
        <UBadge v-bind="blog.badge" variant="subtle" />
        <span class="text-gray-500 dark:text-gray-400">&middot;</span>
        <time class="text-gray-500 dark:text-gray-400">{{
          new Date(blog.date).toLocaleDateString($i18n.locale, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })
        }}</time>
      </template>

      <div class="mt-4 flex flex-wrap items-center gap-3">
        <UButton
          v-for="(author, index) in blog.authors"
          :key="index"
          :to="author.to"
          color="white"
          target="_blank"
          size="sm"
        >
          <UAvatar v-bind="author.avatar" :alt="author.name" size="2xs" />

          {{ author.name }}
        </UButton>
      </div>
    </PageHeader>
    <Page>
      <PageBody prose v-viewer>
        <ContentRenderer v-if="blog && blog.body" :value="blog" />
        <hr v-if="surround?.length" />
        <ContentSurround :surround="surround" />
        <Comment class="mt-4" :reply-to="`blogs:${blog._id}`" />
      </PageBody>

      <template #right>
        <ContentToc
          v-if="blog.body && blog.body.toc"
          :links="blog.body.toc.links"
          :title="$t('Table of Contents')"
        />
      </template>
    </Page>
  </UContainer>
</template>
