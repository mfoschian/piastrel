<template>
	<div class="person">
		<span class="name">{{ item.last_name }} {{ item.first_name }}</span>
	</div>	
</template>

<script>
export default {
	props: {
		item: { type: Object, required: true }
	}
}
</script>