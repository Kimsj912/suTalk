(function () {
    var httpRequest;
    document.getElementById("ajaxButton").addEventListener('click', makeRequest);

    function makeRequest() {
        httpRequest = new XMLHttpRequest();

        if (!httpRequest) {
            alert('XMLHTTP 인스턴스를 만들 수가 없어요 ㅠㅠ');
            return false;
        }
        httpRequest.onreadystatechange = () => {
            if (httpRequest.readyState === XMLHttpRequest.DONE) {
                if (httpRequest.status === 200) {
                    const chatting = document.querySelector('.chatting');
                    chatting.innerHTML = httpRequest.responseText;
                } else if (httpRequest.status === 404) {
                    alert('요청하신 페이지를 찾을 수 없어요 ㅠㅠ'+ httpRequest.responseURL);
                } else {
                    alert('request에 뭔가 문제가 있어요.');
                }
            }
        };
        httpRequest.open('GET','./chat.html');
        httpRequest.send();
    }

})();