/**
 * @NApiVersion 2.1
 * @NScriptType UserEventScript
 */
define(['N/record', 'N/log'],
    /**
 * @param{record} record
 */
    (record) => {
        /**
         * Defines the function definition that is executed before record is loaded.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @param {Form} scriptContext.form - Current form
         * @param {ServletRequest} scriptContext.request - HTTP request information sent from the browser for a client action only.
         * @since 2015.2
         */
        const beforeLoad = (scriptContext) => {

        }

        /**
         * Defines the function definition that is executed before record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const beforeSubmit = (scriptContext) => {
            log.debug('Before submit triggered')
            if(scriptContext.type === scriptContext.UserEventType.CREATE || scriptContext.type === scriptContext.UserEventType.EDIT){
                var current_record = scriptContext.newRecord
                var itemCount = current_record.getLineCount({
                    sublistId: 'item'
                })
                var totalPrice = 0
                var netQuantity = 0
                for(var i=0; i<itemCount; i++){
                    var currentPrice = current_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'rate',
                        line: i
                    })
                    totalPrice += currentPrice

                    var currentQuantity = current_record.getSublistValue({
                        sublistId: 'item',
                        fieldId: 'quantity',
                        line: i
                    })
                    netQuantity += currentQuantity
                }

                var otherChargeItemId = 201
                current_record.insertLine({
                    sublistId: 'item',
                    line: itemCount
                })

                current_record.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'item',
                    line: itemCount,
                    value: otherChargeItemId
                })
                current_record.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'rate',
                    line: itemCount,
                    value: totalPrice
                })
                current_record.setSublistValue({
                    sublistId: 'item',
                    fieldId: 'quantity',
                    line: itemCount,
                    value: netQuantity
                })
                log.debug(`Other charge item added with quantity ${netQuantity} and price ${totalPrice}`)
            }

            log.debug('Exit if block')
            
        }

        /**
         * Defines the function definition that is executed after record is submitted.
         * @param {Object} scriptContext
         * @param {Record} scriptContext.newRecord - New record
         * @param {Record} scriptContext.oldRecord - Old record
         * @param {string} scriptContext.type - Trigger type; use values from the context.UserEventType enum
         * @since 2015.2
         */
        const afterSubmit = (scriptContext) => {

        }

        return {beforeLoad, beforeSubmit, afterSubmit}

    });
