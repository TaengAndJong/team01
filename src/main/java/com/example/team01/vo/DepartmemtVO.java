package com.example.team01.vo;


import lombok.*;

import java.io.Serializable;

@ToString
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class DepartmemtVO implements Serializable {

    private String departId;
    private String departName;

}
