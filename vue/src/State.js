import { ref } from "vue"

let State = {
	active_event: ref(null),
	buckets: ref([]),
	convocations: ref([]),

	load_message: ref(""),
	loaded: ref(false)
}

export default {
	get() {
		return State;
	}
}