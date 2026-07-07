/**
 * mapping "service.name" to datastream
 */
export const DATASTREAM_MAPPING = {

    "testrun": `${process.env.TEST_INDEX}`,

    "controller": `${process.env.TEST_INDEX}`,

    "system": `${process.env.SYSTEM_INDEX}`,

};
