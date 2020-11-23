'use strict';

(function init() {
    const averageColor = 'darkgreen';
    const extensionClass = 'dnevnik-extension';

    const estimateSection = 'section.estimate-page__section int-estimate-date-grid-container';
    const finalEstimatesTableSelector = `${estimateSection} div.date-grid__container_position_right table`;
    const estimateContainer = 'feature-estimate';
    const estimatesCellSelector = 'feature-estimate-cell';
    const estimateValueSelector = 'span.estimate__value';
    const estimatesContainer = `${estimateSection} div.date-grid__container_position_middle`;

    const waitForElement = function (selector, callback) {
        if (document.querySelector(selector)) {
            callback();
        } else {
            setTimeout(function () {
                waitForElement(selector, callback);
            }, 500);
        }
    };

    const setAverageEstimate = function (rowIndex, estimations) {
        const finalEstimateRows = document.querySelectorAll(`${finalEstimatesTableSelector} tr`);
        const estimateCell = finalEstimateRows[rowIndex].querySelector(estimatesCellSelector);
        if (!estimateCell)
            return;

        const doesFinalEstimateExist = !!estimateCell.querySelector(estimateContainer);
        if (doesFinalEstimateExist)
            return;

        const averageEstimate = estimateCell.querySelector(`span.${extensionClass}`);
        if (averageEstimate) {
            averageEstimate.remove();
        }

        if (!estimations || Object.keys(estimations).length === 0)
            return;

        let total = 0;
        let count = 0;
        let tooltip = '';
        Object.keys(estimations).sort().forEach(estimate => {
            const estimateCount = estimations[estimate];
            if (estimateCount) {
                total += estimate * estimateCount;
                count += estimateCount;
                tooltip += `\n${estimate}: ${estimateCount}`;
            }
        });

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
        if (!estimateTable) {
            return;
        }

        estimateTable.querySelectorAll('tr').forEach((row, index) => {
            const estimations = {};
            row.querySelectorAll(estimatesCellSelector).forEach((cell) => {
                let totalEstimate = 0;
                let estimatesCount = 0;
                cell.querySelectorAll(estimateValueSelector).forEach((estimateElement) => {
                    const estimate = +estimateElement.textContent;
                    if (estimate && !isNaN(estimate)) {
                        totalEstimate += estimate;
                        estimatesCount++;
                    }
                });

                if (estimatesCount) {
                    const cellEstimate = totalEstimate / estimatesCount;
                    estimations[cellEstimate] = (estimations[cellEstimate] || 0) + 1;
                }
            });

            setAverageEstimate(index, estimations);
        });
    });
}());