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
    <br />
    <div class="columns ">
      <div class="column">
        <p class="info">อัพเดตข้อมูลล่าสุด {{ this.today["UpdateDate"] }}</p>
      </div>
    </div>
    <br />
    <div class="container is-fluid">
      <vue-frappe
        id="test"
        :labels="this.result[index]['labels']"
        title="COVID-19 TH REPORT"
        type="axis-mixed"
        :height="300"
        :colors="['red', '#ffa3ef', 'light-blue']"
        :dataSets="this.result[index]['data']"
      >
      </vue-frappe>
      <br />
      <div class="columns ">
        <div class="column">
          <div class="field  center">
            <button class="button is-link is-light" v-on:click="prv_mo()">
              ก่อนหน้า
            </button>
            <button class="button panel" disabled>
              {{ this.result[index - 1]["date"][0] }}
            </button>
            <button class="button is-link is-light" v-on:click="next_mo()">
              ถัดไป
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
      index: 13
    };
  },
  created() {
    // GET request using axios with set headers
    Promise.all([this.getHistory(), this.getToday()]).then(values => {
      //first return value
      this.result = transformData(values[0].data);
      this.today = values[1].data;
    });
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
    next_mo: function() {
      this.index = this.index + 1;
      console.log(this.index);
    },
    prv_mo: function() {
      this.index = this.index - 1;
      // console.log(this.index)
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

function transformData(data) {
  var newConfirmed = [];
  var date = [];
  var labels = [];
  var result = [];
  let key = [];
  var val = {};
  var curr_mo = "";
  var pev_mo = data.Data[0].Date.substring(0, 2);
  var total = data.Data.length - 1;
  for (var i in data.Data) {
    curr_mo = data.Data[i].Date.substring(0, 2);
    if (pev_mo != curr_mo || total == i) {
      val = [
        { name: "ผู้ป่วยใหม่ยืนยัน", chartType: "bar", values: newConfirmed }
      ];
      if (total != i) {
        date.push(
          month_nm(
            data.Data[i].Date.substring(0, 2) +
              " " +
              data.Data[i].Date.substring(12, 6)
          )
        );
      }
      result.push({ date: date, labels: labels, data: val });
      labels = [];
      date = [];
      newConfirmed = [];
      pev_mo = curr_mo;
    }
    labels.push(data.Data[i].Date.substring(5, 3));
    newConfirmed.push(data.Data[i].NewConfirmed);
  }
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

.deaths {
  min-width: 12em;
  background: rgba(218, 234, 255, 0.329);
  border-radius: 1em;
  margin: 0.5em;
}
</style>
