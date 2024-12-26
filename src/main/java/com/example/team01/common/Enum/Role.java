package com.example.team01.common.Enum;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum Role {
        USER("ROLE_USER","일반회원"),
        ADMIN("ROE_ADMIN","관리자"),
        MEMBER("ROE_MEMBER","팀원");

    private final String key;
    private final String title;
}


// 기본적으로 직렬화 가능하므로 Serializable 인터페이스를 구현할 필요가 없고,
// 리플렉션 문제도 발생하지 않는다. 인스턴스가 JVM 내에 하나만 존재한다는 것이 100% 보장 되므로,
// Java에서 싱글톤을 만드는 가장 좋은 방법으로 권장