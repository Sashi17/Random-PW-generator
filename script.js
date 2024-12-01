const inputSlider = document.querySelector("[datalenslider]")
const lenDisplay = document.querySelector("[datalennum]");

const pwdDisplay = document.querySelector("[datapwddisplay]");
const copyBtn = document.querySelector("[datacopy]");
const copyMsg = document.querySelector("[datacopyMsg]");
const upperCheck = document.querySelector("#uppercase");
const lowerCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
const indicator = document.querySelector("[dataindicator]");
const genBtn = document.querySelector(".genbtn");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';

//initially
let pwd = "";
let pwdLen = 10;
let checkCnt = 0;
handleSlider();
//ste strength circle color to grey
setIndicator("#ccc");

function handleSlider() {
    inputSlider.value = pwdLen;
    lenDisplay.innerText = pwdLen;
    const min = inputSlider.min;
    const max = inputSlider.max;
    inputSlider.style.backgroundSize = ( (pwdLen - min)*100/(max - min)) + "% 100%"
}

function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 12px 1px ${color}`;
}

function getRndInt(min, max){
    return Math.floor(Math.random() * (max - min)) + min;
}

function genRndNum() {
    return getRndInt(0,9);
}

function genLower() {  
    return String.fromCharCode(getRndInt(97,123))
}

function genUpper() {  
 return String.fromCharCode(getRndInt(65,91))
}

function genSymbol() {
    const randNum = getRndInt(0, symbols.length);
    return symbols.charAt(randNum);
}

function calcStrength() {
    let hasUpper = false;
    let hasLower = false;
    let hasNum = false;
    let hasSym = false;
    if (uppercaseCheck.checked) hasUpper = true;
    if (lowercaseCheck.checked) hasLower = true;
    if (numbersCheck.checked) hasNum = true;
    if (symbolsCheck.checked) hasSym = true;
  
    if (hasUpper && hasLower && (hasNum || hasSym) && pwdLen >= 8) {
      setIndicator("#0f0");
    } else if ( (hasLower || hasUpper) && (hasNum || hasSym) && pwdLen >= 6) {
      setIndicator("#ff0");
    } else {
      setIndicator("#f00");
    }
}

async function copyContent() {
    try {
        await navigator.clipboard.writeText(pwdDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e) {
        copyMsg.innerText = "Failed";
    }
    //to make copy wala span visible
    copyMsg.classList.add("active");

    setTimeout( () => {
        copyMsg.classList.remove("active");
    },2000);
}

function handleCheckBoxChange() {
    checkCnt = 0;
    allCheckBox.forEach( (checkbox) => {
        if(checkbox.checked)
            checkCnt++;
    });

    //special condition
    if(pwdLen < checkCnt ) {
        pwdLen = checkCnt;
        handleSlider();
    }
}

allCheckBox.forEach( (checkbox) => {
    checkbox.addEventListener('change', handleCheckBoxChange);
})

inputSlider.addEventListener('input', (e) => {
    pwdLen = e.target.value;
    handleSlider();
})

copyBtn.addEventListener('click', () => {
    if(pwdDisplay.value)
        copyContent();
})

function shufflePassword(array) {
    //Fisher Yates Method
    for (let i = array.length - 1; i > 0; i--) {
        //random J, find out using random function
        const j = Math.floor(Math.random() * (i + 1));
        //swap number at i index and j index
        const temp = array[i];
        array[i] = array[j];
        array[j] = temp;
      }
    let str = "";
    array.forEach((el) => (str += el));
    return str;
}

genBtn.addEventListener('click', () => {
    //none of the checkbox are selected

    if(checkCnt == 0) 
        return;

    if(pwdLen < checkCnt) {
        pwdLen = checkCnt;
        handleSlider();
    }

    // let's start the jouney to find new password
    console.log("Starting the Journey");
    //remove old password
    password = "";

    //let's put the stuff mentioned by checkboxes

    // if(uppercaseCheck.checked) {
    //     password += generateUpperCase();
    // }

    // if(lowercaseCheck.checked) {
    //     password += generateLowerCase();
    // }

    // if(numbersCheck.checked) {
    //     password += generateRandomNumber();
    // }

    // if(symbolsCheck.checked) {
    //     password += generateSymbol();
    // }

    let funcArr = [];

    if(upperCheck.checked)
        funcArr.push(genUpper);

    if(lowerCheck.checked)
        funcArr.push(genLower);

    if(numbersCheck.checked)
        funcArr.push(genRndNum);

    if(symbolsCheck.checked)
        funcArr.push(genSymbol);

    //compulsory addition
    for(let i=0; i<funcArr.length; i++) {
        pwd += funcArr[i]();
    }
    console.log("Compulsory adddition done");

    //remaining adddition
    for(let i=0; i < pwdLen - funcArr.length; i++) {
        let randIndex = getRndInt(0 , funcArr.length);
        console.log("randIndex" + randIndex);
        pwd += funcArr[randIndex]();
    }
    console.log("Remaining adddition done");
    //shuffle the password
    pwd = shufflePassword(Array.from(pwd));
    console.log("Shuffling done");
    //show in UI
    pwdDisplay.value = pwd;
    console.log("UI adddition done");
    //calculate strength
    calcStrength();
});




