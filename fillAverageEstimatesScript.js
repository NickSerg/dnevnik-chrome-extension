'use strict';

(function init($) {
    const averageColor = 'darkgreen';
    const extensionClass = 'dnevnik-extension';

    const totalEstimatesTableSelector = 'div.estimate div.right table';
    const estimateContainer = 'app-single-estimate';
    const estimatesCellSelector = 'td.values'
    const estimateCellSelector = 'span.value'
    const estimatesContainer = 'div.estimate div.middle';

    let waitForElement = function (selector, callback) {
        if ($(selector).length) {
            callback();
        } else {
            setTimeout(function () {
                waitForElement(selector, callback);
            }, 500);
        }
    };

    let setAverageEstimate = function (rowIndex, estimations) {
        const estimateCell = $(`${totalEstimatesTableSelector} tr:eq(${rowIndex}) ${estimatesCellSelector}`);
        if ($(estimateContainer, estimateCell).length)
            return;

        $(`span.${extensionClass}`, estimateCell).remove();
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
        let element = $('<span/>')
            .css('color', averageColor)
            .addClass(extensionClass)
            .text(Math.round(average * 100) / 100);

        estimateCell.attr('title', tooltip).append(element);
    };

    waitForElement(estimatesContainer, function () {
        let estimateTable = $(`${estimatesContainer} table`);
        $('tr', estimateTable).each(function (index) {
            const estimations = {};
            $(`td ${estimateContainer} ${estimateCellSelector}`, this).each(function () {
                let estimate = +$(this).text();
                if (estimate && !isNaN(estimate)) {
                    estimations[estimate] = (estimations[estimate] || 0) + 1;
                }
            });

            setAverageEstimate(index, estimations);
        });
    });
}(window.jQuery));