package com.example.team01.utils;

import jakarta.servlet.http.HttpServletRequest;


/*
* 개발서버와 실서버에서 포트번호의 유무에 대해서
* 실서버에 배포할 땐 보통 React 등의 프론트도 Nginx에 묶어서 함께 배포하기 때문에
*
* http의 기본포트는 80이며, 포트 생략가능
* https의 기본포트는 443이며, 포트 생략가능
* */

public class severUrlUtil {

    public static String getPathUrl(HttpServletRequest request){
        String scheme = request.getScheme();              // http 또는 https
        String serverName = request.getServerName();      // localhost, example.com
        int serverPort = request.getServerPort();         // 8081, 80, 443

        // 운영 서버에서는 보통 기본 포트 사용
        if ((scheme.equals("http") && serverPort == 80) || (scheme.equals("https") && serverPort == 443)) {
            return scheme + "://" + serverName;
        } else {
            //생략해도 되는 포트가 아니라면
            return scheme + "://" + serverName + ":" + serverPort;
        }

    }

}
