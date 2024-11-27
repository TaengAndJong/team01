package com.example.backend.vo;

import java.io.Serializable;

import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

// @Data: getter, setter, toString(), equals(), hashCode() 메서드를 자동으로 생성합니다.
// @NoArgsConstructor: 인자가 없는 기본 생성자를 자동으로 생성합니다. 
//==> 기본 생성자가 없으면 객체를 제대로 생성할 수 없기 때문에 생성해줘야함
// @AllArgsConstructor: 모든 필드를 인자로 받는 생성자를 자동으로 생성합니다.
//implements Serializable => 직렬화와 역직렬화를 지원하기 위함
//직렬화 : 객체를 바이트스트림 데이터로 변환,저장 전송하는 과정
//직렬화된 객체는 파일, 네트워크, 데이터베이스 등에 저장
// 역직렬화는 반대로 

@Data
@NoArgsConstructor
@AllArgsConstructor
public class TestVO implements Serializable{
    String testId;
    String testName;
}
