<template>
	<form class="p-3 m-3"
		action='/upload/persons'
		method='post' encType="multipart/form-data"
		id='uploadPersonForm'
	>
		<input type="file" name="personsFile" 
			class="form-control"
		/>
		<button class="btn btn-success" type='submit'>Carica</button>
	</form>
</template>