'use strict';

(function int() {
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

    let setAverageEstimate = function (rowIndex, total, count) {
        const estimateCell = $(`${totalEstimatesTableSelector} tr:eq(${rowIndex}) ${estimatesCellSelector}`);
        if ($(estimateContainer, estimateCell).length)
            return;

        if($(`span.${extensionClass}`, estimateCell).length)
            return;

        const average = total / count;
        let element = $('<span/>')
            .css('color', averageColor)
            .addClass(extensionClass)
            .text(Math.round(average * 100) / 100);

        estimateCell.attr('title', average).append(element);
    };

    waitForElement(estimatesContainer, function () {
        let estimateTable = $(`${estimatesContainer} table`);
        $('tr', estimateTable).each(function (index) {
            let total = 0;
            let count = 0;
            $(`td ${estimateContainer} ${estimateCellSelector}`, this).each(function () {
                let estimate = +$(this).text();
                if (estimate && !isNaN(estimate)) {
                    total += estimate;
                    count++;
                }
            });

            setAverageEstimate(index, total, count);
        });
    });
}());