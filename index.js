const arr = [{fullName : {surname : 'xxx', firstName : 'yyy', middleName: 'zzz'}, gender: 'male', birthDay: new Date(1988, 10, 23), pets: 2, fName : {sname : 'firstObjFNameSNameVal', firName : {x: false, y: true}, midName: false}}, {fullName : {surname : 'XXX', firstName : 'YYY', middleName: 'ZZZ'}, gender: 'female', birthDay: new Date(1993, 5, 14), pets: 0, fName : {sname : 'secondObjFNameSNameVal', firName : {x: false, y: false}, midName: false}}];
const transformationRules = {fullName : {surname : true, firstName : true, middleName: false}, gender: true, birthDay: true, pets: true, fName : {sname : true, firName : {x: false, y: true}, midName: false}};
const localization = {"fullName.surname" : "Прізвище", "fullName.middleName" : "По-батькові", "gender": "Стать", "pets": "Домашні тварини"};


function getResultArrTemplate(obj) {
    let recursionCount = 0;

    for (let key in obj) {
        if (obj[key] === true) {
            if (recursionCount>0) {
                result.push({name: key, localizationPath: key});
                recursionCount = 0;
                localizationPath = '';
            } else {
                result.push({name: key, localizationPath: localizationPath + key});
            }
        }

        if (typeof obj[key] === 'object') {
            localizationPath += key + '.';
            recursionCount++;
            getResultArrTemplate(obj[key]);
        }
    }
}

let result = [];
let localizationPath = '';

getResultArrTemplate(transformationRules);

for (let i = 1; i <= arr.length; i++) {
    for (let el of result) {
        let path = el.localizationPath.split('.');
        let res = arr[i-1];

        for (let index=0; index<path.length; index++) {
            res = res[path[index]];
        }

        if (typeof res === "boolean") {
            if (res === true) {
                el[`value${i}`] = 'Так';
            } else {
                el[`value${i}`] = 'Ні';
            }
        } else if (Object.prototype.toString.call(res) === '[object Date]') {
            el[`value${i}`] = `${res.getDate()}.${res.getMonth()+1}.${res.getFullYear()}`;
        } else {
            el[`value${i}`] = res;
        }
    }
}

result.forEach(el => {
    if (localization[el.localizationPath]) {
        el.name = localization[el.localizationPath];
    }

    delete el.localizationPath;
});

console.log(result);
