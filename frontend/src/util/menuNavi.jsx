
export const menuNavi = (menuData) =>{
    //menuData 인수는 관리자메뉴 배열 또는 클라이언트 메뉴 배열 등을 넣어주면 됨!

    const firstMenu = menuData?.filter(item => item.menuDepth === "1차메뉴");
    const secondMenu = menuData?.filter(item => item.menuDepth === "2차메뉴");
    const thirdMenu = menuData?.filter(item => item.menuDepth === "3차메뉴");

    const menu = firstMenu?.map(firstItem => {
            //1차메뉴 하위 자식 필터링
        const secondChild = secondMenu?.filter(secondItem =>
            //2차 메뉴 집합에서 1차메뉴 주소로 시작하는 경우로 필터링
            secondItem.menuPath.startsWith(firstItem.menuPath+"/")
        )?.map(secondItem => {
            const thirdChild = thirdMenu?.filter(thirdItem =>
                thirdItem.menuPath.startsWith(secondItem.menuPath+"/")
            )
           // console.log("thirdChild---------------------------" ,thirdChild);
            return {
                ...secondItem, //기존 순회하고 있는 아이템 객체
                thirdChild
            }
        })

        return {
            ...firstItem,
            secondChild
        };

    });
   // console.log("menu ---------------------------------------", menu);
    return menu

}