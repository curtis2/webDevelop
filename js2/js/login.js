var app = {
    _init:function(){
        var that = this;
        window.rotation = 0;
        $(function () {
            //设置页面中的font-size字体
            /*$("html").css("fontSize",document.body.clientWidth /40);*/
             $(window).resize(infinite);
            function infinite() {
                var $html =  $('html');
                var htmlWidth =$html.width();
                var html_fontsize = document.body.clientWidth /40;
                $html.css({
                    "fontSize" :  html_fontsize + "px"
                });
                if(html_fontsize == parseInt(getComputedStyle($html[0]).fontSize)){
                    return;
                }
                else {
                    var t_fs = html_fontsize/(parseInt(getComputedStyle($html[0]).fontSize)/html_fontsize);
                    $html.css({
                        "fontSize" :t_fs+'px'
                    });
                }
            }
            infinite();
        })
        $.ajax({
        	type: "GET",
        	url: '../uclass.cfg',
        	dataType: "json",
        	async: false,
        	timeout: 300,
        	success: function(data){
        		that.Events.appConfig.setEdition(data.edition);
        		that.Events.appConfig.setHost(data.host);
        		that.Events.appConfig.setAppPath(data.host + data.path);
        	}
        });
        $('#rememberPwd').data('flag', true);
        $('#loginBtn').on('click', function() {
            var username = $('input[name="username"]').val();
            var password = $('input[name="password"]').val();
            if (username == "") {
                that.Events.showMsgDialog("请输入帐号");
            } else if (password == "") {
                that.Events.showMsgDialog("请输入密码");
            } else {
                that.Events.rotationImg();
                that.Events.toLogin(username, password);
            }
        });
        $('#rememberPwd,#rmPwdLabel').on('click', function() {//选择记住密码后操作，打钩与不打钩显示
            if ($('#rememberPwd').data('flag')) {
                //$("#rmPwdLabel").addClass("user_input_text");
                $('#rememberPwd').css('backgroundImage', 'url("images/selected.png")').data('flag', false);
                /*$('#rememberPwd').attr('background', 'img/login/selected.png').data('flag', false);*/
            } else {
                //$("#rmPwdLabel").removeClass("user_input_text");
                $('#rememberPwd').css('backgroundImage', 'url("images/select.png")').data('flag', true);
                /*$('#rememberPwd').attr('src', 'img/login/radio_default.png').data('flag', true);*/
            }
        });
    },
    Events:{
        showMsgDialog:function (msg) {
            $(".msg").show().find("span").html(msg);
                setTimeout(function() {
                    $(".msg").hide();
                }, 1000);
        },
        rotationImg:function () {
            var that = this;
            $(".waiting").show();//显示遮罩层
            $(".rotation").show();//显示canvas的旋转图标
            var relativeLeft = (document.documentElement.clientWidth - $(".rotation").width()) / 2;
            var relativeTop = (document.documentElement.clientHeight - $(".rotation").height()) / 2;
            $(".rotation").css({
                'left' : relativeLeft,
                'top' : relativeTop
            });
            that.parameter.sh = setInterval(that.draw, 10);
        },
        stopRotation: function () {
            var that = this;
            clearInterval(that.parameter.sh);
            $(".rotation").hide();
            $(".waiting").hide();
        },
        draw: function () {
            var that =this;
            var canvas = document.getElementById("waitingCanvas");
            var cog = new Image();
            cog.src = "images/rotation.png";
            var ctx = canvas.getContext('2d');
            ctx.globalCompositeOperation = 'destination-over';
            ctx.save();
            canvas.width = canvas.width;
            ctx.translate(32, 32);
            rotation += 1;
            ctx.rotate(rotation * Math.PI / 64);
            ctx.translate(-32, -32);
            ctx.drawImage(cog, 0, 0);
            ctx.restore();
        },
        service: {
            getAPIString: function(apiID, parameters) {
                var apiString = JSON.stringify({
                    "headers": {
                        "paramters": parameters,
                        "ID": null,
                        "date": new Date(),
                        "bodyType": "string",
                        "encryptType": null,
                        "action": "post",
                        "status": 1
                    },
                    "body": { "content": null }
                });
                apiString = "serviceId=" + apiID +"&param=" + encodeURIComponent(apiString);
                return apiString;
            },
            login:function (user, password, url, onSuccess, onError) {
                var loginStr = this.getAPIString("auth_login", {
                        "symbol": user,
                        "pwd": password,
                        "userTypeCookie":"student",
                         'version':'V4'
                 });
                $.ajax({
                    type: 'POST',
                    url: url,
                    headers:{
                        Accept: "application/json, application/xml, text/json, text/x-json, text/javascript, text/xml",
                    },
                    dataType: "json",
                    data: loginStr,
                    timeout: 15000,
                    success: onSuccess,
                    error: onError
                });
            }
        },
        parameter: {
            sh: null,
            height:null,
            barHeight:null,
            transHeight:null,
            rotationFlag:true
        },
        appConfig: {
            setEdition: function(edition) {
                this.edition = edition;
            },
            setHost : function(data){
                this.serverHost = data;
            },
            setAppPath : function(data){
                this.serverApiUrl = data + '/appRequest';
                this.getAvatarUrl = data + '/getAvatar.anys?userId=';
            }
        },
     /*   storeUserId: function (userId, account, castgc, casprivacy, orgId, offline) {
            cordova.exec(null, null, "UclassPlugin", "storeUserId", [userId, account, castgc, casprivacy, orgId, offline]);
        },*/
        toLogin:function (username, password) {
            var that = this;
            var url = that.appConfig.serverApiUrl;
            that.rotationImg();
            that.service.login(username, password, url, function(data) {
                if(!data || data.headers.status != "1" || data.body.content.user_type != "26") {
                    that.handleLoginError(data.body.content);
                    return;
                }

                var storage = window.localStorage,
                    endDate = new Date(new Date(data.body.content.deadline_end_date).toDateString()),
                    curDate = new Date(new Date(data.body.content.currentdate).toDateString()),
                    dateGap = (endDate - curDate) / (24 * 60 * 60 * 1000);
                if(dateGap < 0) {
                    that.stopRotation();
                    that.showMsgDialog("账号到期客户端无法登录");
                    return;
                }
                if(dateGap <= 15)
                    storage.setItem("accountDuration", dateGap);
                //data["icon"] = appConfig.getAvatarUrl+data.body.content.user_id;
                var uid;
                uid = storage.uid = data.body.content.user_id;
                if ( typeof ucbook === 'object'){
                    ucbook.setProperty('uid', uid);
                }
                storage.setItem("userInfo", JSON.stringify(data));
                var content = data.body.content;
//                that.storeUserId(content.user_id, content.account, content.CASTGC, content.CASPRIVACY, content.org_id, false);
                var users = JSON.parse(storage.getItem("users"));
                var nowTime = new Date().getTime();
                if(users){
                    users[username] = [JSON.stringify(data),password,nowTime,data.icon];
                    storage.setItem("users",JSON.stringify(users));
                } else {
                    storage.setItem("users", '{"' + username + '":[' + JSON.stringify(data) + ',"' + password + '","' + nowTime + '","' + data.icon + '"]}');
                }
//                that.setUserCookie(data);
                if (!$('#rememberPwd').data('flag')) {
                    var lastUser = '{"username":"' + $("#username").val() + '","pwd":"' + $("#pwd").val() + '","icon":"' + data.icon + '"}';
                    storage.setItem("lastUser", lastUser);
                } else {
                    var item = JSON.parse(storage.getItem("lastUser"));
                    if (item) {
                        if (item.username == username && item.pwd == password) {
                            storage.removeItem("lastUser");
                        }
                    }
                }
                that.stopRotation();
                window.stub.toIndexActivity();
//                window.location = "./wordcard/wordCardIndex.html";
            }, function(xhr, errorType, error) {
                if(that.appConfig.edition=='zhenjiang'){
                     // window.location = "./main.html?q";
                    that.showMsgDialog("网络错误");
                }else{
                    that.stopRotation();
                    that.showMsgDialog("网络错误");
                }
            })
        },
       /* setUserCookie: function (data) {
            var that = this;
            var key = that.appConfig.serverHost;
            var val = "userType=student;client_agent=android;viewSize=small" +
                (data ? ";JSESSIONID=" + data.body.content.jsessionid : '');
            cordova.exec(null, null, "UclassPlugin", "setWebviewCookie", [key, val]);
        },*/
        handleLoginError: function (error) {
            var that = this;
            that.stopRotation();
            var errorMsg = "帐号或密码错误";
            if(error == "6") {
                $(".information").css('display', 'block');
                initQuestionOption();
                return;
            }

            switch(error){
                case "1":
                    errorMsg = "账号不存在";
                    break;
                case "2":
                    errorMsg = "密码错误，请重新输入";
                    break;
                case "3":
                    errorMsg = "您输入的手手机/邮箱未验证";
                    break;
                case "4":
                    errorMsg = "用户删除";
                    break;
                case "5":
                    errorMsg = "用户冻结";
                    break;
                case "7":
                    errorMsg = "用户尚未到激活时间";
                    break;
                default:
                    break;
            }
            that.showMsgDialog(errorMsg);
        },
        checkLastUser: function () {
            var storage = window.localStorage;
            var lastUser = JSON.parse(storage.getItem("lastUser"));
            if (lastUser) {
                $('input[name="username"]').val(lastUser.username);
                $('input[name="password"]').val(lastUser.pwd);
                //$('.pic img').attr('src',lastUser.icon);
                $('#rememberPwd').css('backgroundImage', 'url("images/selected.png")').data('flag', false);
            }
        }
    }
}

window.onload=myLoad;
function myLoad() {
  app._init();
  app.Events.checkLastUser();
}
