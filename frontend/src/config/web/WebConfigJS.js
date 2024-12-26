class WebConfigJS {
    constructor() {


        this.ipAddress = "192.168.0.3"; // 본인 장비 ip  예: "192.168.1.1"
        this.backEndPort = "8081"; // 예: "8080"
    }
}

// 사용 예시
const WebConfig = new WebConfigJS();
console.log(WebConfig.ipAddress); // "본인 장비 ip"
console.log(WebConfig.backEndPort); // "백엔드로 통신할 포트 번호"
