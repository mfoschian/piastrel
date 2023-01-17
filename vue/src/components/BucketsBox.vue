<template>
	<div class="buckets" >
		<div class="bucket" v-for="b in sorted_buckets" :key="b.id"
			@dragover="dropcheck"
			@drop="dropped($event, b.id)"
		>
			<div class="title" :title="b.address">N.{{ b.number }} - {{  b.name }}</div>
			<div class="body">
				<ConvocatedPersonBox  v-for="c in assigned_to(b.id)" :key="c.id"
					:item="c" 
					:read_only="read_only"
					@details="$emit('details',$event)"
				/>
			</div>
		</div>
	</div>
</template>

<script>
import { Bucket } from '../models/Bucket'
import { Convocation } from '../models/Convocation'

import ConvocatedPersonBox from './ConvocatedPersonBox.vue'
import { dropcheck, dropped } from './ConvocatedPersonBox.vue'

import { computed } from 'vue'

export default {
	components: { ConvocatedPersonBox },
	emits: ['details'],
	props: {
		read_only: { type: Boolean, default: false }
	},
	async setup(props) {
		let buckets = Bucket.all(); // reactive

		const sorted_buckets = computed( () => {
			let b = buckets.value.concat([]);
			let res = b.sort( (b1,b2) => b1.number > b2.number ? 1 : b1.number < b2.number ? -1 : 0 );
			return res;
		});

		await Bucket.load();
		const assigned_to = (bid) => {
			return Convocation.inBucket(bid);
		};

		return {
			buckets,
			sorted_buckets,
			dropcheck,
			dropped,
			assigned_to
		}
	}
}
</script>

<style lang="scss" scoped>
.buckets {
	display: flex;
	flex-direction: row;
	flex-wrap: wrap;
	// justify-content: space-between;
	justify-content: flex-start;
	padding: 0.5rem;

	.bucket {
		flex-grow: 1;

		height: 10rem;
		min-width: 10rem;
		margin: 0.5rem;
		padding: 0.5em;
		border: 1px solid var(--fourth-col);
		border-radius: var(--bs-border-radius);
		// box-shadow: 3px 5px 2px rgba(0,0,0,0.94);
		box-shadow: 3px 3px 3px var(--fourth-col);

		.title {
			border-bottom: 1px solid var(--fourth-col);
			padding-bottom: 0.35rem;
			padding-left: 0.35rem;
		}
	}
}
</style>