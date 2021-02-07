<template>
  <div class="hello">
    <div class="container is-fluid">
      <div class="columns ">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h3>ยอดผู้ติดเชื้อสะสมภายในประเทศ</h3>
                <h1>
                  <span class="icon">
                    <i style="color:#000" class="fas fa-user"></i>
                  </span>
                  <strong>{{ this.today["Confirmed"] }}</strong>
                </h1>
                <footer class="card-footer footer-info ">
                  ({{ this.transformDataToday(this.today["NewConfirmed"]) }})
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="container is-fluid">
      <div class="columns ">
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h3>รักษาหายแล้ว</h3>
                <h1>
                  <span class="icon">
                    <i class="fas fa-hand-holding-medical"></i>
                  </span>
                  <strong>{{ this.today["Recovered"] }}</strong>
                </h1>
                <footer class="card-footer footer-info ">
                  ({{ this.transformDataToday(this.today["NewRecovered"]) }})
                </footer>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h3>กำลังรักษา</h3>
                <h1>
                  <span class="icon">
                    <i class="fas fa-hospital"></i>
                  </span>
                  <strong>{{ this.today["Hospitalized"] }}</strong>
                </h1>
                <footer class="card-footer">
                  ({{ this.transformDataToday(this.today["NewHospitalized"]) }})
                </footer>
              </div>
            </div>
          </div>
        </div>
        <div class="column">
          <div class="card">
            <div class="card-content">
              <div class="content">
                <h3>เสียชีวิต</h3>
                <h1>
                  <span class="icon">
                    <i class="fas fa-book-dead"></i>
                  </span>
                  <strong>{{ this.today["Deaths"] }}</strong>
                </h1>
                <footer class="card-footer">
                  ({{ this.transformDataToday(this.today["NewDeaths"]) }})
                </footer>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="columns ">
      <div class="column">
        <p class="info">อัพเดตข้อมูลล่าสุด {{ this.today["UpdateDate"] }}</p>
      </div>
    </div>
    <div class="container is-fluid">
      <vue-frappe
        id="covid"
        :labels="this.result[index]['labels']"
        title="COVID-19 TH REPORT"
        type="axis-mixed"
        :tooltipOptions="this.config['tooltipOptions']"
        :height="300"
        :colors="['red', 'blue', 'light-blue']"
        :dataSets="this.result[index]['data']"
      >
      </vue-frappe>
      <br />
      <div class="columns ">
        <div class="column">
          <div class="field  center">
            <button
              class="button is-link is-light"
              v-on:click="prv_mo()"
              :disabled="this.isDisabledPrevious_"
            >
              เดือนก่อนหน้า
            </button>
            <button class="button panel" disabled>
              {{ this.result[index - 1]["date"][0] }}
            </button>
            <button
              class="button is-link is-light"
              v-on:click="next_mo()"
              :disabled="this.isDisabledNext_"
            >
              เดือนถัดไป
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      config: {
        tooltipOptions: {
          formatTooltipX: d => "วันที่ " + d,
          formatTooltipY: d => d + " ราย"
        },
        valuesOverPoints: 1 // default: 0
      },
      today: {
        Confirmed: 0,
        Recovered: 0,
        Hospitalized: 0,
        Deaths: 0,
        NewConfirmed: 0,
        NewRecovered: 0,
        NewHospitalized: 0,
        NewDeaths: 0,
        UpdateDate: "",
        Source: "",
        DevBy: "",
        SeverBy: ""
      },
      result: [
        {
          date: [],
          labels: [],
          data: [
            {
              name: null,
              chartType: "bar",
              values: []
            }
          ]
        }
      ],
      index: 14
    };
  },
  created() {
    // GET request using axios with set headers
    Promise.all([this.getHistory(), this.getToday()]).then(values => {
      //first return value
      this.result = transformDataMonhtly(values[0].data);
      this.today = values[1].data;
      this.index = len(this.result);
    });
  },
  computed: {
    isDisabledNext_: function() {
      return this.index == this.result.length - 1 ? true : false;
    },
    isDisabledPrevious_: function() {
      return this.index == 1 ? true : false;
    }
  },
  methods: {
    async getHistory() {
      const response = await axios.get(
        "https://covid19.th-stat.com/api/open/timeline",
        {}
      );
      return response;
    },
    async getToday() {
      const response = await axios.get(
        "https://covid19.th-stat.com/api/open/today",
        {}
      );
      return response;
    },
    getXlabel: function(data) {
      console.log(data);
      return data;
    },
    next_mo: function() {
      if (this.index < this.result.length) {
        this.index = this.index + 1;
      }
    },

    prv_mo: function() {
      if (this.index > 0) {
        this.index = this.index - 1;
      }
    },
    transformDataToday: function(data) {
      var result = "";
      if (data > 0) {
        result = "+";
      }
      return result + data.toString();
    }
  }
};

