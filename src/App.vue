<template>
  <v-app>
    <v-content>
      <Calendar />
    </v-content>
  </v-app>
</template>

<script>
import Calendar from './components/calendar';

export default {
  name: 'App',

  components: {
    Calendar,
  },

  data: () => ({
    //
  }),
};
</script>
