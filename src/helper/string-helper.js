export const trimStringInObject = obj => {
    let newObj = {...obj};
    for(const key in newObj){
        if(typeof(newObj[key]) === "string"){
            newObj[key] = newObj[key].trim();
        }
    }
    return newObj;
};