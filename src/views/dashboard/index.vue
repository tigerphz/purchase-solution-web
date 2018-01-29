<template>
  <div class="dashboard-container">
    主页
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  name: 'dashboard',
  components: {},
  data() {
    return {
    }
  },
  computed: {
    ...mapGetters([
      'roles'
    ])
  },
  created() {
  }
}
</script>
