package com.example.team01.common.Enum;

public enum RecomStatus {

    RECOMMEND("RECOMMEND","추천"),
    POPULAR("POPULAR","인기"),
    NORMAL("NORMAL","일반");

    private final String recomType;
    private final String msg;

    //생성자
    RecomStatus(String recomType,String msg){
        this.recomType = recomType;
        this.msg = msg;
    }

    //getter
    public String getRecomType() {
         return recomType;
    }
    public String getMsg() {
        return msg;
    }

    //파라미터 검증 메서드
    // ==> enum 내부에서 처리하는 이유는 서비스는 판단만하고, 책임을 Enum 에 넘길 수 있고,
    // 도메인 규칙 유출방지
    // 데이터와 그 데이터를 해석하는 규칙은 동일한 곳이 있어야 함 : SRP(단일 책임 원칙)
    public boolean matches(String value) {
        return this.recomType.equals(value);
    }

}

//어노테이션 사용 시 생성자, getter 기입 생략가능
// 생성자 기입 생략 ==> @RequiredArgsConstructor
// getter 기입 생략 ==> @Getter
