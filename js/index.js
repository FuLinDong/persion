$(function(){
	var $con_num_a = $(".con_num a");
    var len = $con_num_a.length;
    var index = 0;
    var adTimer = null;
    
    $con_num_a.mouseover(function(){
    	index = $con_num_a.index(this);
    	showImg(index);
    }).eq(0).mouseover();
    
    $(".sectionTop2").hover(function(){
    	if(adTimer){
    		clearInterval(adTimer);
    	}
    },function(){
    	adTimer = setInterval(function(){
    		showImg(index);
    		index++;
    		if(index == len){index=0;}
    	},3000);
    }).trigger("mouseleave");
    function showImg(index){
	    var sectionTop2_a = $(".sectionTop2 a");
	    var newhref = sectionTop2_a.attr("href");
	    $con_num_a.eq(index).addClass("con_span_bg").siblings().removeClass("con_span_bg");
	    $("#show_a").find('img').eq(index).stop(true,true).show().siblings().hide();
	}
});

