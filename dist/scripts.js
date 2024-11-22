"use strict";
let score = {
    corrects: 0,
    misses: 0,
};
document.addEventListener("DOMContentLoaded", () => {
    const firstOperand = document.querySelector("#firstOperand");
    const secondOperand = document.querySelector("#secondOperand");
    const operator = document.querySelector("#operator");
    const userResult = document.querySelector("#result-input");
    const animationResult = document.querySelector("#animation-result");
    const scoreCorrectsEl = document.querySelector("#score-corrects");
    const scoreMissesEl = document.querySelector("#score-misses");
    if (!firstOperand ||
        !secondOperand ||
        !operator ||
        !userResult ||
        !animationResult ||
        !scoreCorrectsEl ||
        !scoreMissesEl) {
        console.error("Missing element");
        return;
    }
    userResult.focus();
    userResult.addEventListener("input", () => {
        userResult.value = userResult.value.replace(/[^0-9-]/g, "");
    });
    const generateRandomOperation = () => {
        const operators = ["+", "-", "x"];
        const randomOperator = operators[Math.floor(Math.random() * operators.length)];
        operator.textContent = randomOperator;
        const largestNumberLimit = 100;
        const firstOperandValue = Math.floor(Math.random() * largestNumberLimit);
        const secondOperandValue = Math.floor(Math.random() * largestNumberLimit);
        firstOperand.textContent = firstOperandValue.toString();
        secondOperand.textContent = secondOperandValue.toString();
        const handleOperation = (event) => {
            if (event.key === "Enter" && document.activeElement === userResult) {
                let result;
                switch (randomOperator) {
                    case "+":
                        result = firstOperandValue + secondOperandValue;
                        break;
                    case "-":
                        result = firstOperandValue - secondOperandValue;
                        break;
                    case "x":
                        result = firstOperandValue * secondOperandValue;
                        break;
                    case "/":
                        result = firstOperandValue / secondOperandValue;
                        break;
                    default:
                        return;
                }
                if (result === parseFloat(userResult.value)) {
                    animationResult.classList.add("animation-result");
                    animationResult.textContent = "CORRECT!";
                    score.corrects = score.corrects + 1;
                    scoreCorrectsEl.textContent = score.corrects.toString();
                    animationResult.addEventListener("animationend", () => {
                        setTimeout(() => {
                            animationResult.style.opacity = "0";
                            animationResult.style.transform = "scale(0)";
                            generateRandomOperation();
                        }, 200);
                    });
                }
                else {
                    score.misses = score.misses + 1;
                    scoreMissesEl.textContent = score.misses.toString();
                }
            }
        };
        document.addEventListener("keydown", handleOperation);
        userResult.value = "";
    };
    generateRandomOperation();
});
