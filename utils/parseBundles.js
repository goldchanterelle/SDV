//last left off on parsing the bundle items

const camel = require('./camelCase')
const chunkedArr = require('./arrChunk')
const fs = require('fs')

async function bundleParse () {
    const data = await grabData('Bundles')
    const bundleNames = bundleNameGrabs(data);
    const BUNDLES = bundleBreakout(data, bundleNames)

    process.stdout.write(BUNDLES.pantry[0].qualifyItems[1])

    return BUNDLES
}

function grabData(fileName) {
  const path = `./data/src/${fileName}.json`;
  const data = fs.readFileSync(path);
  return data;
}

function bundleNameGrabs(data) {
    const bundleNames = []
    for (const key in Object.keys(data)) {
        let bundleName = bundleNameUtil(key)
        if (bundleNames.find(x => x == bundleName)) {
            continue
        }
        bundleNames.push(bundleName)
    }
    return bundleNames
}

//If an array exists matching the first half of the given key add an entry to the array consisting of the parsed string data. Otherwise fire string parse function
function bundleBreakout(data, bundleNames){

    let bundles = {}
    // for/in is just for objects
    for (const bundle in data) {
        const room =  bundleNameUtil(bundle)
        let currRoom = bundles[camel.toCamel(room)]
        if (!currRoom) {
            currRoom = bundles[camel.toCamel(room)] = []
        }
        currRoom.push(parseDataStr(data[bundle]))
    }

    return bundles
}

//Don't worry about reformatting - just get the important parts out and we'll translate later
function parseDataStr(str) {
    const strArr = str.split("/")
    let bundleObj = {
        name: strArr[0],
        reward: strArr[1],
        qualifyItems: parseBundleItems(strArr[2]),
        numNeed: str[4],
    }
    return bundleObj
}

function groupItems(str) {
    //Turn the list into a bundle of 3s
    let arr = str.split(" ")
    arr = chunkedArr.arrChunk(arr, 3)
    return arr
}

async function parseItems(arr) {
    const OBJECT_INFORMATION = await grabData('ObjectInformation')
    const itemID = arr[0]
    const item = { 
        item: OBJECT_INFORMATION[itemID],
        numNeed: arr[1],
        minQual: arr[2] //0 == no quality, 3 == iridium
    }
    return item
}


//LEFT OFF HERE ON PARSEBUNDLEITEMS

function parseBundleItems(str) {
    let items = groupItems(str)
    items = items.map(x => {
        return parseItems(x)
    })
    return items
}

function bundleNameUtil(key) {
    return key.split("/")[0].toLowerCase()
} 

//Script Body

bundleParse()




