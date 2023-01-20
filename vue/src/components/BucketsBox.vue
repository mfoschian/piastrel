<template>
	<div class="buckets" >
		<div class="bucket" v-for="b in sorted_buckets" :key="b.id"
			@dragover="dropcheck"
			@drop="dropped($event, b.id)"
		>
			<div class="title" :title="b.address">
				<div class="bnumber">N. {{ b.number }}</div>
				<div>
					{{  b.name }}
					<template v-if="b.name_slo">
						<br><span class="sloname">{{  b.name_slo }}</span>
					</template>
				</div>
			</div>
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
import { startNumber } from '../libs/utils'

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
			const sort_cmp = (a,b) => a > b ? 1 : a < b ? -1 : 0;

			let res = b.sort( (b1,b2) => {
				let n1 = startNumber(b1.number);
				let n2 = startNumber(b2.number);
				if( !isNaN(n1) && !isNaN(n2) )
					return sort_cmp(n1,n2);
				else
					return sort_cmp(b1.number, b2.number);
			});
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
			display: flex;
			flex-direction: row;
			gap: 0.5rem;
			align-items: center;

			.bnumber {
				font-weight: bold;
				padding-right: 0.5rem;
				border-right: 1px solid var(--fourth-col);
			}

			.sloname {
				font-style: italic;
			}
		}
	}
}
</style>