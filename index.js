$(function () {
	var isplay = false;
	var isshow = false;
	var audio = $("audio")[0];
	var ison = true;
	var allmusic = ["music/艾索 - 晚安喵.mp3",
	"music/特曼,裂天,小魂 - 九九八十一.mp3",
	"music/Aash Mehta,The Chainsmokers - Clsr (Aash Mehta Flip).mp3",
	"music/Alex G - Butterflies.mp3",
	"music/Fefe Dobson - Stuttering.mp3",
	"music/伦桑,裂天,小魂 - 权御天下.mp3",
	];
	var allimg = ["images/0.jpg",
	"images/1.jpg",
	"images/2.jpg",
	"images/3.jpg",
	"images/4.jpg",
	"images/5.jpg"
	]
	var time0 = null;
	function getTime () {
		audio.oncanplay = function () {
			time0 = audio.duration;
			var minute = parseInt(time0/60);
			var second = parseInt(time0%60);
			if(minute<10){
				minute = "0"+minute;
			}
			if(second<10){
				second = "0"+second;
			}
			$(".toatime").find("span").html(minute);
			$(".toatime").find("i").html(second);
		}
	}
	//歌词
	var alllrc = [];
	for(var j = 0;j<6;j++){
		$.ajax({
			type:"get",
			url:"lrc/"+j+".lrc",
			async:true,
			success : function (data) {
				alllrc.push(data);
			}
		});
	}
	function getlec (index) {
		$(".lrc").val(alllrc[index]);
		/*$.ajax({
			type:"get",
			url:"lrc/"+index+".lrc",
			async:true,
			success : function (data) {
				console.log(data);
				setTimeout(function () {
					$(".lrc").val(data);	
				},10)
			}
		});*/
	}
	getTime();
	getlec(0);
	$.lrc.start($('.lrc').val(), function() {
		return time0;
		console.log(1);
	});
	function play () {
		audio.play();
		$("#play").html("&#xe62c;");
		$(".picbox").css("animation", "cir 3s linear infinite");
		$(".cdon").css("transform","rotate(0deg)");
	}
	$("#play").click(function () {
		if(!isplay){
			for(var k = 0;k<allmusic.length;k++){
				if($(audio).attr("src")==allmusic[k]){
					getlec(k);
				}
			}
			play();
			
			$.lrc.start($('.lrc').val(), function() {
				return audio.currentTime;
			});
			isplay = true;
		}else{
			audio.pause();
			$("#play").html("&#xe62d;");
			$(".picbox").css("animation", "");
			$(".cdon").css("transform","rotate(-21deg)");
			isplay = false;
		}
		
	});
	
	
	/*$.lrc.start($('.lrc').val(), function() {
		return audio.currentTime;
	});*/
	
	
	//时间条
	audio.addEventListener("timeupdate",function(){
		var protime = audio.currentTime;
		var minute = parseInt(protime/60);
		var second = parseInt(protime%60);
		if(minute<10){
			minute = "0"+minute;
		}
		if(second<10){
			second = "0"+second;
		}
		$(".protime").find("span").html(minute);
		$(".protime").find("i").html(second);
	    var ratio = audio.currentTime/time0;
	    $(".pro").css("width",$(".time").width()*ratio);	    
	    if(protime==time0){
	    	for(var i = 0;i<allmusic.length;i++){
	    		if($(audio).attr("src")==allmusic[i]){
	    			if(i==(allmusic.length-1)){
	    				$(audio).attr("src",allmusic[0]);
	    				$(".cdimg").attr("src",allimg[0]);
	    				$(".name").html(lilist[0].children[0].innerText);
						$(".album").html(lilist[0].children[1].innerText);
						$(".singer").html(lilist[0].children[2].innerText);
						getlec(0);
						$.lrc.start($('.lrc').val(), function() {
							return audio.currentTime;
						});
	    			}else{
	    				$(audio).attr("src",allmusic[i+1]);
	    				$(".cdimg").attr("src",allimg[i+1]);
	    				$(".name").html(lilist[i+1].children[0].innerText);
						$(".album").html(lilist[i+1].children[1].innerText);
						$(".singer").html(lilist[i+1].children[2].innerText);
						getlec(i+1);
						$.lrc.start($('.lrc').val(), function() {
							return audio.currentTime;
						});
	    			}
	    			play();
	    			return;
	    		}
	    	}
	    }
	});
	//进度调整
	$(".time").click(function (e) {
		var newwidth = e.clientX-$(".time").offset().left;
		$(".pro").css("width",newwidth);
		audio.currentTime= parseInt(newwidth/$(".time").width()*time0);
	});
	//列表
	var isin = true;
//	$("#listbtn").mouseenter(function () {
//		isin = true;
		$("#listbtn").click(function () {
			if(!isshow){
				$("#musiclist").show();
				isshow = true;			
			}else{
				$("#musiclist").hide();
				isshow = false;
			}
		})
//	});
	/*$("#listbtn").mouseleave(function () {
		isin = false;
		$(document).click(function () {
			if(isshow&&!isin){
				$("#musiclist").hide();
				isshow = false;
			}
		})
	})*/
	//点击切换歌曲
	var lilist = $("#musiclist").find("li:not(:first)");
	lilist.click(function () {
		$(".name").html(this.children[0].innerText);
		$(".album").html(this.children[1].innerText);
		$(".singer").html(this.children[2].innerText);
		$(audio).attr("src",allmusic[$(this).index()-1]);
		$(".cdimg").attr("src",allimg[$(this).index()-1]);
		console.log($(this).index());
		getlec($(this).index()-1);
		play();
		$.lrc.start($('.lrc').val(), function() {
			return audio.currentTime;
		});
		isplay = true;
	});
	//下一首
	$("#nextbtn").click(function () {
		for(var i = 0;i<allmusic.length;i++){
    		if($(audio).attr("src")==allmusic[i]){
    			if(i==(allmusic.length-1)){
    				$(audio).attr("src",allmusic[0]);
    				$(".cdimg").attr("src",allimg[0]);
    				$(".name").html(lilist[0].children[0].innerText);
					$(".album").html(lilist[0].children[1].innerText);
					$(".singer").html(lilist[0].children[2].innerText);
					getlec(0);
					$.lrc.start($('.lrc').val(), function() {
						return audio.currentTime;
					});
    			}else{
    				$(audio).attr("src",allmusic[i+1]);
    				$(".cdimg").attr("src",allimg[i+1]);
    				$(".name").html(lilist[i+1].children[0].innerText);
					$(".album").html(lilist[i+1].children[1].innerText);
					$(".singer").html(lilist[i+1].children[2].innerText);
					getlec(i+1);
					$.lrc.start($('.lrc').val(), function() {
						return audio.currentTime;
					});
    			}
    			play();
    			isplay = true;
    			return;
    		}
    	}
	});
	//上一首
	$("#prevbtn").click(function () {
		for(var i = 0;i<allmusic.length;i++){
    		if($(audio).attr("src")==allmusic[i]){
    			if(i==0){
    				$(audio).attr("src",allmusic[0]);
    				$(".cdimg").attr("src",allimg[0]);
    				$(".name").html(lilist[0].children[0].innerText);
					$(".album").html(lilist[0].children[1].innerText);
					$(".singer").html(lilist[0].children[2].innerText);
					getlec(0);
					$.lrc.start($('.lrc').val(), function() {
						return audio.currentTime;
					});
    			}else{
    				$(audio).attr("src",allmusic[i-1]);
    				$(".cdimg").attr("src",allimg[i-1]);
    				$(".name").html(lilist[i-1].children[0].innerText);
					$(".album").html(lilist[i-1].children[1].innerText);
					$(".singer").html(lilist[i-1].children[2].innerText);
					getlec(i-1);
					$.lrc.start($('.lrc').val(), function() {
						return audio.currentTime;
					});
    			}
    			play();
    			isplay = true;
    			return;
    		}
    	}
	});
	//随机播放
	$("#randbtn").click(function () {
		var ran = parseInt(Math.random()*allmusic.length);
		while($(audio).attr("src")==allmusic[ran]){
			ran = parseInt(Math.random()*allmusic.length);
		}
		$(audio).attr("src",allmusic[ran]);
		$(".cdimg").attr("src",allimg[ran]);
		$(".name").html(lilist[ran].children[0].innerText);
		$(".album").html(lilist[ran].children[1].innerText);
		$(".singer").html(lilist[ran].children[2].innerText);
		getlec(ran);
		$.lrc.start($('.lrc').val(), function() {
			return audio.currentTime;
		});
		play();
		isplay = true;
	});
	//重新播放
	$("#refresh").click(function () {
		audio.currentTime = 0;
		isplay = true;
	});
	var wid = 100;
	audio.volume = 0.5;
	//音量调节
	$(".volumebox").click(function (e) {
		var newwidth = e.clientX-$(".volumebox").offset().left;
		$(".volume").width(newwidth);
		wid = newwidth;
		audio.volume = parseFloat(wid/$(".volumebox").width());
		if(wid/$(".volumebox").width()>0.5){
			$("#volumebtn").html("&#xe633;");
			ison = true;
		}else if(wid/$(".volumebox").width()<=0.01){
			$("#volumebtn").html("&#xe631;");
			ison = false;
		}else{
			$("#volumebtn").html("&#xe632;");
			ison = true;
		}
	})
	//音量开关
	$("#volumebtn").click(function () {
		if(ison){
			$("#volumebtn").html("&#xe631;");
			ison = false;
			audio.volume = 0;
			$(".volume").width(0);
		}else{
			if(wid/$(".volumebox").width()>0.5){
				$("#volumebtn").html("&#xe633;");
			}else{
				$("#volumebtn").html("&#xe632;");
			}
			$(".volume").width(wid);
			audio.volume = parseFloat(wid/$(".volumebox").width());
			ison = true;
		}
	});
	
})
