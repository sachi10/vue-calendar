<template>
  <v-row class="fill-height">
    <v-col>
      <v-sheet height="64">
        <v-toolbar flat color="white">
          <v-btn outlined class="mr-4" color="grey darken-2" @click="setView">
            {{ View }}
          </v-btn>
          <v-spacer></v-spacer>
          <v-btn fab text color="grey darken-2" @click="prev">
            <v-icon small>mdi-chevron-left</v-icon>
          </v-btn>
          <v-toolbar-title>{{ title }}</v-toolbar-title>
          <v-btn fab text color="grey darken-2" @click="next">
            <v-icon small>mdi-chevron-right</v-icon>
          </v-btn>
          <v-spacer></v-spacer>
        </v-toolbar>
      </v-sheet>
      <v-sheet height="600">
        <v-calendar
          ref="calendar"
          v-model="focus"
          color="primary"
          :events="events"
          :event-color="getEventColor"
          :now="today"
          :type="type"
          :weekdays="weekdays"
          @click:event="showEvent"
          @click:more="viewDay"
          @click:date="viewDay"
          @change="updateRange"
        ></v-calendar>
        <v-menu
          v-model="selectedOpen"
          :close-on-content-click="false"
          :activator="selectedElement"
          offset-x
        >
          <v-card
            color="grey lighten-4"
            min-width="350px"
            flat
          >
            <v-toolbar
              :color="selectedEvent.color"
              dark
            >
              <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn icon>
                <v-icon>mdi-heart</v-icon>
              </v-btn>
              <v-btn icon>
                <v-icon>mdi-dots-vertical</v-icon>
              </v-btn>
            </v-toolbar>
            <v-card-text>
              <span v-html="selectedEvent.details"></span>
            </v-card-text>
            <v-card-actions>
              <v-btn
                text
                color="secondary"
                @click="selectedOpen = false"
              >
                Cancel
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
      </v-sheet>
    </v-col>
  </v-row>
</template>

<script>
export default {
    data: () => ({
        today : new Date().toISOString().substr(0,10),
        focus : new Date().toISOString().substr(0,10),
        type : "month",
        typeToLabel : {
            month : "Month",
            day : "Day",
        },
        name: null,
        View: "Today",
        details: null,
        start: null,
        end: null,
        month: null,
        year: null,
        day: null,
        weekdays: [1,2,3,4,5,6,0],
        color: "#000000",
        currentlyEditing : null,
        selectedEvent : {},
        selectedElement : null,
        selectedOpen : false,
        events:[
            {
                name : "Pay Day",
                details : "Monthly payment day",
                start : "2020-04-25",
                end : "2020-04-25",
                color : "#00ffff"
            },
            {
                name : "Test Event 2",
                details : "test test",
                start : "2020-04-22",
                end : "2020-04-26",
                color : "#ffff00"
            },
            {
                name : "Test Event 3",
                details : "test test",
                start : "2020-04-21",
                end : "2020-04-22",
                color : "#ff00ff"
            },
        ],
        dialog: false,
    }),
    /* eslint-disable */
    computed: {
      title () {
        const { start, end } = this
        if (!start || !end) {
          return ''
        }

        this.month = this.monthFormatter(start)
        this.year = start.year
        this.day = start.day + this.nth(start.day)

        switch (this.type) {
          case 'month':
            return `${this.month} ${this.year}`
          case 'day':
            return `${this.month} ${this.day} ${this.year}`
        }
        return ''
      },

      monthFormatter () {
        return this.$refs.calendar.getFormatter({
          timeZone: 'UTC', month: 'long',
        })
      },
    },
    /* eslint-enable */
    mounted() {
        this.$refs.calendar.checkChange();
    },
    methods: {
      viewDay ({ date }) {
        this.focus = date
        this.type = 'day'
      },
      getEventColor (event) {
        return event.color
      },
      setView () {
        if(this.type == 'month'){
          this.type = 'day'
          this.View = 'Month'
        }
        else{
          this.type = 'month'
          this.View = 'Today'
        }
      },
      prev () {
        this.$refs.calendar.prev()
      },
      next () {
        this.$refs.calendar.next()
      },
      showEvent ({ nativeEvent, event }) {
        const open = () => {
          this.selectedEvent = event
          this.selectedElement = nativeEvent.target
          setTimeout(() => this.selectedOpen = true, 10)
        }

        if (this.selectedOpen) {
          this.selectedOpen = false
          setTimeout(open, 10)
        } else {
          open()
        }

        nativeEvent.stopPropagation()
      },
      updateRange ({ start, end }) {
        // Call the event Api
        this.events = this.fetchEvents(this.month, this.year);
        this.start = start;
        this.end = end;
      },
      nth (d) {
        return d > 3 && d < 21
          ? 'th'
          : ['th', 'st', 'nd', 'rd', 'th', 'th', 'th', 'th', 'th', 'th'][d % 10]
      },
      rnd (a, b) {
        return Math.floor((b - a + 1) * Math.random()) + a
      },
      formatDate (a, withTime) {
        return withTime
          ? `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()} ${a.getHours()}:${a.getMinutes()}`
          : `${a.getFullYear()}-${a.getMonth() + 1}-${a.getDate()}`
      },
      fetchEvents (month, year) {
        const body = {
          month,
          year
        }
        let events = []; 
        this.$http.post('api/holidays', body)
          .then( res =>{ 
              for (let index = 0; index < res.data.data.length; index++) {
                 const obj = {
                   name : res.data.data[index][1],
                   start : res.data.data[index][2],
                   end : res.data.data[index][3],
                   details : res.data.data[index][4],
                   color : "#462255",
                 }
                 events.push(obj); 
              }
            }
          )
          .catch(err => console.log(err));
        return events;  
      }
    },
}
</script>