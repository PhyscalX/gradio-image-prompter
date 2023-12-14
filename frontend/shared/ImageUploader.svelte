<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { BlockLabel } from "@gradio/atoms";
  import { Image } from "@gradio/icons";
  import type { I18nFormatter } from "@gradio/utils";
  import { get_coordinates_of_clicked_image } from "./utils";
  import { ImagePaste, Upload as UploadIcon } from "@gradio/icons";
  import { Toolbar, IconButton } from "@gradio/atoms";

  import { Upload } from "@gradio/upload";
  import { type FileData, normalise_file } from "@gradio/client";
  import ClearImage from "./ClearImage.svelte";
  import BoxDrawer from "./BoxDrawer.svelte";

  const dispatch = createEventDispatcher();
  let box_drawer: BoxDrawer;

  export let value: null | FileData;
  export let points: null | number[][6];
  export let label: string | undefined = undefined;
  export let show_label: boolean;

  function handle_image_load(event: Event) {
    const element = event.currentTarget as HTMLImageElement;
    box_drawer.width = element.width;
    box_drawer.height = element.height;
    box_drawer.natural_width = element.naturalWidth;
    box_drawer.natural_height = element.naturalHeight;
    box_drawer.resize_canvas();
  }

  function handle_points_change({ detail }: { detail: number[][6] }) {
    points = detail;
    dispatch("points_change", detail);
  }

  export let sources: ("clipboard" | "upload")[] = ["upload", "clipboard"];
  export let streaming = false;
  export let root: string;
  export let i18n: I18nFormatter;

  let upload: Upload;
  let uploading = false;
  export let active_tool: "webcam" | null = null;

  function handle_upload({ detail }: CustomEvent<FileData>): void {
    value = normalise_file(detail, root, null);
    dispatch("upload", detail);
  }

  $: if (uploading) value = null;
  $: value && !value.url && (value = normalise_file(value, root, null));

  let dragging = false;
  $: dispatch("drag", dragging);

  function handle_click(evt: MouseEvent): void {
    let coordinates = get_coordinates_of_clicked_image(evt);
    if (coordinates) {
      dispatch("select", { index: coordinates, value: null });
    }
  }

  const sources_meta = {
    upload: {
      icon: UploadIcon,
      label: i18n("Upload"),
      order: 0,
    },
    clipboard: {
      icon: ImagePaste,
      label: i18n("Paste"),
      order: 2,
    },
  };

  $: sources_list = sources.sort(
    (a, b) => sources_meta[a].order - sources_meta[b].order,
  );

  async function handle_toolbar(
    source: (typeof sources)[number],
  ): Promise<void> {
    switch (source) {
      case "clipboard":
        navigator.clipboard.read().then(async (items) => {
          for (let i = 0; i < items.length; i++) {
            const type = items[i].types.find((t) => t.startsWith("image/"));
            if (type) {
              value = null;
              items[i].getType(type).then(async (blob) => {
                const f = await upload.load_files([
                  new File([blob], `clipboard.${type.replace("image/", "")}`),
                ]);
                f;
                value = f?.[0] || null;
              });
              break;
            }
          }
        });
        break;
      case "upload":
        upload.open_file_upload();
        break;
      default:
        break;
    }
  }
</script>

<BlockLabel {show_label} Icon={Image} label={label || "Image"} />

<div data-testid="image" class="image-container">
  {#if value?.url}
    <ClearImage
      on:remove_box={() => {
        box_drawer.undo();
      }}
      on:remove_boxes={() => {
        box_drawer.clear();
      }}
      on:remove_image={() => {
        value = null;
        dispatch("clear");
      }}
    />
  {/if}
  <div class="upload-container">
    <Upload
      hidden={value !== null || active_tool === "webcam"}
      bind:this={upload}
      bind:uploading
      bind:dragging
      filetype="image/*"
      on:load={handle_upload}
      on:error
      {root}
      disable_click={!sources.includes("upload")}
    >
      {#if value === null && !active_tool}
        <slot />
      {/if}
    </Upload>
    {#if value !== null && !streaming}
      <!-- svelte-ignore a11y-click-events-have-key-events-->
      <!-- svelte-ignore a11y-no-noninteractive-element-interactions-->
      <img
        src={value.url}
        alt={value.alt_text}
        on:click={handle_click}
        on:load={handle_image_load}
      />
      <BoxDrawer bind:this={box_drawer} on:change={handle_points_change} />
    {/if}
  </div>
  {#if sources.length > 1 || sources.includes("clipboard")}
    <Toolbar show_border={!value?.url}>
      {#each sources_list as source}
        <IconButton
          on:click={() => handle_toolbar(source)}
          Icon={sources_meta[source].icon}
          size="large"
          label="{source}-image-toolbar-btn"
          padded={false}
        />
      {/each}
    </Toolbar>
  {/if}
</div>

<style>
  img {
    width: var(--size-full);
    height: var(--size-full);
  }

  .upload-container {
    height: 100%;
    flex-shrink: 1;
    max-height: 100%;
  }

  .image-container {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    max-height: 100%;
  }
</style>
