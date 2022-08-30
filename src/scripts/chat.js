function setCookie(cookieName, value, exdays){
	var exdate = new Date();
	exdate.setDate(exdate.getDate() + exdays);
	var cookieValue = escape(value) + ((exdays==null) ? "" : "; expires=" + exdate.toGMTString());
	document.cookie = cookieName + "=" + cookieValue;
}

function deleteCookie(cookieName){
	var expireDate = new Date();
	expireDate.setDate(expireDate.getDate() - 1);
	document.cookie = cookieName + "= " + "; expires=" + expireDate.toGMTString();
}

function getCookie(cookieName) {
	cookieName = cookieName + '=';
	var cookieData = document.cookie;
	var start = cookieData.indexOf(cookieName);
	var cookieValue = '';
	if(start != -1){
		start += cookieName.length;
		var end = cookieData.indexOf(';', start);
		if(end == -1)end = cookieData.length;
		cookieValue = cookieData.substring(start, end);
	}
	return unescape(cookieValue);
}

let category = getCookie("category"); //setCookie("category")로 세팅한 category 변수 명
let scrollPoint = getCookie("scrollPoint"); //setCookie("scrollPoint")로 세팅한 스크롤 위치
let currentCategory = "mainScrollPoint"; //이벤트 발생 후 새로 로드된 현재 페이지의 카테고리 지정

if (category != "" && category != 'undefined' 
   && category == currentCategory && scrollPoint != "" && scrollPoint != 'undefined') {
   
    window.scroll(0, scrollPoint); 
    //body.scrollTop(scrollPoint);
}

let newMessage = document.querySelector("#newMessage");
newMessage.addEventListener("submit", (e) => {
    e.preventDefault();
    //스크롤 위치 저장
    var scrollPoint = (document.documentElement && document.documentElement.scrollTop) 
       || document.body.scrollTop;

   setCookie("category", "mainScrollPoint"); // 쿠키에서 사용할 category에 사용자 정의 카테고리명 세팅
    setCookie("scrollPoint", scrollPoint); // 쿠키에 스크롤 위치 세팅
    alert("메세지가 전송되었습니다.");
    newMessage.submit();
});

