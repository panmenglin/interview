var fs = require('fs')

var variableMap = {
  'PATH': process.argv[2] || './',
  'TREE_DATA': null
}

let isDic = (url) => fs.statSync(url).isDirectory()

const traverseFiles = (path, deep) => {
  try {
    var files = fs.readdirSync(path)
  } catch (err) {
    console.log('目录不存在')
    return
  }

  const tree = []

  for (let i = 0, len = files.length; i < len; i++) {
    let dirPath = path + '/' + files[i]
    // 文件夹
    if (isDic(dirPath)) {
      const curDir = {
        name: files[i],
        path: dirPath,
        children: traverseFiles(dirPath + '/', deep + 1)
      }

      tree.push(curDir)
    } else {
      // 文件
      tree.push({
        name: files[i],
        path: dirPath
      })
    }
  }

  return tree
}


variableMap.TREE_DATA = traverseFiles(variableMap.PATH, 1)

if (variableMap.TREE_DATA) {
  fs.readFile('./source/fileTree.html', (err, file) => {

    if (err) throw err;
    let fileString = file.toString()
    Object.keys(variableMap).forEach(key => {
      fileString = fileString.replace(new RegExp(`<%${key}%>`), JSON.stringify(variableMap[key]))
    })

    fs.writeFile('./fileTreeTemplate.html', fileString, function (err, data) {
      if (err) {
        throw err;
      }
      console.log('目录生成：./fileTreeTemplate.html')
    })

  });
}
