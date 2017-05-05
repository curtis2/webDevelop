/**
 * Created by 3020mt on 2017/4/24.
 */
var Student= {
    name: "roboot",
    height: 1.2,
    run: function () {
        console.log(this.name + "is running...")
    }
}

var xiaoming={
    name:"小明"
}

xiaoming.__proto__=Student;

xiaoming.name;
xiaoming.run();