<template>
	<div class="sidenav"  :class="{ opened: opened }">
		<div class="closebtn"><i class="bi-x-circle" @click="$emit('close')" title="chiudi menu"></i>
		</div>

		<div class="menu-items">
			<div class="menu-item" v-for="item in items" :key="item.label"
				@click="$emit('selection', item.path )"
				:class="{active: item.active}"
				:title="item.tip"
			>
				<i class="menu-icon" :class="item.icon" ></i><span class="label">{{ item.label }}</span>
			</div>
		</div>
	</div>
</template>

<script>
export default {
	props: {
		opened: { type: Boolean, default: true },
		items: { type: Array, default: () => [] }
	}
}
</script>


<style scoped lang="scss">
/* The side navigation menu */
.sidenav {
	height: 100%;
	width: 15rem;
	position: fixed;
	z-index: 100;
	top: 0;
	right: -15em;
	color: white;
	background-color: var(--second-col);
	border-left: 2px solid var(--fifth-col);
	overflow-x: hidden;
	// transition: 0.5s;
	// transition: width 1s 2s;
	/* 0.5 second transition effect to slide in the sidenav */
	// display: none;
	transition: right 0.2s linear;
	// transition: right 0.2s cubic-bezier(.82,-0.43,.2,1.58);

	&.opened {
		// display: block;
		right: 0;
	}

	.closebtn {
		height: 2em;
		padding: 0.7em;
		font-size: 1.7em;
		text-align: center;

		:hover {
			font-weight: bold;
			color: var(--fifth-col);
			cursor: pointer;
		}


	}

	.menu-items {
		// padding: 8px 8px 8px 8px;
		margin-top: 1em;
		text-decoration: none;
		color: white;
		display: flex;
		flex-direction: column;
		flex-wrap: nowrap;
		// align-items: center;
		// transition: 0.3s;
		// width: 100vw;

		.menu-item {
			margin-left: 1em;
			margin-bottom: 0.7em;
			// padding: 1.5em;
			color: white;
			cursor: pointer;

			&.active {
				font-weight: bold;
				color: var(--fifth-col);
			}

			&:hover {
				color: var(--fifth-col);
				font-weight: bold;
				// background-color: rgb(106, 178, 236);
			}

			.menu-icon {
				margin-right: 1em;
			}
		}
	}
}

</style>
