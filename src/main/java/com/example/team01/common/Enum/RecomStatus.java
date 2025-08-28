package com.example.team01.common.Enum;

public enum RecomStatus {

    RECOMEND("RECOMEND","추천도서"),
    POPULAR("POPULAR","인기"),
    NORMAL("NORMAL","일반");

    private final String recomType;
    private final String msg;

    
    //생성자
    RecomStatus(String recomType,String msg){
        this.recomType = recomType;
        this.msg = msg;
    }

    public String getRecomType() {
         return recomType;
    }
    public String getMsg() {
        return msg;
    }

}

//어노테이션 사용 시 생성자, getter 기입 생략가능
// 생성자 기입 생략 ==> @RequiredArgsConstructor
// getter 기입 생략 ==> @Getter
