var arr =  [1,3,4,9,19];

/**
 * 求平均值
 * @param {*} data 
 */
function getAverage (data) {
    let average = 0;
    for (let i = 0; i < data.length; i++){
        average = i/(i+1) * average + data[i]/(i+1);
    }
    return average
}

/**
 * 计算最接近的值
 * @param {*} data 
 */
function getAverageInArray(data) {
    const average = getAverage(data)
    let res = data[0]
    let minDelta = Math.abs(data[0] - average)

    for (let i = 0; i < data.length; i++) {
        const delta = Math.abs(data[i] - average)
        if (delta < minDelta) {
            minDelta = delta
            res = data[i]
        }
    }

    return res
}