function transformDataMonhtly(data) {
  let newConfirmed = [];
  let newRecovered = [];
  let date = [];
  let labels = [];
  let result = [];
  let key = [];
  let val = [];
  let curr_mo = "";
  let pev_mo = "";
  let total = data.Data.length - 1;
  let j = 0;
  for (let i in data.Data) {
    curr_mo = data.Data[i].Date.substring(0, 2);
    if (pev_mo != curr_mo) {
      val = [
        { name: "ผู้ป่วยใหม่", chartType: "line", values: newConfirmed },
        { name: "รักษาหายแล้ว", chartType: "line", values: newRecovered }
      ];
      date.push(
        month_nm(
          data.Data[i].Date.substring(0, 2) +
            " " +
            data.Data[i].Date.substring(6, 12)
        )
      );

      result.push({ date: date, labels: labels, data: val });
      labels = [];
      date = [];
      newConfirmed = [];
      newRecovered = [];
      pev_mo = curr_mo;
      j = i;
    }
    labels.push(data.Data[i].Date.substring(3, 5));
    newConfirmed.push(data.Data[i].NewConfirmed);
    newRecovered.push(data.Data[i].NewRecovered);
  }

  let currMonthEnd = new Date(
    parseInt(data.Data[j].Date.substring(6, 11)),
    parseInt(data.Data[j].Date.substring(0, 2)),
    0
  );
  let day = 0;
  let totol_day = data.Data.length + parseInt(currMonthEnd.getDate());
  for (let i = j; i < data.Data.length; i++) {
    labels.push(data.Data[i].Date.substring(3, 5));
    date.push(
      month_nm(
        data.Data[i].Date.substring(0, 2) +
          " " +
          data.Data[i].Date.substring(6, 12)
      )
    );
    newConfirmed.push(data.Data[i].NewConfirmed);
    newRecovered.push(data.Data[i].NewRecovered);

    day = data.Data[i].Date.substring(3, 5);
  }
  for (let i = parseInt(day); i < parseInt(currMonthEnd.getDate()); i++) {
    if (i < 10) {
      day = "0" + i.toString();
    } else {
      day = i.toString();
    }
    newConfirmed.push(0);
    newRecovered.push(0);
    labels.push(day);
    date.push(
      month_nm(
        data.Data[j].Date.substring(0, 2) +
          " " +
          data.Data[j].Date.substring(6, 12)
      )
    );
  }
  val = [
    { name: "ผู้ป่วยใหม่", chartType: "line", values: newConfirmed },
    { name: "รักษาหายแล้ว", chartType: "line", values: newRecovered }
  ];
  result.push({ date: date, labels: labels, data: val });
  return result;
}

function month_nm(data) {
  var m = "";
  var y = "";
  switch (data.substring(2, 0)) {
    case "01":
      m = "มกราคม";
      break;
    case "02":
      m = "กุมภาพันธ์";
      break;
    case "03":
      m = "มีนาคม";
      break;
    case "04":
      m = "เมษายน";
      break;
    case "05":
      m = "พฤษภาคม";
      break;
    case "06":
      m = "มิถุนายน";
      break;
    case "07":
      m = "กรกฎาคม";
      break;
    case "08":
      m = "สิงหาคม";
      break;
    case "09":
      m = "กันยายน";
      break;
    case "10":
      m = "ตุลาคม";
      break;
    case "11":
      m = "พฤศจิกายน";
      break;
    case "12":
      m = "ธันวาคม";
      break;
  }
  return m + " " + (parseInt(data.substring(7, 2)) + 543).toString();
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h1,
h2,
h3,
p {
  font-weight: normal;
  color: #000;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
.info {
  text-align: justify; /* For Edge */
  -moz-text-align-last: right; /* For Firefox prior 58.0 */
  text-align-last: right;
  margin-right: 3em;
  color: gray;
  font-size: 0.75em;
}
.card-footer {
  display: block;
  border-top: 1px solid #ededed;
}
.button {
  min-width: 8em;
}

.panel {
  min-width: 10em;
}

.confirmed {
  border: 20px coral;
  border: coral;
  border-radius: 1em;
  margin: 0.5em;
  width: 100%;
}

.recovered {
  min-width: 12em;
  background: rgba(218, 234, 255, 0.329);
  border-radius: 1em;
  margin: 0.5em;
}

.hospitalized {
  min-width: 12em;
  background: rgba(218, 234, 255, 0.329);
  border: 1em;
  border-radius: 1em;
  border-color: lightblue;
  margin: 0.5em;
}
.title {
  color: import#fff;
  font-size: 1em;
}
.deaths {
  min-width: 12em;
  background: rgba(218, 234, 255, 0.329);
  border-radius: 1em;
  margin: 0.5em;
}
</style>
