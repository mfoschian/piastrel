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
<!-- 
		<a href="#">
			<img src="icons/home.svg" title="About" alt="About" >
			<span class="label">About</span>
		</a>
		<a href="#">
			<img src="icons/bookmark.svg" title="Services" alt="Services">
			<span class="label">Services tutti a casa sempre</span>
		</a>
		<a href="#">
			<img src="icons/group.svg" title="Clients" alt="Clients">
			<span class="label">Clients</span>
		</a>
		<a href="#">
			<img src="icons/contact.svg" title="Contact" alt="Contact">
			<span class="label">Contact</span>
		</a> -->
	</div>
</template>

<script>
export default {
	props: {
		opened: { type: Boolean, default: true },
		items: { type: Array, default: () => [] }
	}
	// data() {
	// 	// return {
	// 	// 	opened: false
	// 	// }
	// }
}
</script>


<style scoped lang="scss">
/* The side navigation menu */
.sidenav {
	height: 100%;
	min-width: 15rem;
	position: fixed;
	z-index: 100;
	top: 0;
	right: 0;
	color: white;
	background-color: var(--second-col);
	border-left: 2px solid var(--fifth-col);
	overflow-x: hidden;
	// transition: 0.5s;
	// transition: width 1s 2s;
	/* 0.5 second transition effect to slide in the sidenav */
	display: none;

	&.opened {
		display: block;
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
