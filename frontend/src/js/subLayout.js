
//left menu togleEvent
/*
* for .. of 는 배열만 순회
* for .. in 은 객체를 대상으로 순회
* */


/*
* 0. 게시판 1:1문의는 이미 멸려 있어야 함( 게시판 관리하면 index 페이지라서)
* => .current 클래스 넣어주기
* 1. 1차메뉴 버튼클릭 (onclick) =>
* 기존 클래스 있는 button 의  .current 제거 하고
* 현재 클릭한 button에 .current 추가
* 형제  ul.depth css display: block
* 2. 
* */


// =document.querySelector(".first-depth > li > .depth-menu"); // 선언과 쵸기화, undefined
// console.log("firstMenu--------",firstMenu);

let firstMenu;
export  const leftFirstMenuToggle=(e)=>{
    firstMenu=e.target;
    const parent = firstMenu.parentElement.parentElement;
    const secondDepth = firstMenu.nextElementSibling;

    // firstMenu가 e.tartget 이 아닌 parent의 자식의 button 에 current 클래스 지우기와 title 속성 메뉴 닫힘 표시

//기존에 추가되어 있는 current 클래스와 title 초기화
    Array.from(parent.children).forEach(firstList=>{
        console.log("----------------------------------------")
        console.log("li",firstList);
        const lst = firstList.children;
        for( let item of lst){

            console.log(".item" , item);
            if(item.classList.contains("current")){
                item.classList.remove("current");
                item.setAttribute("title","1차메뉴 닫힘");
                console.log("current 삭제함");
            }
        }
        console.log("---------------------------------------- ")
       //end
    })

    //2. 이벤트 실행시, 해당 이벤트 발생한 요소에 대해 'current class 추가와 title 변경"
    firstMenu.classList.add("current");
    firstMenu.setAttribute("title","1차메뉴 열림");


    console.log("secondDepth" ,secondDepth);
    console.log("parents" ,parent);
}

//focus
export const leftMenuFocus = (e) =>{
    firstMenu=e.target;//정의
    console.log("leftMenuFocus",e.target);
    firstMenu.classList.add("current");

}
//blur
export const leftMenuBlur = (e) =>{
    firstMenu=e.target; //정의
    //firstMenu.classList.remove("current");
}
