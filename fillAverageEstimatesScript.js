'use strict';

(function init() {
    const averageColor = 'darkgreen';
    const extensionClass = 'dnevnik-extension';

    const finalEstimatesTableSelector = 'div.estimate div.right table';
    const estimateContainer = 'app-single-estimate';
    const estimatesCellSelector = 'td.values';
    const estimateCellSelector = 'span.value';
    const estimatesContainer = 'div.estimate div.middle';

    const waitForElement = function (selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(function () {
                waitForElement(selector, callback);
            }, 500);
        }
    };

    const findElement = (selector) => {
        return (selector)
    }

    const setAverageEstimate = function (rowIndex, estimations) {
        const finalEstimateRows = document.querySelectorAll(`${finalEstimatesTableSelector} tr`);
        const estimateCell = finalEstimateRows[rowIndex].querySelector(estimatesCellSelector);
        if (!estimateCell)
            return;

        const doesFinalEstimateExist = !!estimateCell.querySelector(estimateContainer);
        if(doesFinalEstimateExist)
            return;

        const averageEstimate = estimateCell.querySelector(`span.${extensionClass}`);
        if(averageEstimate) {
            averageEstimate.remove();
        }

        let total = 0;
        let count = 0;
        let tooltip = '';
        for (let i = 5; i >= 2; i--) {
            if(estimations[i]) {
                const estimateCount = estimations[i];
                total += i * estimateCount;
                count += estimateCount;
                tooltip += `\n${i}: ${estimateCount}`;
            }
        }

        const average = total / count;
        tooltip = `${average}\n${tooltip}`;
        const element = document.createElement('span');
        element.setAttribute('style', `color: ${averageColor}`);
        element.setAttribute('class', extensionClass);
        element.textContent = (Math.round(average * 100) / 100).toString();

        estimateCell.setAttribute('title', tooltip);
        estimateCell.appendChild(element);
    };

    waitForElement(estimatesContainer, function () {
        let estimateTable = document.querySelector(`${estimatesContainer} table`);
        if(!estimateTable) {
            return;
        }

        estimateTable.querySelectorAll('tr').forEach((row, index) => {
            const estimations = {};
            row.querySelectorAll(`td ${estimateContainer} ${estimateCellSelector}`)
                .forEach((cell) =>
            {
                const estimate = +cell.textContent;
                if (estimate && !isNaN(estimate)) {
                    estimations[estimate] = (estimations[estimate] || 0) + 1;
                }
            });

            setAverageEstimate(index, estimations);
        });
    });
}());