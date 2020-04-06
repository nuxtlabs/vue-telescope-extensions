<template>
  <div>
    <pre>{{ data }}</pre>
  </div>
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState(['data'])
}
</script>

<style>
</style>