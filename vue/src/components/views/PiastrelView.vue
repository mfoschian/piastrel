<template>
	<ConvocationsBox :event_id="event.id" :read_only="read_only"
	@openSearchBox="emits('openSearchBox')"
	@details="emits('details', $event)"
	/>
	
	<BucketsBox @details="emits('details', $event)" :read_only="read_only" />
	
	<RejectedBox @details="emits('details', $event)" :read_only="read_only" />	
</template>

<script>
  export default {
    // name: 'CustomName',
    inheritAttrs: false
    // customOptions: {},
  }
</script>

<script setup>
import BucketsBox from '../BucketsBox.vue'
import ConvocationsBox from '../ConvocationsBox.vue'
import RejectedBox from '../RejectedBox.vue'


const emits = defineEmits(['details', 'openSearchBox']);
const props = defineProps({
	event: { type: Object, required: true },
	read_only: { type: Boolean, default: false }
});
</script>