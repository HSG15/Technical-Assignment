/**
 * @NApiVersion 2.1
 * @NScriptType MapReduceScript
 */
define(['N/log', 'N/record', 'N/search', 'N/email', 'N/render', 'N/runtime'],
    (log, record, search, email, render, runtime) => {

        const getInputData = (inputContext) => {
            var invoiceIds = runtime.getCurrentScript().getParameter({ name: 'custscript_param' });
            log.debug('invoice ids ', invoiceIds);
            var parsedData = JSON.parse(invoiceIds);
            log.debug('Parsed invoice IDs received in map/reduce ', parsedData);
            return parsedData;
        }

        const map = (mapContext) => {
            var invoiceId = parseInt(mapContext.value);
            log.debug('Processing invoice ID ', invoiceId);

            var invoiceRecord = record.load({
                type: record.Type.INVOICE,
                id: invoiceId
            });

            var custEmail = invoiceRecord.getValue({ fieldId: 'email' });
            log.debug('cust email is ', custEmail)
            mapContext.write({ key: custEmail, value: invoiceId });
        }

        const reduce = (reduceContext) => {
            log.debug('entered into reduced')

            var custEmail = reduceContext.key;
            log.debug('custEmail is ', custEmail)
            var invoiceIds = reduceContext.values;

            try {
                var attachArray = [];

                invoiceIds.forEach(function (invoiceId) {
                    var pdfFile = render.transaction({
                        entityId: parseInt(invoiceId),
                        printMode: render.PrintMode.PDF
                    });
                    log.debug('PDF for invoice ID ', invoiceId);
                    attachArray.push(pdfFile);
                });

                if (attachArray.length > 0) {
                    log.debug('Sending email to ', custEmail);

                    email.send({
                        author: '-5',
                        recipients: custEmail,
                        subject: 'Your Invoices',
                        body: 'This is email body',
                        subject: 'This is my email subject',
                        attachments: attachArray
                    });

                    log.debug('Email sent successfully');
                }

            } catch (error) {
                log.error('Error is ', error);
            }
        };

        const summarize = (summaryContext) => {

        }

        return { getInputData, map, reduce, summarize }
    });
