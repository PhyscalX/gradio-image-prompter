<script lang="ts">
  import { createEventDispatcher } from "svelte";
  import { IconButton } from "@gradio/atoms";
  import { Undo, Erase, Clear } from "@gradio/icons";

  const dispatch = createEventDispatcher();
</script>

<div>
  <IconButton
    Icon={Undo}
    label="Remove Last Box"
    on:click={(event) => {
      dispatch("remove_box");
      event.stopPropagation();
    }}
  />

  <IconButton
    Icon={Erase}
    label="Remove All boxes"
    on:click={(event) => {
      dispatch("remove_boxes");
      event.stopPropagation();
    }}
  />

  <IconButton
    Icon={Clear}
    label="Remove Image"
    on:click={(event) => {
      dispatch("remove_image");
      event.stopPropagation();
    }}
  />
</div>

<style>
  div {
    display: flex;
    position: absolute;
    top: var(--size-2);
    right: var(--size-2);
    justify-content: flex-end;
    gap: var(--spacing-sm);
    z-index: var(--layer-5);
  }
</style>
